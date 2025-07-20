import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Box, 
  Cylinder, 
  Sphere, 
  Text3D, 
  Float, 
  useTexture,
  Billboard,
  Instance,
  Instances
} from '@react-three/drei';
import { Vector3, Color } from 'three';
import * as THREE from 'three';

// Famous Mumbai landmarks and their positions
const mumbaiLandmarks = [
  { name: 'Burj Khalifa Twin', position: [-20, 0, -10], height: 25, type: 'skyscraper', price: '₹5.2Cr', growth: '+15%' },
  { name: 'Palais Royale', position: [-15, 0, -5], height: 20, type: 'luxury', price: '₹4.8Cr', growth: '+12%' },
  { name: 'Imperial Towers', position: [-10, 0, 0], height: 18, type: 'premium', price: '₹3.2Cr', growth: '+10%' },
  { name: 'Lodha Park', position: [-5, 0, 5], height: 22, type: 'residential', price: '₹2.8Cr', growth: '+8%' },
  { name: 'Trump Tower', position: [0, 0, 10], height: 24, type: 'luxury', price: '₹6.5Cr', growth: '+18%' },
  { name: 'World One', position: [5, 0, 5], height: 28, type: 'skyscraper', price: '₹7.2Cr', growth: '+20%' },
  { name: 'Ashok Towers', position: [10, 0, 0], height: 15, type: 'premium', price: '₹2.1Cr', growth: '+6%' },
  { name: 'Oberoi Realty', position: [15, 0, -5], height: 19, type: 'luxury', price: '₹4.5Cr', growth: '+14%' },
  { name: 'Hiranandani', position: [20, 0, -10], height: 16, type: 'residential', price: '₹1.8Cr', growth: '+5%' },
  { name: 'Godrej Projects', position: [25, 0, -15], height: 21, type: 'premium', price: '₹3.8Cr', growth: '+11%' },
];

// Building types with different materials and colors
const buildingTypes = {
  skyscraper: { color: '#00ffff', emissive: '#004444', metalness: 0.8, roughness: 0.2 },
  luxury: { color: '#ffff00', emissive: '#444400', metalness: 0.6, roughness: 0.3 },
  premium: { color: '#ff00ff', emissive: '#440044', metalness: 0.4, roughness: 0.4 },
  residential: { color: '#00ff00', emissive: '#004400', metalness: 0.2, roughness: 0.6 },
};

// Animated Building Component
function Building({ position, height, type, name, price, growth, onClick }) {
  const buildingRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isConstructing, setIsConstructing] = useState(true);
  const [currentHeight, setCurrentHeight] = useState(0);

  const buildingStyle = buildingTypes[type] || buildingTypes.residential;

  // Construction animation
  useFrame((state) => {
    if (isConstructing && currentHeight < height) {
      setCurrentHeight(prev => Math.min(prev + 0.1, height));
      if (currentHeight >= height - 0.1) {
        setIsConstructing(false);
      }
    }

    // Floating animation for completed buildings
    if (!isConstructing && buildingRef.current) {
      buildingRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      buildingRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }

    // Glow effect when hovered
    if (hovered && buildingRef.current) {
      buildingRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.05);
    }
  });

  return (
    <group position={position}>
      {/* Main Building */}
      <Box
        ref={buildingRef}
        args={[2, currentHeight, 2]}
        position={[0, currentHeight / 2, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={buildingStyle.color}
          emissive={buildingStyle.emissive}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={buildingStyle.metalness}
          roughness={buildingStyle.roughness}
          transparent
          opacity={hovered ? 0.9 : 0.8}
        />
      </Box>

      {/* Windows Pattern */}
      {!isConstructing && (
        <Instances>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
          {Array.from({ length: Math.floor(height / 2) }, (_, i) => (
            <group key={i}>
              {Array.from({ length: 4 }, (_, j) => (
                <Instance
                  key={j}
                  position={[
                    Math.cos((j * Math.PI) / 2) * 1.1,
                    i * 2 + 1,
                    Math.sin((j * Math.PI) / 2) * 1.1
                  ]}
                />
              ))}
            </group>
          ))}
        </Instances>
      )}

      {/* Holographic Info Display */}
      {hovered && !isConstructing && (
        <Billboard>
          <Float floatIntensity={0.5}>
            <group position={[0, height + 3, 0]}>
              {/* Info Panel */}
              <Box args={[4, 2, 0.1]} position={[0, 0, 0]}>
                <meshStandardMaterial
                  color="#000000"
                  transparent
                  opacity={0.7}
                  emissive="#00ffff"
                  emissiveIntensity={0.1}
                />
              </Box>

              {/* Text Information */}
              <Text3D
                font="/fonts/orbitron.json"
                size={0.2}
                height={0.02}
                position={[-1.8, 0.5, 0.1]}
              >
                {name}
                <meshStandardMaterial
                  color="#00ffff"
                  emissive="#00ffff"
                  emissiveIntensity={0.3}
                />
              </Text3D>

              <Text3D
                font="/fonts/orbitron.json"
                size={0.15}
                height={0.02}
                position={[-1.8, 0.1, 0.1]}
              >
                {price}
                <meshStandardMaterial
                  color="#ffff00"
                  emissive="#ffff00"
                  emissiveIntensity={0.3}
                />
              </Text3D>

              <Text3D
                font="/fonts/orbitron.json"
                size={0.12}
                height={0.02}
                position={[-1.8, -0.3, 0.1]}
              >
                Growth: {growth}
                <meshStandardMaterial
                  color="#00ff00"
                  emissive="#00ff00"
                  emissiveIntensity={0.3}
                />
              </Text3D>
            </group>
          </Float>
        </Billboard>
      )}

      {/* Construction Crane (while building) */}
      {isConstructing && (
        <group position={[3, height + 5, 0]}>
          {/* Crane Base */}
          <Cylinder args={[0.2, 0.2, 10]} position={[0, -5, 0]}>
            <meshStandardMaterial color="#ffaa00" />
          </Cylinder>
          
          {/* Crane Arm */}
          <Box args={[8, 0.2, 0.2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffaa00" />
          </Box>
          
          {/* Hook */}
          <Sphere args={[0.1]} position={[3, -2, 0]}>
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
          </Sphere>
        </group>
      )}

      {/* Property Marker */}
      <Float floatIntensity={2} rotationIntensity={1}>
        <Sphere args={[0.3]} position={[0, height + 1, 0]}>
          <meshStandardMaterial
            color={buildingStyle.color}
            emissive={buildingStyle.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>

      {/* Price Growth Indicator */}
      {!isConstructing && (
        <group position={[0, height + 2, 0]}>
          {Array.from({ length: parseInt(growth.replace(/[^0-9]/g, '')) }, (_, i) => (
            <Float key={i} floatIntensity={1} speed={2 + i}>
              <Sphere args={[0.05]} position={[Math.random() * 2 - 1, i * 0.3, Math.random() * 2 - 1]}>
                <meshStandardMaterial
                  color="#00ff00"
                  emissive="#00ff00"
                  emissiveIntensity={1}
                />
              </Sphere>
            </Float>
          ))}
        </group>
      )}
    </group>
  );
}

// Infrastructure Components
function MetroLine() {
  return (
    <group>
      {/* Metro Track */}
      <Box args={[60, 0.2, 1]} position={[0, 2, -30]}>
        <meshStandardMaterial color="#888888" metalness={0.8} />
      </Box>
      
      {/* Metro Stations */}
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <group key={i} position={[x, 0, -30]}>
          <Cylinder args={[2, 2, 4]} position={[0, 2, 0]}>
            <meshStandardMaterial
              color="#0066ff"
              emissive="#0066ff"
              emissiveIntensity={0.3}
            />
          </Cylinder>
          
          <Billboard>
            <Text3D
              font="/fonts/orbitron.json"
              size={0.3}
              height={0.02}
              position={[0, 5, 0]}
            >
              Metro Station {i + 1}
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.2}
              />
            </Text3D>
          </Billboard>
        </group>
      ))}
    </group>
  );
}

