import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import joblib
import json
from datetime import datetime
import os

# Create synthetic Mumbai house price dataset
def generate_mumbai_dataset(n_samples=10000):
    """Generate synthetic Mumbai house price dataset"""
    
    areas = [
        'Bandra West', 'Bandra East', 'Andheri East', 'Andheri West', 'Powai',
        'Navi Mumbai', 'Thane', 'Ghatkopar', 'Kandivali', 'Borivali',
        'Malad', 'Goregaon', 'Juhu', 'Versova', 'Lokhandwala',
        'Worli', 'Lower Parel', 'Prabhadevi', 'Dadar', 'Kurla'
    ]
    
    property_types = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Studio', 'Penthouse']
    
    area_base_prices = {
        'Bandra West': 180, 'Bandra East': 120, 'Andheri East': 95, 'Andheri West': 110,
        'Powai': 140, 'Navi Mumbai': 75, 'Thane': 65, 'Ghatkopar': 85,
        'Kandivali': 78, 'Borivali': 72, 'Malad': 68, 'Goregaon': 76,
        'Juhu': 200, 'Versova': 130, 'Lokhandwala': 125, 'Worli': 250,
        'Lower Parel': 220, 'Prabhadevi': 180, 'Dadar': 160, 'Kurla': 90
    }
    
    type_multipliers = {
        'Studio': 0.6, '1 BHK': 0.8, '2 BHK': 1.0, '3 BHK': 1.3,
        '4 BHK': 1.6, '5+ BHK': 2.0, 'Penthouse': 2.5
    }
    
    data = []
    
    for _ in range(n_samples):
        area = np.random.choice(areas)
        property_type = np.random.choice(property_types)
        
        # Property characteristics
        carpet_area = np.random.normal(600, 200)  # sq.ft
        carpet_area = max(300, min(2000, carpet_area))  # Clamp between 300-2000
        
        total_floors = np.random.randint(5, 30)
        floor = np.random.randint(1, total_floors + 1)
        
        construction_year = np.random.randint(1990, 2024)
        
        # Amenities (0-10)
        num_amenities = np.random.poisson(4)
        num_amenities = max(0, min(10, num_amenities))
        
        # Nearby facilities (0-8)
        num_facilities = np.random.poisson(3)
        num_facilities = max(0, min(8, num_facilities))
        
        # Calculate price
        base_price = area_base_prices[area]
        type_mult = type_multipliers[property_type]
        
        # Base calculation
        price = base_price * type_mult * (carpet_area / 1000)
        
        # Amenities bonus
        price += num_amenities * 2
        
        # Facilities bonus
        price += num_facilities * 3
        
        # Floor premium
        floor_ratio = floor / total_floors
        if floor_ratio > 0.7:
            price *= 1.15
        elif floor_ratio < 0.3:
            price *= 0.95
        
        # Age factor
        age = 2024 - construction_year
        if age < 5:
            price *= 1.1
        elif age > 20:
            price *= 0.9
        
        # Add noise
        price *= np.random.normal(1.0, 0.1)
        price = max(20, price)  # Minimum price 20L
        
        data.append({
            'area': area,
            'property_type': property_type,
            'carpet_area': carpet_area,
            'floor': floor,
            'total_floors': total_floors,
            'construction_year': construction_year,
            'num_amenities': num_amenities,
            'num_facilities': num_facilities,
            'price': price
        })
    
    return pd.DataFrame(data)

def preprocess_data(df):
    """Preprocess the data for training"""
    
    # Encode categorical variables
    le_area = LabelEncoder()
    le_type = LabelEncoder()
    
    df_processed = df.copy()
    df_processed['area_encoded'] = le_area.fit_transform(df['area'])
    df_processed['type_encoded'] = le_type.fit_transform(df['property_type'])
    
    # Feature engineering
    df_processed['age'] = 2024 - df_processed['construction_year']
    df_processed['floor_ratio'] = df_processed['floor'] / df_processed['total_floors']
    df_processed['amenities_per_sqft'] = df_processed['num_amenities'] / df_processed['carpet_area'] * 1000
    df_processed['facilities_score'] = df_processed['num_facilities'] / 8.0  # Normalize to 0-1
    
    # Select features
    features = [
        'area_encoded', 'type_encoded', 'carpet_area', 'floor', 'total_floors',
        'age', 'num_amenities', 'num_facilities', 'floor_ratio', 
        'amenities_per_sqft', 'facilities_score'
    ]
    
    X = df_processed[features]
    y = df_processed['price']
    
    return X, y, le_area, le_type, features

