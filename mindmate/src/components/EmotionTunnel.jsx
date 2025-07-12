import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Sphere, Text } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import * as THREE from 'three'

const EmotionTunnel = ({ mood }) => {
  const tunnelRef = useRef()
  const cameraRef = useRef()

  // Mock mood data for the past 7 days
  const moodData = [
    { day: 'Mon', mood: 'happy', intensity: 0.8 },
    { day: 'Tue', mood: 'neutral', intensity: 0.5 },
    { day: 'Wed', mood: 'sad', intensity: 0.3 },
    { day: 'Thu', mood: 'anxious', intensity: 0.4 },
    { day: 'Fri', mood: 'excited', intensity: 0.9 },
    { day: 'Sat', mood: 'happy', intensity: 0.7 },
    { day: 'Sun', mood: 'neutral', intensity: 0.6 }
  ]

  const moodColors = {
    happy: '#10b981',
    sad: '#3b82f6',
    angry: '#ef4444',
    anxious: '#f59e0b',
    neutral: '#8b5cf6',
    excited: '#ec4899'
  }

  useFrame((state) => {
    if (tunnelRef.current) {
      // Slowly rotate the tunnel
      tunnelRef.current.rotation.y += 0.002
    }
  })

  return (
    <group>
      {/* Main Tunnel */}
      <motion.group
        ref={tunnelRef}
        position={[0, 0, 0]}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, type: "spring" }}
      >
        {/* Tunnel Structure */}
        <Cylinder args={[8, 8, 20, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#1a1a1a"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </Cylinder>

        {/* Mood Data Rings */}
        {moodData.map((data, index) => (
          <motion.group
            key={index}
            position={[0, 0, -8 + index * 2.5]}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
          >
            {/* Mood Ring */}
            <Cylinder args={[data.intensity * 3 + 1, data.intensity * 3 + 1.1, 0.2, 32]}>
              <meshStandardMaterial
                color={moodColors[data.mood]}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </Cylinder>

            {/* Day Label */}
            <Text
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
              position={[0, 0, 0.2]}
            >
              {data.day}
            </Text>

            {/* Mood Emoji */}
            <Text
              fontSize={0.4}
              anchorX="center"
              anchorY="middle"
              position={[0, 0, -0.2]}
            >
              {data.mood === 'happy' && '😊'}
              {data.mood === 'sad' && '😔'}
              {data.mood === 'angry' && '😤'}
              {data.mood === 'anxious' && '😰'}
              {data.mood === 'neutral' && '😐'}
              {data.mood === 'excited' && '🤩'}
            </Text>
          </motion.group>
        ))}
      </motion.group>

      {/* Floating Particles in Tunnel */}
      {[...Array(50)].map((_, i) => (
        <motion.mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16,
            Math.random() * 20 - 10
          ]}
          animate={{
            z: [10, -10],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        >
          <Sphere args={[0.02, 8, 8]}>
            <meshBasicMaterial
              color={moodColors[mood] || moodColors.neutral}
              transparent
              opacity={0.4}
            />
          </Sphere>
        </motion.mesh>
      ))}

      {/* Current Mood Indicator */}
      <motion.group
        position={[0, 3, 0]}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Text
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Your Mood Journey
        </Text>
        
        <Text
          fontSize={0.2}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.4, 0]}
        >
          Visualizing your emotional patterns
        </Text>
      </motion.group>

      {/* Mood Summary */}
      <motion.group
        position={[0, -3, 0]}
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <Text
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Weekly Summary
        </Text>
        
        <Text
          fontSize={0.15}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.3, 0]}
        >
          3 happy days • 2 neutral • 1 sad • 1 anxious
        </Text>
      </motion.group>

      {/* Energy Waves */}
      {[...Array(5)].map((_, i) => (
        <motion.mesh
          key={i}
          position={[0, 0, 0]}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.6,
          }}
        >
          <Cylinder args={[0.1, 0.1, 20, 8]}>
            <meshBasicMaterial
              color={moodColors[mood] || moodColors.neutral}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </Cylinder>
        </motion.mesh>
      ))}
    </group>
  )
}

export default EmotionTunnel