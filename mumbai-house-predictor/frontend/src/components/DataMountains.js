import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Box, 
  Sphere, 
  Text3D, 
  Float, 
  Billboard,
  Line,
  Trail
} from '@react-three/drei';
import * as THREE from 'three';

// Sample Mumbai area price data (in Lakhs)
const mumbaiPriceData = [
  { area: 'Bandra West', prices: [180, 185, 192, 198, 205, 215, 225, 238, 245, 252], growth: 15.2 },
  { area: 'Andheri East', prices: [95, 98, 102, 108, 115, 122, 128, 135, 142, 148], growth: 12.8 },
  { area: 'Powai', prices: [120, 125, 130, 138, 145, 152, 160, 168, 175, 182], growth: 14.1 },
  { area: 'Navi Mumbai', prices: [65, 68, 72, 76, 82, 88, 95, 102, 108, 115], growth: 18.5 },
  { area: 'Thane', prices: [55, 58, 62, 67, 73, 79, 85, 92, 98, 105], growth: 19.2 },
  { area: 'Ghatkopar', prices: [85, 88, 92, 97, 103, 109, 116, 123, 129, 136], growth: 16.8 },
  { area: 'Kandivali', prices: [78, 81, 85, 90, 96, 102, 109, 116, 122, 128], growth: 17.1 },
  { area: 'Borivali', prices: [72, 75, 79, 84, 90, 96, 103, 110, 116, 122], growth: 18.9 },
  { area: 'Malad', prices: [68, 71, 75, 80, 86, 92, 99, 106, 112, 118], growth: 20.2 },
  { area: 'Goregaon', prices: [76, 79, 83, 88, 94, 101, 108, 115, 121, 127], growth: 16.9 },
];

