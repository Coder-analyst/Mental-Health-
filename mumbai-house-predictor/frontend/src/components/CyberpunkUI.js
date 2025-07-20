import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const UIContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
`;

const TopBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, 
    rgba(0, 255, 255, 0.1) 0%, 
    rgba(255, 0, 255, 0.1) 50%, 
    rgba(255, 255, 0, 0.1) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(0, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  pointer-events: auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 255, 255, 0.1) 50%, 
      transparent 100%);
    animation: scanline 3s infinite;
  }
  
  @keyframes scanline {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const Logo = styled(motion.div)`
  font-family: 'Orbitron', monospace;
  font-size: 24px;
  font-weight: 900;
  color: #00ffff;
  text-shadow: 
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 0 30px #00ffff;
  display: flex;
  align-items: center;
  gap: 15px;
  
  &::before {
    content: '🏙️';
    font-size: 30px;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavButton = styled(motion.button)`
  background: linear-gradient(135deg, 
    rgba(0, 255, 255, 0.2) 0%, 
    rgba(0, 255, 255, 0.1) 100%);
  border: 1px solid #00ffff;
  color: #00ffff;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 100%);
    transition: left 0.5s ease;
  }
  
  &:hover {
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.5),
      inset 0 0 20px rgba(0, 255, 255, 0.1);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }
  
  &.active {
    background: linear-gradient(135deg, 
      rgba(255, 0, 255, 0.3) 0%, 
      rgba(255, 0, 255, 0.1) 100%);
    border-color: #ff00ff;
    color: #ff00ff;
    box-shadow: 
      0 0 25px rgba(255, 0, 255, 0.6),
      inset 0 0 25px rgba(255, 0, 255, 0.1);
  }
`;

const SidePanel = styled(motion.div)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(0, 255, 255, 0.1) 100%);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  padding: 25px;
  pointer-events: auto;
  box-shadow: 
    0 0 30px rgba(0, 255, 255, 0.2),
    inset 0 0 30px rgba(0, 255, 255, 0.05);
`;

const PanelTitle = styled.h3`
  font-family: 'Orbitron', monospace;
  color: #00ffff;
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
  text-shadow: 0 0 10px #00ffff;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ffff00;
    box-shadow: 0 0 15px rgba(255, 255, 0, 0.3);
    transform: translateX(10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

const FeatureText = styled.div`
  font-family: 'Rajdhani', sans-serif;
  color: #ffffff;
  font-size: 14px;
  line-height: 1.4;
`;

const StatusBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(0, 255, 255, 0.1) 100%);
  backdrop-filter: blur(15px);
  border-top: 2px solid rgba(0, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  pointer-events: auto;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00ffff;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color || '#00ff00'};
  box-shadow: 0 0 10px ${props => props.color || '#00ff00'};
  animation: pulse 2s infinite;
`;

const QuickActions = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  pointer-events: auto;
`;

const ActionButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    rgba(255, 0, 255, 0.3) 0%, 
    rgba(255, 0, 255, 0.1) 100%);
  border: 2px solid #ff00ff;
  color: #ff00ff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 
      0 0 25px rgba(255, 0, 255, 0.6),
      inset 0 0 25px rgba(255, 0, 255, 0.1);
  }
`;

const NotificationPanel = styled(motion.div)`
  position: absolute;
  top: 100px;
  right: 20px;
  width: 320px;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.9) 0%, 
    rgba(255, 255, 0, 0.1) 100%);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  pointer-events: auto;
`;

const Notification = styled(motion.div)`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 0, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  font-family: 'Rajdhani', sans-serif;
  color: #ffff00;
  font-size: 14px;
  
  .notification-title {
    font-weight: 700;
    margin-bottom: 5px;
    color: #ffffff;
  }
