import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

def process_mode_data(file_path, mode_value):
    """Loads CSV, standardizes columns, and calculates momentum per mode."""
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"File missing: {file_path}")
        return pd.DataFrame()
        
    # Standardize headers to lowercase to prevent typo crashes
    df.columns = df.columns.str.strip().str.lower()
    
    # Catch the specific capitalization typo in the T-phase current column
    t_curr_col = [c for c in df.columns if 'at1_out' in c and 'current_t' in c]
    t_col_name = t_curr_col[0] if t_curr_col else 'at1_output_phase_current_t'
    
    # Select only the intrinsic motor features
    core_cols = [
        'actual_velocity_at', 'commanded_velocity_at', 'at1_temperature',
        'at1_output_phase_current_r', 'at1_output_phase_current_s', t_col_name,
        'at1_output_phase_voltage_r', 'at1_output_phase_voltage_s', 'at1_output_phase_voltage_t'
    ]
    
    # Extract existing columns and explicitly rename the T-phase column
    df_sub = df[[c for c in core_cols if c in df.columns]].copy()
    if t_col_name in df_sub.columns:
        df_sub = df_sub.rename(columns={t_col_name: 'at1_output_phase_current_t'})
    
    # 1. Inject the Categorical Mode Feature
    df_sub['operating_mode'] = mode_value
    
    # 2. Engineer Short-Term Memory (Lags & Derivatives)
    df_sub['vel_lag_1'] = df_sub['actual_velocity_at'].shift(1)
    df_sub['vel_lag_2'] = df_sub['actual_velocity_at'].shift(2)
    df_sub['curr_r_lag_1'] = df_sub['at1_output_phase_current_r'].shift(1)
    df_sub['curr_s_lag_1'] = df_sub['at1_output_phase_current_s'].shift(1)
    
    df_sub['delta_curr_r'] = df_sub['at1_output_phase_current_r'] - df_sub['curr_r_lag_1']
    df_sub['delta_curr_s'] = df_sub['at1_output_phase_current_s'] - df_sub['curr_s_lag_1']
    df_sub['acceleration'] = df_sub['vel_lag_1'] - df_sub['vel_lag_2']
    
    # Drop rows with blank lag calculations
    return df_sub.dropna()

# Process each file with its corresponding mode integer
df_standby = process_mode_data("TSC_29-07-2026_PMS_STAND_BY.csv", 1)
df_sector  = process_mode_data("TSC_29-07-2026_SECTOR_SEARCH.csv", 2)
df_pan     = process_mode_data("TSC_29-07-2026_PAN_SEARCH.csv", 3)

# Concatenate into a single master dataset
df_master = pd.concat([df_standby, df_sector, df_pan], ignore_index=True)

# Separate Inputs (X) and Target (y)
X = df_master.drop(columns=['actual_velocity_at'])
y = df_master['actual_velocity_at']

# Train-Test Split (85% Train, 15% Test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

# Initialize Unified Model
unified_model = RandomForestRegressor(
    n_estimators=300, 
    max_depth=15, 
    min_samples_split=4, 
    random_state=42
)

unified_model.fit(X_train, y_train)
predictions = unified_model.predict(X_test)

print("--- UNIFIED MOTOR MODEL RESULTS ---")
print(f"Total Datapoints Analyzed: {len(df_master)}")
print(f"Master R-Squared Score: {r2_score(y_test, predictions):.4f}")
print(f"Mean Absolute Error: {mean_absolute_error(y_test, predictions):.4f}")

# Export for backend deployment
joblib.dump(unified_model, 'unified_bldc_model.pkl')