// Create 3D mountain from price data
function PriceMountain({ areaData, position, index }) {
  const mountainRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Create mountain geometry from price data
  const mountainGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const colors = [];

    const width = 8;
    const depth = 8;
    const maxHeight = Math.max(...areaData.prices) / 10;

    // Create heightmap from price data
    for (let x = 0; x <= width; x++) {
      for (let z = 0; z <= depth; z++) {
        const priceIndex = Math.floor((x / width) * (areaData.prices.length - 1));
        const height = areaData.prices[priceIndex] / 10;
        
        // Add some noise for mountain effect
        const noise = (Math.sin(x * 0.5) + Math.cos(z * 0.5)) * 0.5;
        const finalHeight = height + noise;

        vertices.push(x - width/2, finalHeight, z - depth/2);

        // Color based on height (price)
        const heightRatio = finalHeight / maxHeight;
        if (heightRatio > 0.8) {
          colors.push(1, 1, 0); // Yellow for highest prices
        } else if (heightRatio > 0.6) {
          colors.push(1, 0.5, 0); // Orange for high prices
        } else if (heightRatio > 0.4) {
          colors.push(0, 1, 1); // Cyan for medium prices
        } else {
          colors.push(0, 1, 0); // Green for lower prices
        }
      }
    }

    // Create triangular faces
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        const a = x + (width + 1) * z;
        const b = x + 1 + (width + 1) * z;
        const c = x + (width + 1) * (z + 1);
        const d = x + 1 + (width + 1) * (z + 1);

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    return geometry;
  }, [areaData.prices]);

  useFrame((state) => {
    if (mountainRef.current) {
      // Gentle floating animation
      mountainRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5;
      
      // Glow effect when hovered
      if (isHovered) {
        mountainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <group position={position}>
      {/* Mountain */}
      <mesh
        ref={mountainRef}
        geometry={mountainGeometry}
        onPointerEnter={() => {
          setIsHovered(true);
          setShowDetails(true);
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          setShowDetails(false);
        }}
      >
        <meshStandardMaterial
          vertexColors
          emissive={isHovered ? new THREE.Color(0.2, 0.2, 0.2) : new THREE.Color(0, 0, 0)}
          emissiveIntensity={isHovered ? 0.3 : 0.1}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Area Label */}
      <Billboard>
        <Text3D
          font="/fonts/orbitron.json"
          size={0.3}
          height={0.05}
          position={[0, -2, 0]}
        >
          {areaData.area}
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </Text3D>
      </Billboard>

      {/* Growth Indicator */}
      <Float floatIntensity={1} speed={2}>
        <Sphere args={[0.2]} position={[0, Math.max(...areaData.prices) / 10 + 1, 0]}>
          <meshStandardMaterial
            color={areaData.growth > 15 ? "#00ff00" : areaData.growth > 10 ? "#ffff00" : "#ff8800"}
            emissive={areaData.growth > 15 ? "#00ff00" : areaData.growth > 10 ? "#ffff00" : "#ff8800"}
            emissiveIntensity={0.8}
          />
        </Sphere>
      </Float>

      {/* Price Points */}
      {areaData.prices.map((price, i) => (
        <Float key={i} floatIntensity={0.5} speed={1 + i * 0.1}>
          <Sphere
            args={[0.05]}
            position={[
              (i / (areaData.prices.length - 1)) * 8 - 4,
              price / 10 + 1,
              0
            ]}
          >
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={1}
            />
          </Sphere>
        </Float>
      ))}

      {/* Detailed Info Panel (when hovered) */}
      {showDetails && (
        <Billboard>
          <Float floatIntensity={0.5}>
            <group position={[0, Math.max(...areaData.prices) / 10 + 3, 0]}>
              {/* Info Background */}
              <Box args={[6, 3, 0.1]} position={[0, 0, 0]}>
                <meshStandardMaterial
                  color="#000000"
                  transparent
                  opacity={0.8}
                  emissive="#00ffff"
                  emissiveIntensity={0.1}
                />
              </Box>

              {/* Current Price */}
              <Text3D
                font="/fonts/orbitron.json"
                size={0.15}
                height={0.02}
                position={[-2.8, 1, 0.1]}
              >
                Current: ₹{areaData.prices[areaData.prices.length - 1]}L
                <meshStandardMaterial
                  color="#00ff00"
                  emissive="#00ff00"
                  emissiveIntensity={0.5}
                />
              </Text3D>

              {/* Growth Rate */}
              <Text3D
                font="/fonts/orbitron.json"
                size={0.12}
                height={0.02}
                position={[-2.8, 0.5, 0.1]}
              >
                Growth: +{areaData.growth}%
                <meshStandardMaterial
                  color="#ffff00"
                  emissive="#ffff00"
                  emissiveIntensity={0.5}
                />
              </Text3D>

              {/* Min/Max Prices */}
              <Text3D
                font="/fonts/orbitron.json"
                size={0.1}
                height={0.02}
                position={[-2.8, 0, 0.1]}
              >
                Range: ₹{Math.min(...areaData.prices)}L - ₹{Math.max(...areaData.prices)}L
                <meshStandardMaterial
                  color="#ff00ff"
                  emissive="#ff00ff"
                  emissiveIntensity={0.3}
                />
              </Text3D>

              {/* Investment Rating */}
              <Text3D
                font="/fonts/orbitron.json"
                size={0.12}
                height={0.02}
                position={[-2.8, -0.5, 0.1]}
              >
                Rating: {areaData.growth > 18 ? '⭐⭐⭐⭐⭐' : 
                        areaData.growth > 15 ? '⭐⭐⭐⭐' : 
                        areaData.growth > 12 ? '⭐⭐⭐' : '⭐⭐'}
                <meshStandardMaterial
                  color="#ffaa00"
                  emissive="#ffaa00"
                  emissiveIntensity={0.5}
                />
              </Text3D>
            </group>
          </Float>
        </Billboard>
      )}

      {/* Price Trend Line */}
      <Line
        points={areaData.prices.map((price, i) => [
          (i / (areaData.prices.length - 1)) * 8 - 4,
          price / 10 + 0.1,
          0
        ])}
        color="#00ffff"
        lineWidth={3}
      />
    </group>
  );
}

// Animated Price Particles
function PriceParticles() {
  const particlesRef = useRef();

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 50 }, (_, i) => (
        <Float key={i} floatIntensity={2} speed={1 + Math.random()}>
          <Sphere
            args={[0.02]}
            position={[
              (Math.random() - 0.5) * 60,
              Math.random() * 20 + 5,
              (Math.random() - 0.5) * 60
            ]}
          >
            <meshStandardMaterial
              color={['#00ffff', '#ffff00', '#ff00ff', '#00ff00'][Math.floor(Math.random() * 4)]}
              emissive={['#00ffff', '#ffff00', '#ff00ff', '#00ff00'][Math.floor(Math.random() * 4)]}
              emissiveIntensity={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

// Market Trends Visualization
function MarketTrends() {
  return (
    <group position={[0, 20, -40]}>
      {/* Overall Market Indicator */}
      <Float floatIntensity={2} rotationIntensity={1}>
        <group>
          <Text3D
            font="/fonts/orbitron.json"
            size={1.5}
            height={0.2}
            position={[-8, 0, 0]}
          >
            MARKET TRENDS
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.5}
            />
          </Text3D>

          <Text3D
            font="/fonts/orbitron.json"
            size={0.5}
            height={0.1}
            position={[-6, -2, 0]}
          >
            Mumbai Real Estate 2024
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={0.3}
            />
          </Text3D>
        </group>
      </Float>

      {/* Market Status Indicators */}
      <group position={[0, -5, 0]}>
        <Float floatIntensity={1} speed={2}>
          <Sphere args={[0.5]} position={[-8, 0, 0]}>
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
          </Sphere>
          <Text3D
            font="/fonts/orbitron.json"
            size={0.3}
            height={0.05}
            position={[-7, -1, 0]}
          >
            BULLISH
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.3} />
          </Text3D>
        </Float>

        <Float floatIntensity={1} speed={2.5} rotationIntensity={0.5}>
          <Box args={[1, 1, 1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.6} />
          </Box>
          <Text3D
            font="/fonts/orbitron.json"
            size={0.3}
            height={0.05}
            position={[-1, -1.5, 0]}
          >
            STABLE
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
          </Text3D>
        </Float>

        <Float floatIntensity={1} speed={3}>
          <Sphere args={[0.5]} position={[8, 0, 0]}>
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.8} />
          </Sphere>
          <Text3D
            font="/fonts/orbitron.json"
            size={0.3}
            height={0.05}
            position={[7, -1, 0]}
          >
            GROWTH
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.3} />
          </Text3D>
        </Float>
      </group>
    </group>
  );
}

