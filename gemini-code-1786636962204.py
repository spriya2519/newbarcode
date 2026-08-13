import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt

def analyze_bldc_motor(file_path):
    # 1. Load the dataset
    df = pd.read_csv(file_path)
    
    # 2. Calculate the Velocity Error 
    # This tells us how much the motor is struggling to hit its target speed
    df['Velocity_Error'] = abs(df['Commanded_Velocity_AT'] - df['Actual_Velocity_AT'])
    
    # 3. Isolate ONLY the parameters belonging to the BLDC motor (AT1)
    # Notice we include the 3 distinct phases (R, S, T) for Current and Voltage.
    # A spike in one phase but not the others is a classic indicator of a BLDC motor failing.
    bldc_features = [
        'Velocity_Error', 
        'AT1_Temperature',
        'AT1_Output_Phase_Current_R', 
        'AT1_Output_Phase_Current_S', 
        'AT1_OutpuT_Phase_Current_T', # Using the exact spelling from your CSV
        'AT1_Output_Phase_Voltage_R', 
        'AT1_Output_Phase_Voltage_S', 
        'AT1_Output_Phase_Voltage_T'
    ]
    
    # Extract only these columns and handle any blank spaces
    model_data = df[bldc_features].fillna(0)
    
    # 4. Train the Machine Learning Model
    # Isolation Forest is excellent for this because it requires very little setup
    # contamination=0.02 means we estimate about 2% of the operating time might be abnormal
    model = IsolationForest(contamination=0.02, random_state=42)
    
    # The model predicts '1' for normal operation and '-1' for an anomaly
    df['Anomaly_Status'] = model.fit_predict(model_data)
    
    # 5. Filter out the exact moments the motor acted abnormally
    anomalies = df[df['Anomaly_Status'] == -1]
    
    print(f"Total motor data points analyzed: {len(df)}")
    print(f"Anomalies found based purely on internal motor data: {len(anomalies)}")
    
    # 6. Visualize the Results
    plt.figure(figsize=(12, 6))
    
    # Plot the normal operating velocity
    plt.plot(df['Epoch'], df['Actual_Velocity_AT'], label='Actual Velocity', color='green', alpha=0.5)
    
    # Plot the anomalies as red dots
    plt.scatter(anomalies['Epoch'], anomalies['Actual_Velocity_AT'], color='red', label='Motor Anomaly', zorder=5)
    
    plt.title('BLDC Motor Health Monitoring')
    plt.xlabel('Epoch Time')
    plt.ylabel('Velocity')
    plt.legend()
    plt.grid(True)
    plt.show()
    
    return df

# Example of how to run the script:
# Ensure the CSV is in the same folder as this Python file
# df_results = analyze_bldc_motor("TSC_29-07-2026_PAN_SEARCH.csv")