function Airport() {
  return (
    <group position={[40, 0, 0]}>
      {/* Terminal Building */}
      <Box args={[15, 5, 8]} position={[0, 2.5, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Control Tower */}
      <Cylinder args={[1, 1, 15]} position={[0, 7.5, 0]}>
        <meshStandardMaterial color="#ff6600" />
      </Cylinder>
      
      {/* Runway */}
      <Box args={[40, 0.1, 4]} position={[0, 0, -15]}>
        <meshStandardMaterial color="#333333" />
      </Box>
      
      {/* Airport Label */}
      <Billboard>
        <Text3D
          font="/fonts/orbitron.json"
          size={0.5}
          height={0.02}
          position={[0, 8, 0]}
        >
          Navi Mumbai Airport
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.3}
          />
        </Text3D>
      </Billboard>
    </group>
  );
}

// Main Mumbai Skyline Component
export default function MumbaiSkyline() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    console.log('Selected building:', building);
    // You can add more interaction logic here
  };

  return (
    <group>
      {/* Ground */}
      <Box args={[100, 0.5, 100]} position={[0, -0.25, 0]}>
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.2}
        />
      </Box>

      {/* Mumbai Buildings */}
      {mumbaiLandmarks.map((landmark, index) => (
        <Building
          key={index}
          position={landmark.position}
          height={landmark.height}
          type={landmark.type}
          name={landmark.name}
          price={landmark.price}
          growth={landmark.growth}
          onClick={() => handleBuildingClick(landmark)}
        />
      ))}

      {/* Infrastructure */}
      <MetroLine />
      <Airport />

      {/* Floating Mumbai Sign */}
      <Float floatIntensity={2} rotationIntensity={0.5}>
        <group position={[0, 35, -20]}>
          <Text3D
            font="/fonts/orbitron.json"
            size={3}
            height={0.5}
            position={[-8, 0, 0]}
          >
            MUMBAI
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.5}
            />
          </Text3D>
          
          <Text3D
            font="/fonts/orbitron.json"
            size={1}
            height={0.2}
            position={[-6, -4, 0]}
          >
            Real Estate Hub
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={0.3}
            />
          </Text3D>
        </group>
      </Float>

      {/* Ambient City Lights */}
      {Array.from({ length: 100 }, (_, i) => (
        <Float key={i} floatIntensity={1} speed={1 + Math.random()}>
          <Sphere
            args={[0.1]}
            position={[
              (Math.random() - 0.5) * 80,
              Math.random() * 5,
              (Math.random() - 0.5) * 80
            ]}
          >
            <meshStandardMaterial
              color={['#ffff00', '#00ffff', '#ff00ff', '#00ff00'][Math.floor(Math.random() * 4)]}
              emissive={['#ffff00', '#00ffff', '#ff00ff', '#00ff00'][Math.floor(Math.random() * 4)]}
              emissiveIntensity={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}