export default function DataMountains() {
  return (
    <group position={[0, 0, 30]}>
      {/* Price Mountains */}
      {mumbaiPriceData.map((areaData, index) => (
        <PriceMountain
          key={areaData.area}
          areaData={areaData}
          position={[
            (index % 5) * 12 - 24,
            0,
            Math.floor(index / 5) * 15
          ]}
          index={index}
        />
      ))}

      {/* Market Trends Display */}
      <MarketTrends />

      {/* Floating Price Particles */}
      <PriceParticles />

      {/* Interactive Legend */}
      <group position={[30, 10, 0]}>
        <Billboard>
          <Text3D
            font="/fonts/orbitron.json"
            size={0.5}
            height={0.1}
            position={[0, 5, 0]}
          >
            PRICE LEGEND
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.3}
            />
          </Text3D>

          <Text3D
            font="/fonts/orbitron.json"
            size={0.2}
            height={0.02}
            position={[0, 4, 0]}
          >
            🟡 Premium (₹200L+)
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
          </Text3D>

          <Text3D
            font="/fonts/orbitron.json"
            size={0.2}
            height={0.02}
            position={[0, 3.5, 0]}
          >
            🟠 High (₹150L+)
            <meshStandardMaterial color="#ff8800" emissive="#ff8800" emissiveIntensity={0.3} />
          </Text3D>

          <Text3D
            font="/fonts/orbitron.json"
            size={0.2}
            height={0.02}
            position={[0, 3, 0]}
          >
            🔵 Medium (₹100L+)
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
          </Text3D>

          <Text3D
            font="/fonts/orbitron.json"
            size={0.2}
            height={0.02}
            position={[0, 2.5, 0]}
          >
            🟢 Affordable (<₹100L)
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.3} />
          </Text3D>
        </Billboard>
      </group>
    </group>
  );
}