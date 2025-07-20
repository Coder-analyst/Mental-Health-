import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const FloatingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
`;

const FloatingPanel = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  pointer-events: auto;
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
`;

const WeatherWidget = styled(FloatingPanel)`
  top: 120px;
  left: 30px;
  width: 200px;
`;

const StockTicker = styled(FloatingPanel)`
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 60px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const QuickStats = styled(FloatingPanel)`
  top: 200px;
  right: 400px;
  width: 250px;
`;

export default function FloatingUI() {
  const [weather, setWeather] = useState({
    temp: '28°C',
    condition: 'Sunny',
    humidity: '65%'
  });

  const [realEstateStocks] = useState([
    { name: 'DLF', price: '₹485.50', change: '+2.3%' },
    { name: 'Lodha', price: '₹892.20', change: '+1.8%' },
    { name: 'Oberoi', price: '₹1,245.00', change: '+3.1%' },
    { name: 'Godrej', price: '₹2,180.75', change: '+0.9%' }
  ]);

  const [stats] = useState({
    totalProperties: '1,24,567',
    avgPrice: '₹1.2Cr',
    growth: '+15.2%',
    hotArea: 'Navi Mumbai'
  });

  return (
    <FloatingContainer>
      {/* Weather Widget */}
      <WeatherWidget
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🌤️</div>
          <div style={{ 
            fontFamily: 'Orbitron', 
            color: '#ffffff', 
            fontSize: '18px',
            marginBottom: '5px'
          }}>
            Mumbai Weather
          </div>
          <div style={{ 
            fontFamily: 'Rajdhani', 
            color: '#00ffff', 
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {weather.temp}
          </div>
          <div style={{ 
            fontFamily: 'Rajdhani', 
            color: '#ffffff', 
            fontSize: '14px'
          }}>
            {weather.condition} • Humidity: {weather.humidity}
          </div>
        </div>
      </WeatherWidget>

      {/* Real Estate Stock Ticker */}
      <StockTicker
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          style={{
            display: 'flex',
            gap: '30px',
            whiteSpace: 'nowrap',
            fontFamily: 'Rajdhani',
            fontSize: '16px'
          }}
          animate={{ x: [-400, 400] }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {realEstateStocks.map((stock, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{stock.name}</span>
              <span style={{ color: '#ffff00' }}>{stock.price}</span>
              <span style={{ 
                color: stock.change.startsWith('+') ? '#00ff00' : '#ff0000' 
              }}>
                {stock.change}
              </span>
            </div>
          ))}
        </motion.div>
      </StockTicker>

      {/* Quick Stats Panel */}
      <QuickStats
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <div style={{ 
          fontFamily: 'Orbitron', 
          color: '#00ffff', 
          fontSize: '16px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          📊 Market Stats
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontFamily: 'Rajdhani', 
              color: '#ffffff', 
              fontSize: '12px' 
            }}>
              Properties
            </div>
            <div style={{ 
              fontFamily: 'Orbitron', 
              color: '#ffff00', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {stats.totalProperties}
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontFamily: 'Rajdhani', 
              color: '#ffffff', 
              fontSize: '12px' 
            }}>
              Avg Price
            </div>
            <div style={{ 
              fontFamily: 'Orbitron', 
              color: '#00ff00', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {stats.avgPrice}
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontFamily: 'Rajdhani', 
              color: '#ffffff', 
              fontSize: '12px' 
            }}>
              Growth
            </div>
            <div style={{ 
              fontFamily: 'Orbitron', 
              color: '#ff00ff', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {stats.growth}
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontFamily: 'Rajdhani', 
              color: '#ffffff', 
              fontSize: '12px' 
            }}>
              Hot Area
            </div>
            <div style={{ 
              fontFamily: 'Orbitron', 
              color: '#ff8800', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {stats.hotArea}
            </div>
          </div>
        </div>
      </QuickStats>
    </FloatingContainer>
  );
}