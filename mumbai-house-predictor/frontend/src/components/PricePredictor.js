import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const PredictorContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1200px;
  height: 80%;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.9) 0%, 
    rgba(0, 255, 255, 0.1) 50%, 
    rgba(255, 0, 255, 0.1) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 25px;
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  overflow-y: auto;
  box-shadow: 
    0 0 50px rgba(0, 255, 255, 0.3),
    inset 0 0 50px rgba(0, 255, 255, 0.1);
  z-index: 1000;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-family: 'Orbitron', monospace;
  color: #00ffff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  text-shadow: 0 0 20px #00ffff;
  grid-column: 1 / -1;
`;

const FormGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Rajdhani', sans-serif;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #00ffff;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #00ffff;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
  
  option {
    background: #000000;
    color: #ffffff;
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Rajdhani', sans-serif;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
  }
  
  input {
    accent-color: #00ffff;
  }
`;

const PredictButton = styled(motion.button)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #00ffff, #ff00ff);
  border: none;
  border-radius: 25px;
  color: #000000;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.5);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(0, 255, 255, 0.1) 0%, 
    rgba(255, 0, 255, 0.1) 100%);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  width: 100%;
  box-shadow: 
    0 0 30px rgba(0, 255, 255, 0.2),
    inset 0 0 30px rgba(0, 255, 255, 0.1);
