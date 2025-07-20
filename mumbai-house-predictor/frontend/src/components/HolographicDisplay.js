import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Float } from '@react-three/drei';

export default function HolographicDisplay({ position }) {
  const displayRef = useRef();

  useFrame((state) => {
    if (displayRef.current) {
      displayRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float floatIntensity={2} rotationIntensity={1}>
      <group ref={displayRef} position={position}>
        <Text3D
          font="/fonts/orbitron.json"
          size={1}
          height={0.1}
        >
          HOLOGRAM
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Text3D>
      </group>
    </Float>
  );
}