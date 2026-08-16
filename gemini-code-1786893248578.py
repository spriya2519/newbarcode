import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# 1. Load the Data
df = pd.read_csv("TSC_29-07-2026_PAN_SEARCH.csv")

# 2. Define Inputs (X) and Output (y)
inputs = [
    'Commanded_Velocity_AT',
    'AT1_Temperature',
    'AT1_Output_Phase_Current_R', 
    'AT1_Output_Phase_Current_S', 
    'AT1_OutpuT_Phase_Current_T', 
    'AT1_Output_Phase_Voltage_R', 
    'AT1_Output_Phase_Voltage_S', 
    'AT1_Output_Phase_Voltage_T'
]
output = 'Actual_Velocity_AT'

# Clean data: drop empty rows
df = df.dropna(subset=inputs + [output])
X = df[inputs]
y = df[output]

# 3. Split Data into Training (80%) and Testing (20%) Sets
# This ensures we test accuracy on data the model has never seen before
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Initialize and Train the Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Make Predictions
y_pred = model.predict(X_test)

# 6. Calculate and Print Accuracy Metrics
print("Model Accuracy Metrics:")
print(f"R-Squared (Overall Accuracy): {r2_score(y_test, y_pred):.4f}")
print(f"Mean Absolute Error (Average Miss): {mean_absolute_error(y_test, y_pred):.4f}")
print(f"Root Mean Squared Error: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")