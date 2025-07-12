import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Text } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import * as THREE from 'three'

const AIAvatar = ({ mood }) => {
  const meshRef = useRef()
  const groupRef = useRef()

  const moodColors = {
    happy: '#10b981',
    sad: '#3b82f6',
    angry: '#ef4444',
    anxious: '#f59e0b',
    neutral: '#8b5cf6',
    excited: '#ec4899'
  }

  const moodExpressions = {
    happy: '😊',
    sad: '😔',
    angry: '😤',
    anxious: '😰',
    neutral: '😐',
    excited: '🤩'
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Avatar Sphere */}
      <motion.mesh
        ref={meshRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color={moodColors[mood] || moodColors.neutral}
            transparent
            opacity={0.8}
            metalness={0.3}
            roughness={0.2}
          />
        </Sphere>
      </motion.mesh>

      {/* Expression Text */}
      <motion.group
        position={[0, 0, 1.2]}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Text
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {moodExpressions[mood] || moodExpressions.neutral}
        </Text>
      </motion.group>

      {/* Orbital Rings */}
      <motion.group
        animate={{ rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[1.5, 1.6, 32]} />
          <meshBasicMaterial
            color={moodColors[mood] || moodColors.neutral}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </motion.group>

      <motion.group
        animate={{ rotateY: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[2, 2.1, 32]} />
          <meshBasicMaterial
            color={moodColors[mood] || moodColors.neutral}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </motion.group>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.mesh
          key={i}
          position={[
            Math.cos(i * Math.PI / 4) * 2.5,
            Math.sin(i * Math.PI / 4) * 2.5,
            0
          ]}
          animate={{
            y: [0, -0.5, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          <Sphere args={[0.05, 8, 8]}>
            <meshBasicMaterial
              color={moodColors[mood] || moodColors.neutral}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </motion.mesh>
      ))}
    </group>
  )
}

export default AIAvatar