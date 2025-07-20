import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  PerspectiveCamera, 
  OrbitControls, 
  Stars, 
  Float, 
  Text3D,
  Sparkles,
  Cloud,
  Sky
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import styled, { createGlobalStyle } from 'styled-components';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import Howler from 'react-howler';

// Components
import MumbaiSkyline from './components/MumbaiSkyline';
import FloatingUI from './components/FloatingUI';
import PricePredictor from './components/PricePredictor';
import SmaartAva from './components/SmaartAva';
import HolographicDisplay from './components/HolographicDisplay';
import ParticleEffects from './components/ParticleEffects';
import CyberpunkUI from './components/CyberpunkUI';
import VoiceController from './components/VoiceController';
import FaceRecognition from './components/FaceRecognition';
import PropertyHunt from './components/PropertyHunt';
import DataMountains from './components/DataMountains';

// Global Styles with Cyberpunk Theme
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Rajdhani', sans-serif;
    background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
    color: #00ffff;
    overflow-x: hidden;
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewport="0 0 20 20"><circle cx="10" cy="10" r="8" fill="%2300ffff" fill-opacity="0.3"/><circle cx="10" cy="10" r="2" fill="%2300ffff"/></svg>'), auto;
  }
  
  .neon-glow {
    box-shadow: 
      0 0 5px #00ffff,
      0 0 10px #00ffff,
      0 0 15px #00ffff,
      0 0 20px #00ffff;
    border: 1px solid #00ffff;
  }
  
  .hologram-text {
    font-family: 'Orbitron', monospace;
    text-shadow: 
      0 0 10px #00ffff,
      0 0 20px #00ffff,
      0 0 30px #00ffff;
    color: #00ffff;
    animation: hologramFlicker 2s infinite alternate;
  }
  
  @keyframes hologramFlicker {
    0% { opacity: 1; }
    50% { opacity: 0.8; }
    100% { opacity: 1; }
  }
  
  .glass-morphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
  }
  
  .cyberpunk-grid {
    background-image: 
      linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #0a0a0a, #1a1a2e, #16213e);
`;

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const UIOverlay = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  & > * {
    pointer-events: auto;
  }
`;

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

// Particle configuration for money rain and cyberpunk effects
const particlesConfig = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ["#00ffff", "#ff00ff", "#ffff00", "#00ff00"],
    },
    links: {
      color: "#00ffff",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
      },
    },
    shape: {
      type: ["circle", "triangle", "polygon"],
      polygon: {
        sides: 6,
      },
    },
    size: {
      value: { min: 1, max: 5 },
      animation: {
        enable: true,
        speed: 5,
        minimumValue: 0.1,
      },
    },
  },
  detectRetina: true,
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isVRMode, setIsVRMode] = useState(false);

  // Initialize particles
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  useEffect(() => {
    // Simulate app loading with 3D initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Loading Screen with 3D Effects
  if (isLoading) {
    return (
      <AppContainer>
        <GlobalStyle />
        <CanvasContainer>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {/* 3D Loading Animation */}
            <Float rotationIntensity={1} floatIntensity={2}>
              <Text3D
                font="/fonts/orbitron.json"
                size={1}
                height={0.2}
                position={[0, 1, 0]}
              >
                Mumbai House Predictor
                <meshStandardMaterial
                  color="#00ffff"
                  emissive="#00ffff"
                  emissiveIntensity={0.3}
                />
              </Text3D>
            </Float>
            
            <Float rotationIntensity={0.5} floatIntensity={1}>
              <Text3D
                font="/fonts/orbitron.json"
                size={0.3}
                height={0.1}
                position={[0, -1, 0]}
              >
                Initializing AI Systems...
                <meshStandardMaterial
                  color="#ff00ff"
                  emissive="#ff00ff"
                  emissiveIntensity={0.2}
                />
              </Text3D>
            </Float>
            
            <Sparkles count={100} scale={10} size={6} speed={1} />
            <Stars radius={100} depth={50} count={5000} factor={4} />
            
            <EffectComposer>
              <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
              <ChromaticAberration offset={[0.02, 0.02]} />
            </EffectComposer>
          </Canvas>
        </CanvasContainer>
        
        <ParticleContainer>
          <Particles
            id="loading-particles"
            init={particlesInit}
            options={{
              ...particlesConfig,
              particles: {
                ...particlesConfig.particles,
                move: {
                  ...particlesConfig.particles.move,
                  speed: 6,
                },
                number: {
                  value: 150,
                },
              },
            }}
          />
        </ParticleContainer>
        
        {soundEnabled && (
          <Howler
            src={['/sounds/futuristic-loading.mp3']}
            playing={true}
            loop={true}
            volume={0.3}
          />
        )}
      </AppContainer>
    );
  }

  return (
    <AppContainer className="cyberpunk-grid">
      <GlobalStyle />
      
      {/* Background Particles */}
      <ParticleContainer>
        <Particles
          id="background-particles"
          init={particlesInit}
          options={particlesConfig}
        />
      </ParticleContainer>
      
      {/* 3D Scene */}
      <CanvasContainer>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 20, 50]} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {/* Lighting Setup */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
          <spotLight position={[0, 50, 0]} angle={0.3} penumbra={1} intensity={1} color="#ffff00" />
          
          {/* Environment */}
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="night" />
          <Stars radius={100} depth={50} count={5000} factor={4} />
          
          {/* 3D Components */}
          <Suspense fallback={null}>
            <MumbaiSkyline />
            <DataMountains />
            <ParticleEffects />
            
            {/* Floating Elements */}
            <Float rotationIntensity={0.5} floatIntensity={1}>
              <HolographicDisplay position={[0, 10, 0]} />
            </Float>
            
            {/* Sparkles and Effects */}
            <Sparkles count={50} scale={20} size={3} speed={0.5} color="#00ffff" />
            <Cloud position={[-4, -2, -25]} speed={0.2} opacity={0.1} />
            <Cloud position={[4, 2, -15]} speed={0.2} opacity={0.1} />
          </Suspense>
          
          {/* Post-processing Effects */}
          <EffectComposer>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
            <ChromaticAberration offset={[0.001, 0.001]} />
          </EffectComposer>
        </Canvas>
      </CanvasContainer>
      
      {/* UI Overlay */}
      <UIOverlay>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <CyberpunkUI currentView={currentView} setCurrentView={setCurrentView} />
          <FloatingUI />
          
          {currentView === 'predictor' && (
            <PricePredictor 
              userProfile={userProfile} 
              onClose={() => setCurrentView('home')}
            />
          )}
          
          {currentView === 'hunt' && (
            <PropertyHunt />
          )}
          
          {/* AI Assistant */}
          <SmaartAva 
            position={{ bottom: '20px', right: '20px' }}
            userProfile={userProfile}
          />
          
          {/* Voice Controller */}
          <VoiceController 
            onCommand={(command) => {
              // Handle voice commands
              console.log('Voice command:', command);
            }}
          />
          
          {/* Face Recognition */}
          <FaceRecognition 
            onUserDetected={setUserProfile}
          />
        </motion.div>
      </UIOverlay>
      
      {/* Ambient Sounds */}
      {soundEnabled && (
        <>
          <Howler
            src={['/sounds/cyberpunk-ambient.mp3']}
            playing={true}
            loop={true}
            volume={0.1}
          />
          <Howler
            src={['/sounds/ui-beeps.mp3']}
            playing={false}
            volume={0.3}
          />
        </>
      )}
    </AppContainer>
  );
}

export default App;