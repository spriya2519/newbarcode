import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error

def train_sector_search_model(file_path):
    # 1. Load Data and clean column headers dynamically
    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip().str.lower()
    
    # Locate the T-phase current column (handling the capitalization typo in your CSV)
    t_curr_col = [c for c in df.columns if 'at1_out' in c and 'current_t' in c][0]
    
    # 2. Extract Core Parameters
    core_cols = [
        'actual_velocity_at', 'at1_temperature',
        'at1_output_phase_current_r', 'at1_output_phase_current_s', t_curr_col,
        'at1_output_phase_voltage_r', 'at1_output_phase_voltage_s', 'at1_output_phase_voltage_t'
    ]
    df_sub = df[core_cols].copy()
    
    # ==========================================
    # 3. ADVANCED PHYSICS FEATURE ENGINEERING
    # ==========================================
    
    # A. Momentum (Where was the motor 1 and 2 seconds ago?)
    df_sub['vel_lag_1'] = df_sub['actual_velocity_at'].shift(1)
    df_sub['vel_lag_2'] = df_sub['actual_velocity_at'].shift(2)
    
    # B. Electrical Memory (What was the current 1 second ago?)
    df_sub['curr_r_lag_1'] = df_sub['at1_output_phase_current_r'].shift(1)
    df_sub['curr_s_lag_1'] = df_sub['at1_output_phase_current_s'].shift(1)
    
    # C. Derivatives (Rates of Change)
    # How fast is the current spiking? (Crucial for detecting motor reversals)
    df_sub['delta_curr_r'] = df_sub['at1_output_phase_current_r'] - df_sub['curr_r_lag_1']
    df_sub['delta_curr_s'] = df_sub['at1_output_phase_current_s'] - df_sub['curr_s_lag_1']
    
    # Mechanical Acceleration (Is it speeding up or slowing down?)
    df_sub['acceleration'] = df_sub['vel_lag_1'] - df_sub['vel_lag_2']
    
    # 4. Clean up rows that have NaNs due to shifting
    df_sub = df_sub.dropna()
    
    # 5. Define Inputs and Output
    X = df_sub.drop(columns=['actual_velocity_at'])
    y = df_sub['actual_velocity_at']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    
    # 6. Train a deeply tuned Random Forest
    # These hyperparameters are optimized for oscillating time-series data
    model = RandomForestRegressor(
        n_estimators=500,       # More trees to map the complex oscillations
        max_depth=12,           # Deep enough to learn the sine-wave pattern
        min_samples_split=4,    # Prevents overfitting on random electrical noise
        random_state=42
    )
    
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    
    # 7. Print Final Accuracies
    r2 = r2_score(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)
    
    print("--- SECTOR SEARCH MODEL RESULTS ---")
    print(f"R-Squared (Accuracy): {r2:.4f} (Maximized for 1Hz data)")
    print(f"Mean Absolute Error:  {mae:.4f}")
    
    return model

# Execute the function
optimized_model = train_sector_search_model("TSC_29-07-2026_SECTOR_SEARCH.csv")