def train_model():
    """Train the XGBoost model"""
    
    print("🏗️ Generating Mumbai house price dataset...")
    df = generate_mumbai_dataset(10000)
    
    print("📊 Dataset shape:", df.shape)
    print("\n📈 Price statistics:")
    print(df['price'].describe())
    
    print("\n🔧 Preprocessing data...")
    X, y, le_area, le_type, features = preprocess_data(df)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"📊 Training set: {X_train.shape}")
    print(f"📊 Test set: {X_test.shape}")
    
    # Train XGBoost model
    print("\n🤖 Training XGBoost model...")
    
    xgb_model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    
    xgb_model.fit(X_train, y_train)
    
    # Make predictions
    y_pred_train = xgb_model.predict(X_train)
    y_pred_test = xgb_model.predict(X_test)
    
    # Calculate metrics
    train_mae = mean_absolute_error(y_train, y_pred_train)
    test_mae = mean_absolute_error(y_test, y_pred_test)
    train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    
    print("\n📊 Model Performance:")
    print(f"Train MAE: ₹{train_mae:.2f}L")
    print(f"Test MAE: ₹{test_mae:.2f}L")
    print(f"Train RMSE: ₹{train_rmse:.2f}L")
    print(f"Test RMSE: ₹{test_rmse:.2f}L")
    print(f"Train R²: {train_r2:.4f}")
    print(f"Test R²: {test_r2:.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': xgb_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🎯 Feature Importance:")
    print(feature_importance)
    
    # Save model and encoders
    model_dir = "models"
    os.makedirs(model_dir, exist_ok=True)
    
    # Save XGBoost model
    joblib.dump(xgb_model, f"{model_dir}/mumbai_price_model.pkl")
    
    # Save encoders
    joblib.dump(le_area, f"{model_dir}/area_encoder.pkl")
    joblib.dump(le_type, f"{model_dir}/type_encoder.pkl")
    
    # Save feature list
    with open(f"{model_dir}/features.json", 'w') as f:
        json.dump(features, f)
    
    # Save model metadata
    metadata = {
        "model_type": "XGBoost",
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "features": features,
        "performance": {
            "test_mae": float(test_mae),
            "test_rmse": float(test_rmse),
            "test_r2": float(test_r2)
        },
        "created_at": datetime.now().isoformat(),
        "areas": list(le_area.classes_),
        "property_types": list(le_type.classes_)
    }
    
    with open(f"{model_dir}/model_metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n✅ Model saved to {model_dir}/")
    print("🎉 Training completed successfully!")
    
    return xgb_model, le_area, le_type, features

def predict_price(area, property_type, carpet_area, floor, total_floors, 
                  construction_year, num_amenities, num_facilities):
    """Make a price prediction using the trained model"""
    
    try:
        # Load model and encoders
        model = joblib.load("models/mumbai_price_model.pkl")
        le_area = joblib.load("models/area_encoder.pkl")
        le_type = joblib.load("models/type_encoder.pkl")
        
        with open("models/features.json", 'r') as f:
            features = json.load(f)
        
        # Prepare input data
        area_encoded = le_area.transform([area])[0]
        type_encoded = le_type.transform([property_type])[0]
        age = 2024 - construction_year
        floor_ratio = floor / total_floors
        amenities_per_sqft = num_amenities / carpet_area * 1000
        facilities_score = num_facilities / 8.0
        
        # Create feature vector
        X_input = np.array([[
            area_encoded, type_encoded, carpet_area, floor, total_floors,
            age, num_amenities, num_facilities, floor_ratio,
            amenities_per_sqft, facilities_score
        ]])
        
        # Make prediction
        prediction = model.predict(X_input)[0]
        
        return prediction
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return None

if __name__ == "__main__":
    # Train the model
    model, le_area, le_type, features = train_model()
    
    # Test prediction
    print("\n🧪 Testing prediction...")
    test_price = predict_price(
        area="Bandra West",
        property_type="2 BHK",
        carpet_area=600,
        floor=10,
        total_floors=20,
        construction_year=2020,
        num_amenities=5,
        num_facilities=3
    )
    
    print(f"Test prediction: ₹{test_price:.2f} Lakhs")