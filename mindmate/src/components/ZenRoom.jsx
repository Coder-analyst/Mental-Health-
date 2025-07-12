import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Cylinder, Text } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import * as THREE from 'three'

const ZenRoom = ({ mood }) => {
  const islandRef = useRef()
  const waterRef = useRef()

  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.rotation.y += 0.002
    }
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const moodColors = {
    happy: '#10b981',
    sad: '#3b82f6',
    angry: '#ef4444',
    anxious: '#f59e0b',
    neutral: '#8b5cf6',
    excited: '#ec4899'
  }

  return (
    <group>
      {/* Floating Island */}
      <motion.group
        ref={islandRef}
        position={[0, -1, 0]}
        initial={{ y: -5 }}
        animate={{ y: -1 }}
        transition={{ duration: 2, type: "spring" }}
      >
        {/* Island Base */}
        <Cylinder args={[3, 4, 0.5, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.8}
            metalness={0.1}
          />
        </Cylinder>

        {/* Grass Layer */}
        <Cylinder args={[2.8, 3.8, 0.2, 32]} position={[0, 0.35, 0]}>
          <meshStandardMaterial
            color="#228B22"
            roughness={0.9}
            metalness={0}
          />
        </Cylinder>

        {/* Trees */}
        {[...Array(6)].map((_, i) => (
          <group key={i} position={[
            Math.cos(i * Math.PI / 3) * 2,
            Math.sin(i * Math.PI / 3) * 2,
            0
          ]}>
            {/* Tree Trunk */}
            <Cylinder args={[0.1, 0.1, 1, 8]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color="#654321" />
            </Cylinder>
            {/* Tree Top */}
            <Sphere args={[0.4, 8, 8]} position={[0, 1.2, 0]}>
              <meshStandardMaterial color="#228B22" />
            </Sphere>
          </group>
        ))}
      </motion.group>

      {/* Floating Desk */}
      <motion.group
        position={[0, 0, 0]}
        initial={{ y: 5 }}
        animate={{ y: 0 }}
        transition={{ duration: 2, delay: 0.5, type: "spring" }}
      >
        {/* Desk Surface */}
        <Box args={[2, 0.1, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#DEB887"
            roughness={0.7}
            metalness={0.1}
          />
        </Box>

        {/* Desk Legs */}
        {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map(([x, z], i) => (
          <Box key={i} args={[0.1, 0.8, 0.1]} position={[x, -0.4, z]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
        ))}

        {/* Meditation Cushion */}
        <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0, 0.1, 0.3]}>
          <meshStandardMaterial
            color={moodColors[mood] || moodColors.neutral}
            transparent
            opacity={0.8}
          />
        </Cylinder>
      </motion.group>

      {/* Ambient Water */}
      <motion.group
        ref={waterRef}
        position={[0, -3, 0]}
      >
        <Cylinder args={[10, 10, 0.5, 32]}>
          <meshStandardMaterial
            color="#4169E1"
            transparent
            opacity={0.3}
            metalness={0.1}
            roughness={0.2}
          />
        </Cylinder>
      </motion.group>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            Math.random() * 5 - 2,
            (Math.random() - 0.5) * 10
          ]}
          animate={{
            y: [0, -2, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
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

      {/* Welcome Text */}
      <motion.group
        position={[0, 2, 0]}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Text
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-regular.woff"
        >
          Welcome to your Zen Space
        </Text>
        <Text
          fontSize={0.2}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.4, 0]}
        >
          Take a moment to breathe and center yourself
        </Text>
      </motion.group>
    </group>
  )
}

export default ZenRoom