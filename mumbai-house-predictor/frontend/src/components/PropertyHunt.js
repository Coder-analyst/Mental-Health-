import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HuntContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 60%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(255, 0, 255, 0.1));
  border: 2px solid #ff00ff;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  color: #ffffff;
  font-family: 'Orbitron', monospace;
  z-index: 1000;
`;

export default function PropertyHunt() {
  return (
    <HuntContainer
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <h2 style={{ color: '#ff00ff', marginBottom: '20px' }}>🎮 Property Hunt Game</h2>
      <p>Gamified property search coming soon!</p>
      <p>Find hidden gems, complete challenges, and unlock exclusive deals!</p>
    </HuntContainer>
  );
}