`;

const PriceDisplay = styled.div`
  font-family: 'Orbitron', monospace;
  font-size: 48px;
  font-weight: 900;
  color: #00ff00;
  text-shadow: 0 0 20px #00ff00;
  margin-bottom: 15px;
  animation: glow 2s infinite alternate;
  
  @keyframes glow {
    from { text-shadow: 0 0 20px #00ff00; }
    to { text-shadow: 0 0 30px #00ff00, 0 0 40px #00ff00; }
  }
`;

const PriceSubtext = styled.div`
  font-family: 'Rajdhani', sans-serif;
  color: #ffffff;
  font-size: 18px;
  margin-bottom: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
`;

const InfoItem = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
`;

const InfoLabel = styled.div`
  font-family: 'Rajdhani', sans-serif;
  color: #00ffff;
  font-size: 14px;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-family: 'Orbitron', monospace;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(0, 255, 255, 0.3);
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  margin: 20px auto;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.3);
  border: 2px solid #ff0000;
  color: #ff0000;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const mumbaiAreas = [
  'Bandra West', 'Bandra East', 'Andheri East', 'Andheri West', 'Powai',
  'Navi Mumbai', 'Thane', 'Ghatkopar', 'Kandivali', 'Borivali',
  'Malad', 'Goregaon', 'Juhu', 'Versova', 'Lokhandwala',
  'Worli', 'Lower Parel', 'Prabhadevi', 'Dadar', 'Kurla'
];

const propertyTypes = [
  '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK',
  'Studio', 'Penthouse', 'Villa', 'Bungalow'
];

const amenities = [
  'Lift', 'Security', 'Parking', 'Gym', 'Swimming Pool',
  'Garden', 'Club House', 'Power Backup', 'Water Supply',
  'CCTV', 'Intercom', 'Fire Safety'
];

const nearbyFacilities = [
  'Metro Station', 'Railway Station', 'School', 'Hospital',
  'Mall', 'Airport', 'IT Park', 'Market', 'Bank', 'ATM'
];

export default function PricePredictor({ userProfile, onClose }) {
  const [formData, setFormData] = useState({
    area: '',
    propertyType: '',
    carpetArea: '',
    floor: '',
    totalFloors: '',
    constructionYear: '',
    amenities: [],
    nearbyFacilities: [],
    income: '',
    caste: '',
    age: '',
    firstTimeBuyer: false
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const calculatePrice = () => {
    setLoading(true);
    
    // Simulate AI prediction
    setTimeout(() => {
      const basePrice = {
        'Bandra West': 180,
        'Bandra East': 120,
        'Andheri East': 95,
        'Andheri West': 110,
        'Powai': 140,
        'Navi Mumbai': 75,
        'Thane': 65,
        'Ghatkopar': 85,
        'Kandivali': 78,
        'Borivali': 72,
        'Malad': 68,
        'Goregaon': 76,
        'Juhu': 200,
        'Versova': 130,
        'Lokhandwala': 125,
        'Worli': 250,
        'Lower Parel': 220,
        'Prabhadevi': 180,
        'Dadar': 160,
        'Kurla': 90
      }[formData.area] || 100;

      const typeMultiplier = {
        'Studio': 0.6,
        '1 BHK': 0.8,
        '2 BHK': 1.0,
        '3 BHK': 1.3,
        '4 BHK': 1.6,
        '5+ BHK': 2.0,
        'Penthouse': 2.5,
        'Villa': 3.0,
        'Bungalow': 3.5
      }[formData.propertyType] || 1.0;

      let price = basePrice * typeMultiplier * (formData.carpetArea / 100);
      
      // Amenities bonus
      price += formData.amenities.length * 2;
      
      // Nearby facilities bonus
      price += formData.nearbyFacilities.length * 3;
      
      // Floor premium
      if (formData.floor > formData.totalFloors * 0.7) {
        price *= 1.1;
      }
      
      // Construction year factor
      const age = 2024 - formData.constructionYear;
      if (age < 5) price *= 1.1;
      else if (age > 20) price *= 0.9;

      const finalPrice = Math.round(price * 100) / 100;
      const pricePerSqft = Math.round((finalPrice * 100000) / formData.carpetArea);
      const growthPrediction = Math.random() * 20 + 5; // 5-25% growth

      setPrediction({
        price: finalPrice,
        pricePerSqft,
        growthPrediction,
        confidence: Math.random() * 20 + 80, // 80-100% confidence
        marketTrend: Math.random() > 0.5 ? 'BULLISH' : 'STABLE',
        investmentRating: finalPrice > 150 ? '⭐⭐⭐⭐⭐' : finalPrice > 100 ? '⭐⭐⭐⭐' : '⭐⭐⭐'
      });

      // Calculate applicable schemes
      const applicableSchemes = [];
      if (formData.income < 600000) {
        applicableSchemes.push({
          name: 'PMAY (Urban)',
          subsidy: '₹2.5 Lakhs',
          eligibility: '95%'
        });
      }
      if (formData.firstTimeBuyer) {
        applicableSchemes.push({
          name: 'First Time Buyer Scheme',
          subsidy: '₹1.5 Lakhs',
          eligibility: '100%'
        });
      }
      if (formData.caste && formData.caste !== 'General') {
        applicableSchemes.push({
          name: 'Caste-based Subsidy',
          subsidy: '₹1 Lakh',
          eligibility: '90%'
        });
      }
      
      setSchemes(applicableSchemes);
      setLoading(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <PredictorContainer
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <CloseButton
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ×
        </CloseButton>

        <Title>🔮 AI-Powered Price Predictor</Title>

        <FormSection>
          <FormGroup
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Label>Location</Label>
            <Select
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
            >
              <option value="">Select Area</option>
              {mumbaiAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Label>Property Type</Label>
            <Select
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
            >
              <option value="">Select Type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Label>Carpet Area (sq.ft)</Label>
            <Input
              type="number"
              placeholder="e.g., 600"
              value={formData.carpetArea}
              onChange={(e) => handleInputChange('carpetArea', e.target.value)}
            />
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <FormGroup
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label>Floor</Label>
              <Input
                type="number"
                placeholder="e.g., 5"
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', e.target.value)}
              />
            </FormGroup>

            <FormGroup
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Label>Total Floors</Label>
              <Input
                type="number"
                placeholder="e.g., 20"
                value={formData.totalFloors}
                onChange={(e) => handleInputChange('totalFloors', e.target.value)}
              />
            </FormGroup>
          </div>

          <FormGroup
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Label>Construction Year</Label>
            <Input
              type="number"
              placeholder="e.g., 2020"
              value={formData.constructionYear}
              onChange={(e) => handleInputChange('constructionYear', e.target.value)}
            />
          </FormGroup>

          <FormGroup
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Label>Amenities</Label>
            <CheckboxGroup>
              {amenities.map(amenity => (
                <CheckboxItem key={amenity}>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange('amenities', amenity, e.target.checked)}
                  />
                  {amenity}
                </CheckboxItem>
              ))}
            </CheckboxGroup>
          </FormGroup>

          <FormGroup
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Label>Nearby Facilities</Label>
            <CheckboxGroup>
              {nearbyFacilities.map(facility => (
                <CheckboxItem key={facility}>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange('nearbyFacilities', facility, e.target.checked)}
                  />
                  {facility}
                </CheckboxItem>
              ))}
            </CheckboxGroup>
          </FormGroup>

          <PredictButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={calculatePrice}
            disabled={loading || !formData.area || !formData.propertyType || !formData.carpetArea}
          >
            {loading ? 'Predicting...' : '🚀 Predict Price'}
          </PredictButton>
        </FormSection>

        <ResultSection>
          {loading && (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}

          {prediction && !loading && (
            <ResultCard
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <PriceDisplay>₹{prediction.price}L</PriceDisplay>
              <PriceSubtext>₹{prediction.pricePerSqft}/sq.ft</PriceSubtext>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Growth Prediction</InfoLabel>
                  <InfoValue style={{ color: '#00ff00' }}>
                    +{prediction.growthPrediction.toFixed(1)}%
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Confidence</InfoLabel>
                  <InfoValue style={{ color: '#ffff00' }}>
                    {prediction.confidence.toFixed(1)}%
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Market Trend</InfoLabel>
                  <InfoValue style={{ color: '#ff00ff' }}>
                    {prediction.marketTrend}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Investment Rating</InfoLabel>
                  <InfoValue style={{ color: '#ffaa00' }}>
                    {prediction.investmentRating}
                  </InfoValue>
                </InfoItem>
              </InfoGrid>

              {schemes.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <InfoLabel style={{ fontSize: '16px', marginBottom: '10px' }}>
                    💰 Applicable Schemes
                  </InfoLabel>
                  {schemes.map((scheme, index) => (
                    <InfoItem key={index} style={{ marginBottom: '10px' }}>
                      <InfoLabel>{scheme.name}</InfoLabel>
                      <InfoValue style={{ color: '#00ff00' }}>
                        {scheme.subsidy} ({scheme.eligibility} eligible)
                      </InfoValue>
                    </InfoItem>
                  ))}
                </div>
              )}
            </ResultCard>
          )}
        </ResultSection>
      </PredictorContainer>
    </AnimatePresence>
  );
}