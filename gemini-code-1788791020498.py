import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

def create_lstm_sequences(data, target, time_steps):
    """Converts 2D tabular data into the 3D array required by LSTMs."""
    X, y = [], []
    for i in range(len(data) - time_steps):
        X.append(data[i:(i + time_steps)])
        y.append(target[i + time_steps])
    return np.array(X), np.array(y)

def prep_csv(file_path, mode):
    """Loads a CSV, cleans headers, and assigns the operating mode."""
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Warning: {file_path} not found. Skipping.")
        return pd.DataFrame()
        
    df.columns = df.columns.str.strip().str.lower()
    
    # Fix the capitalization typo in the T-phase current column
    t_col = [c for c in df.columns if 'at1_out' in c and 'current_t' in c]
    if t_col:
        df = df.rename(columns={t_col[0]: 'at1_output_phase_current_t'})
        
    df['operating_mode'] = mode
    return df

# 1. Load and combine the separate CSV files dynamically
df_standby = prep_csv("TSC_29-07-2026_PMS_STAND_BY.csv", 1)
df_sector  = prep_csv("TSC_29-07-2026_SECTOR_SEARCH.csv", 2)
df_pan     = prep_csv("TSC_29-07-2026_PAN_SEARCH.csv", 3)

df = pd.concat([df_standby, df_sector, df_pan], ignore_index=True)

features = [
    'operating_mode', 'commanded_velocity_at', 'at1_temperature',
    'at1_output_phase_current_r', 'at1_output_phase_current_s', 'at1_output_phase_current_t',
    'at1_output_phase_voltage_r', 'at1_output_phase_voltage_s', 'at1_output_phase_voltage_t'
]

# Drop any incomplete rows before scaling
df = df.dropna(subset=features + ['actual_velocity_at'])

X_raw = df[features].values
y_raw = df['actual_velocity_at'].values

# 2. Scale the Data
scaler_X = MinMaxScaler()
X_scaled = scaler_X.fit_transform(X_raw)

# 3. Create the 3D Sequences
TIME_STEPS = 3
X_seq, y_seq = create_lstm_sequences(X_scaled, y_raw, TIME_STEPS)

# Split into Training and Testing
X_train, X_test, y_train, y_test = train_test_split(X_seq, y_seq, test_size=0.15, random_state=42, shuffle=False)

# 4. Build the LSTM Architecture
model = Sequential([
    LSTM(64, activation='relu', input_shape=(X_train.shape[1], X_train.shape[2]), return_sequences=False),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(1)
])

# 5. Compile and Train
model.compile(optimizer='adam', loss='mse', metrics=['mae'])

print(f"Training LSTM Neural Network on {len(df)} data points...")
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_data=(X_test, y_test),
    verbose=1
)

# 6. Evaluate
test_loss, test_mae = model.evaluate(X_test, y_test)
print(f"LSTM Mean Absolute Error: {test_mae:.4f}")

model.save('bldc_lstm_model.keras')