import React from 'react';
import { Float, Sparkles } from '@react-three/drei';

export default function ParticleEffects() {
  return (
    <group>
      <Sparkles count={100} scale={50} size={6} speed={1} color="#00ffff" />
      <Sparkles count={50} scale={30} size={4} speed={0.5} color="#ff00ff" />
      <Sparkles count={75} scale={40} size={5} speed={0.8} color="#ffff00" />
    </group>
  );
}