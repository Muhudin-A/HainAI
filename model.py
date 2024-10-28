import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder

# Load the data from the provided CSV file
data = pd.read_csv('test_results.csv')

# Print the first few rows to check the data
print(data.head())

# Check for missing values
print("Missing values in each column:\n", data.isnull().sum())

# Handle missing values (optional, depending on the dataset)
data.fillna(0, inplace=True)  # Example: filling missing values with 0

# Encoding categorical variables
label_encoder = LabelEncoder()
data['Test Type'] = label_encoder.fit_transform(data['Test Type'])
data['User Answer'] = label_encoder.fit_transform(data['User Answer'])
data['Correct Answer'] = label_encoder.fit_transform(data['Correct Answer'])
data['Result'] = label_encoder.fit_transform(data['Result'])

# Define features and target variable
X = data[['Test Type', 'User Answer', 'Correct Answer', 'Correct Attempts', 'Incorrect Attempts']]
y = data['Time Taken']

# Convert target variable to numeric if needed
y = pd.to_numeric(y, errors='coerce')

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a regression model
model = LinearRegression()

# Train the model
print("Training model...")
model.fit(X_train, y_train)
print("Model trained.")

# Make predictions
print("Making predictions...")
y_pred = model.predict(X_test)
print("Predictions made.")

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Mean Squared Error: {mse}')
print(f'R^2 Score: {r2}')