`;

const menuItems = [
  { id: 'home', label: 'HOME', icon: '🏠' },
  { id: 'predictor', label: 'PREDICT', icon: '🔮' },
  { id: 'hunt', label: 'HUNT', icon: '🎯' },
  { id: 'schemes', label: 'SCHEMES', icon: '💰' },
  { id: 'analytics', label: 'ANALYTICS', icon: '📊' },
];

const features = [
  { icon: '🤖', title: 'AI Assistant', desc: 'SmaartAva helps you navigate' },
  { icon: '🎮', title: 'Property Hunt', desc: 'Gamified property search' },
  { icon: '🏙️', title: '3D Cityscape', desc: 'Interactive Mumbai model' },
  { icon: '📈', title: 'Price Mountains', desc: 'Visualize market trends' },
  { icon: '🎯', title: 'Smart Predictions', desc: 'AI-powered price forecasts' },
  { icon: '💡', title: 'Scheme Advisor', desc: 'Government benefits finder' },
];

const notifications = [
  { title: 'Price Alert', content: 'Bandra West prices up 12% this month!' },
  { title: 'New Scheme', content: 'PMAY subsidy increased to ₹2.5L' },
  { title: 'Infrastructure', content: 'Metro Line 2A opening soon' },
  { title: 'Market Update', content: 'Navi Mumbai showing strong growth' },
];

export default function CyberpunkUI({ currentView, setCurrentView }) {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ONLINE');
  const [aiStatus, setAiStatus] = useState('ACTIVE');

  useEffect(() => {
    // Simulate system status changes
    const interval = setInterval(() => {
      const statuses = ['ONLINE', 'PROCESSING', 'ANALYZING'];
      setSystemStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return '#00ff00';
      case 'PROCESSING': return '#ffff00';
      case 'ANALYZING': return '#ff00ff';
      default: return '#00ffff';
    }
  };

  return (
    <UIContainer>
      {/* Top Navigation Bar */}
      <TopBar
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Logo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          MUMBAI PREDICTOR 3D
        </Logo>

        <NavMenu>
          {menuItems.map((item) => (
            <NavButton
              key={item.id}
              className={currentView === item.id ? 'active' : ''}
              onClick={() => setCurrentView(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon} {item.label}
            </NavButton>
          ))}
        </NavMenu>

        <div style={{ display: 'flex', gap: '15px' }}>
          <ActionButton
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.1 }}
          >
            🔔
          </ActionButton>
          <ActionButton
            onClick={() => setShowSidePanel(!showSidePanel)}
            whileHover={{ scale: 1.1 }}
          >
            ⚙️
          </ActionButton>
        </div>
      </TopBar>

      {/* Side Feature Panel */}
      <AnimatePresence>
        {showSidePanel && (
          <SidePanel
            initial={{ x: -350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -350, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <PanelTitle>SYSTEM FEATURES</PanelTitle>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#00ffff', marginBottom: '5px' }}>
                    {feature.title}
                  </div>
                  <FeatureText>{feature.desc}</FeatureText>
                </div>
              </FeatureCard>
            ))}
          </SidePanel>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <QuickActions>
        <ActionButton
          whileHover={{ scale: 1.1, rotate: 180 }}
          title="Voice Control"
        >
          🎤
        </ActionButton>
        <ActionButton
          whileHover={{ scale: 1.1 }}
          title="Face Recognition"
        >
          👁️
        </ActionButton>
        <ActionButton
          whileHover={{ scale: 1.1 }}
          title="VR Mode"
        >
          🥽
        </ActionButton>
        <ActionButton
          whileHover={{ scale: 1.1 }}
          title="AR Preview"
        >
          📱
        </ActionButton>
      </QuickActions>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationPanel
            initial={{ x: 350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 350, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <PanelTitle>LIVE UPDATES</PanelTitle>
            {notifications.map((notif, index) => (
              <Notification
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="notification-title">{notif.title}</div>
                <div>{notif.content}</div>
              </Notification>
            ))}
          </NotificationPanel>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <StatusBar
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <StatusItem>
          <StatusIndicator color={getStatusColor(systemStatus)} />
          SYSTEM: {systemStatus}
        </StatusItem>

        <StatusItem>
          <StatusIndicator color="#00ff00" />
          AI: {aiStatus}
        </StatusItem>

        <StatusItem>
          <StatusIndicator color="#ffff00" />
          PREDICTIONS: REAL-TIME
        </StatusItem>

        <StatusItem>
          <StatusIndicator color="#ff00ff" />
          NETWORK: CONNECTED
        </StatusItem>

        <StatusItem>
          <span style={{ fontFamily: 'Orbitron', fontSize: '14px' }}>
            {new Date().toLocaleTimeString()} | Mumbai Real Estate Hub
          </span>
        </StatusItem>
      </StatusBar>
    </UIContainer>
  );
}