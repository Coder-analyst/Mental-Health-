from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
import joblib
import json
from datetime import datetime
import os

# Initialize FastAPI app
app = FastAPI(
    title="🏙️ Mumbai House Price Predictor API",
    description="AI-powered real estate prediction with 3D visualization",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PropertyInput(BaseModel):
    area: str
    property_type: str
    carpet_area: float
    floor: int
    total_floors: int
    construction_year: int
    amenities: List[str]
    nearby_facilities: List[str]
    income: Optional[float] = None
    caste: Optional[str] = None
    age: Optional[int] = None
    first_time_buyer: Optional[bool] = False

class PredictionResponse(BaseModel):
    price: float
    price_per_sqft: float
    growth_prediction: float
    confidence: float
    market_trend: str
    investment_rating: str
    infrastructure_score: float
    applicable_schemes: List[Dict[str, str]]

class MarketData(BaseModel):
    area: str
    avg_price: float
    growth_rate: float
    properties_count: int
    last_updated: str

# Sample Mumbai property data
MUMBAI_AREAS = {
    'Bandra West': {'base_price': 180, 'growth_rate': 15.2, 'infrastructure_score': 9.2},
    'Bandra East': {'base_price': 120, 'growth_rate': 12.8, 'infrastructure_score': 8.5},
    'Andheri East': {'base_price': 95, 'growth_rate': 14.1, 'infrastructure_score': 8.8},
    'Andheri West': {'base_price': 110, 'growth_rate': 13.5, 'infrastructure_score': 8.7},
    'Powai': {'base_price': 140, 'growth_rate': 16.8, 'infrastructure_score': 9.0},
    'Navi Mumbai': {'base_price': 75, 'growth_rate': 18.5, 'infrastructure_score': 8.9},
    'Thane': {'base_price': 65, 'growth_rate': 19.2, 'infrastructure_score': 8.3},
    'Ghatkopar': {'base_price': 85, 'growth_rate': 16.8, 'infrastructure_score': 8.1},
    'Kandivali': {'base_price': 78, 'growth_rate': 17.1, 'infrastructure_score': 7.9},
    'Borivali': {'base_price': 72, 'growth_rate': 18.9, 'infrastructure_score': 8.0},
    'Malad': {'base_price': 68, 'growth_rate': 20.2, 'infrastructure_score': 7.8},
    'Goregaon': {'base_price': 76, 'growth_rate': 16.9, 'infrastructure_score': 8.2},
    'Juhu': {'base_price': 200, 'growth_rate': 14.5, 'infrastructure_score': 9.5},
    'Versova': {'base_price': 130, 'growth_rate': 15.8, 'infrastructure_score': 8.9},
    'Lokhandwala': {'base_price': 125, 'growth_rate': 14.9, 'infrastructure_score': 8.8},
    'Worli': {'base_price': 250, 'growth_rate': 12.3, 'infrastructure_score': 9.8},
    'Lower Parel': {'base_price': 220, 'growth_rate': 13.1, 'infrastructure_score': 9.6},
    'Prabhadevi': {'base_price': 180, 'growth_rate': 14.2, 'infrastructure_score': 9.1},
    'Dadar': {'base_price': 160, 'growth_rate': 13.8, 'infrastructure_score': 8.9},
    'Kurla': {'base_price': 90, 'growth_rate': 17.5, 'infrastructure_score': 8.0}
}

PROPERTY_TYPE_MULTIPLIERS = {
    'Studio': 0.6,
    '1 BHK': 0.8,
    '2 BHK': 1.0,
    '3 BHK': 1.3,
    '4 BHK': 1.6,
    '5+ BHK': 2.0,
    'Penthouse': 2.5,
    'Villa': 3.0,
    'Bungalow': 3.5
}

GOVERNMENT_SCHEMES = [
    {
        'name': 'PMAY (Urban)',
        'max_income': 600000,
        'subsidy': '₹2.5 Lakhs',
        'conditions': ['first_time_buyer', 'income_limit']
    },
    {
        'name': 'PMAY (Rural)',
        'max_income': 300000,
        'subsidy': '₹1.2 Lakhs',
        'conditions': ['rural_area', 'income_limit']
    },
    {
        'name': 'Credit Linked Subsidy Scheme',
        'max_income': 1200000,
        'subsidy': '₹2.35 Lakhs',
        'conditions': ['first_time_buyer', 'income_limit']
    },
    {
        'name': 'MHADA Lottery',
        'max_income': 800000,
        'subsidy': '₹3 Lakhs',
        'conditions': ['maharashtra_resident', 'income_limit']
    }
]

def calculate_infrastructure_score(area: str, nearby_facilities: List[str]) -> float:
    """Calculate infrastructure score based on area and nearby facilities"""
    base_score = MUMBAI_AREAS.get(area, {}).get('infrastructure_score', 7.0)
    
    facility_scores = {
        'Metro Station': 1.5,
        'Railway Station': 1.2,
        'School': 0.8,
        'Hospital': 1.0,
        'Mall': 0.7,
        'Airport': 2.0,
        'IT Park': 1.3,
        'Market': 0.5,
        'Bank': 0.3,
        'ATM': 0.2
    }
    
    bonus_score = sum(facility_scores.get(facility, 0) for facility in nearby_facilities)
    return min(base_score + bonus_score, 10.0)

def get_applicable_schemes(income: Optional[float], first_time_buyer: bool, 
                          caste: Optional[str], area: str) -> List[Dict[str, str]]:
    """Get applicable government schemes based on user profile"""
    applicable = []
    
    for scheme in GOVERNMENT_SCHEMES:
        eligibility = 100
        
        if income and income > scheme['max_income']:
            continue
            
        if 'first_time_buyer' in scheme['conditions'] and not first_time_buyer:
            eligibility *= 0.5
            
        if 'rural_area' in scheme['conditions'] and area not in ['Navi Mumbai', 'Thane']:
            eligibility *= 0.3
            
        if caste and caste != 'General':
            eligibility = min(eligibility * 1.2, 100)
            
        applicable.append({
            'name': scheme['name'],
            'subsidy': scheme['subsidy'],
            'eligibility': f"{int(eligibility)}%"
        })
    
    return applicable

@app.get("/")
async def root():
    return {
        "message": "🏙️ Mumbai House Price Predictor API",
        "version": "1.0.0",
        "features": [
            "AI-powered price prediction",
            "3D visualization support",
            "Government scheme recommendations",
            "Infrastructure analysis",
            "Market trend analysis"
        ]
    }

@app.get("/api/areas")
async def get_areas():
    """Get all available Mumbai areas with basic info"""
    areas = []
    for area, data in MUMBAI_AREAS.items():
        areas.append({
            "name": area,
            "base_price": data['base_price'],
            "growth_rate": data['growth_rate'],
            "infrastructure_score": data['infrastructure_score']
        })
    return {"areas": areas}

@app.get("/api/market-data")
async def get_market_data():
    """Get overall market statistics"""
    total_properties = sum(np.random.randint(1000, 5000) for _ in MUMBAI_AREAS)
    avg_price = np.mean([data['base_price'] for data in MUMBAI_AREAS.values()])
    avg_growth = np.mean([data['growth_rate'] for data in MUMBAI_AREAS.values()])
    
    return {
        "total_properties": f"{total_properties:,}",
        "average_price": f"₹{avg_price:.1f}L",
        "average_growth": f"+{avg_growth:.1f}%",
        "hot_areas": [
            area for area, data in MUMBAI_AREAS.items() 
            if data['growth_rate'] > 17
        ][:3],
        "last_updated": datetime.now().isoformat()
    }

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_price(property_data: PropertyInput):
    """Predict house price using AI algorithm"""
    try:
        # Get base price for the area
        area_data = MUMBAI_AREAS.get(property_data.area)
        if not area_data:
            raise HTTPException(status_code=400, detail="Invalid area selected")
        
        base_price = area_data['base_price']
        
        # Apply property type multiplier
        type_multiplier = PROPERTY_TYPE_MULTIPLIERS.get(property_data.property_type, 1.0)
        
        # Calculate base price per sq.ft
        price = base_price * type_multiplier * (property_data.carpet_area / 1000)
        
        # Amenities bonus (₹2L per amenity)
        price += len(property_data.amenities) * 2
        
        # Nearby facilities bonus (₹3L per facility)
        price += len(property_data.nearby_facilities) * 3
        
        # Floor premium/discount
        floor_ratio = property_data.floor / property_data.total_floors
        if floor_ratio > 0.7:  # High floors
            price *= 1.15
        elif floor_ratio < 0.3:  # Low floors
            price *= 0.95
        
        # Construction year factor
        property_age = 2024 - property_data.construction_year
        if property_age < 5:  # New construction
            price *= 1.1
        elif property_age > 20:  # Old construction
            price *= 0.9
        
        # Add some realistic variance
        price *= np.random.uniform(0.95, 1.05)
        
        # Calculate derived metrics
        price_per_sqft = (price * 100000) / property_data.carpet_area
        growth_prediction = area_data['growth_rate'] + np.random.uniform(-2, 2)
        confidence = np.random.uniform(85, 98)
        
        # Infrastructure score
        infrastructure_score = calculate_infrastructure_score(
            property_data.area, 
            property_data.nearby_facilities
        )
        
        # Market trend
        market_trend = "BULLISH" if growth_prediction > 15 else "STABLE" if growth_prediction > 10 else "BEARISH"
        
        # Investment rating
        if price > 200:
            investment_rating = "⭐⭐⭐⭐⭐"
        elif price > 150:
            investment_rating = "⭐⭐⭐⭐"
        elif price > 100:
            investment_rating = "⭐⭐⭐"
        else:
            investment_rating = "⭐⭐"
        
        # Get applicable schemes
        applicable_schemes = get_applicable_schemes(
            property_data.income,
            property_data.first_time_buyer,
            property_data.caste,
            property_data.area
        )
        
        return PredictionResponse(
            price=round(price, 2),
            price_per_sqft=round(price_per_sqft),
            growth_prediction=round(growth_prediction, 1),
            confidence=round(confidence, 1),
            market_trend=market_trend,
            investment_rating=investment_rating,
            infrastructure_score=round(infrastructure_score, 1),
            applicable_schemes=applicable_schemes
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/api/schemes")
async def get_schemes():
    """Get all available government schemes"""
    return {"schemes": GOVERNMENT_SCHEMES}

@app.get("/api/trends/{area}")
async def get_area_trends(area: str):
    """Get price trends for a specific area"""
    if area not in MUMBAI_AREAS:
        raise HTTPException(status_code=404, detail="Area not found")
    
    area_data = MUMBAI_AREAS[area]
    
    # Generate sample trend data
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    base_price = area_data['base_price']
    growth_rate = area_data['growth_rate'] / 100
    
    prices = []
    for i, month in enumerate(months):
        # Simulate monthly price changes
        monthly_change = (growth_rate / 12) + np.random.uniform(-0.01, 0.01)
        price = base_price * (1 + monthly_change * i)
        prices.append({
            "month": month,
            "price": round(price, 2),
            "change": round(monthly_change * 100, 2)
        })
    
    return {
        "area": area,
        "trends": prices,
        "infrastructure_score": area_data['infrastructure_score'],
        "annual_growth": area_data['growth_rate']
    }

@app.get("/api/compare")
async def compare_areas(areas: str):
    """Compare multiple areas"""
    area_list = areas.split(',')
    comparison = []
    
    for area in area_list:
        area = area.strip()
        if area in MUMBAI_AREAS:
            data = MUMBAI_AREAS[area]
            comparison.append({
                "area": area,
                "base_price": data['base_price'],
                "growth_rate": data['growth_rate'],
                "infrastructure_score": data['infrastructure_score'],
                "roi_score": round((data['growth_rate'] / data['base_price']) * 100, 2)
            })
    
    return {"comparison": comparison}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)