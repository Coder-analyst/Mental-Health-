import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Cylinder, Text, Ring } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import * as THREE from 'three'

const FocusRoom = () => {
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
  const [isBreak, setIsBreak] = useState(false)
  const timerRef = useRef()
  const orbRef = useRef()

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += 0.01
      if (isTimerActive) {
        orbRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        orbRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        orbRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      }
    }
  })

  const startTimer = () => {
    setIsTimerActive(true)
    setIsBreak(false)
    setTimeLeft(25 * 60)
  }

  const startBreak = () => {
    setIsTimerActive(true)
    setIsBreak(true)
    setTimeLeft(5 * 60) // 5 minute break
  }

  const stopTimer = () => {
    setIsTimerActive(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <group>
      {/* Focus Desk */}
      <motion.group
        position={[0, -1, 0]}
        initial={{ y: -5 }}
        animate={{ y: -1 }}
        transition={{ duration: 2, type: "spring" }}
      >
        {/* Desk Surface */}
        <Box args={[4, 0.1, 2]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#2d3748"
            roughness={0.8}
            metalness={0.1}
          />
        </Box>

        {/* Desk Legs */}
        {[[-1.9, -0.9], [1.9, -0.9], [-1.9, 0.9], [1.9, 0.9]].map(([x, z], i) => (
          <Box key={i} args={[0.1, 1.8, 0.1]} position={[x, -0.9, z]}>
            <meshStandardMaterial color="#1a202c" />
          </Box>
        ))}
      </motion.group>

      {/* Pomodoro Timer Orb */}
      <motion.group
        ref={orbRef}
        position={[0, 0, 0]}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color={isTimerActive ? (isBreak ? '#10b981' : '#ef4444') : '#8b5cf6'}
            transparent
            opacity={0.8}
            metalness={0.3}
            roughness={0.2}
          />
        </Sphere>

        {/* Timer Ring */}
        <Ring args={[1.2, 1.3, 32]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color={isTimerActive ? (isBreak ? '#10b981' : '#ef4444') : '#8b5cf6'}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </Ring>

        {/* Timer Text */}
        <Text
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 1.1]}
        >
          {formatTime(timeLeft)}
        </Text>

        {/* Status Text */}
        <Text
          fontSize={0.15}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.4, 1.1]}
        >
          {isTimerActive ? (isBreak ? 'Break Time' : 'Focus Time') : 'Ready to Focus'}
        </Text>
      </motion.group>

      {/* Control Buttons */}
      <motion.group
        position={[0, -1.5, 0]}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Text
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.3, 0]}
        >
          Timer Controls
        </Text>

        {/* Start Focus Button */}
        <motion.group
          position={[-1.5, 0, 0]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Box args={[0.8, 0.3, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ef4444" />
          </Box>
          <Text
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.06]}
          >
            Start Focus
          </Text>
        </motion.group>

        {/* Start Break Button */}
        <motion.group
          position={[0, 0, 0]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Box args={[0.8, 0.3, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Box>
          <Text
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.06]}
          >
            Start Break
          </Text>
        </motion.group>

        {/* Stop Button */}
        <motion.group
          position={[1.5, 0, 0]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Box args={[0.8, 0.3, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#6b7280" />
          </Box>
          <Text
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.06]}
          >
            Stop
          </Text>
        </motion.group>
      </motion.group>

      {/* Productivity Stats */}
      <motion.group
        position={[0, 2, 0]}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Text
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Today's Focus Session
        </Text>
        
        <Text
          fontSize={0.15}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.3, 0]}
        >
          3 sessions completed • 75 minutes focused
        </Text>
      </motion.group>

      {/* Floating Productivity Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 8,
            Math.random() * 4 - 2,
            (Math.random() - 0.5) * 8
          ]}
          animate={{
            y: [0, -1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <Sphere args={[0.03, 8, 8]}>
            <meshBasicMaterial
              color={isTimerActive ? (isBreak ? '#10b981' : '#ef4444') : '#8b5cf6'}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </motion.mesh>
      ))}
    </group>
  )
}

export default FocusRoom