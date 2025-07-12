import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sphere } from '@react-three/drei'

const BreathingBubble = ({ isActive }) => {
  const [breathPhase, setBreathPhase] = useState('inhale') // 'inhale' or 'exhale'
  const [breathCount, setBreathCount] = useState(0)
  const [isGuided, setIsGuided] = useState(true)
  const intervalRef = useRef()

  useEffect(() => {
    if (isActive && isGuided) {
      startBreathingCycle()
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, isGuided])

  const startBreathingCycle = () => {
    let phase = 'inhale'
    setBreathPhase(phase)
    
    intervalRef.current = setInterval(() => {
      if (phase === 'inhale') {
        phase = 'exhale'
        setBreathPhase(phase)
      } else {
        phase = 'inhale'
        setBreathPhase(phase)
        setBreathCount(prev => prev + 1)
      }
    }, 4000) // 4 seconds per phase
  }

  const stopBreathing = () => {
    clearInterval(intervalRef.current)
    setIsGuided(false)
  }

  const resetBreathing = () => {
    setBreathCount(0)
    setBreathPhase('inhale')
    setIsGuided(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full mx-4">
        {/* Breathing Bubble */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-zen-400 flex items-center justify-center text-white text-2xl font-bold"
            animate={{
              scale: breathPhase === 'inhale' ? [1, 1.5, 1.5] : [1.5, 1, 1],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {breathPhase === 'inhale' ? '🫁' : '💨'}
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <motion.h2
            className="text-2xl font-bold text-gradient mb-2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            {breathPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
          </motion.h2>
          
          <p className="text-gray-300 text-sm">
            {breathPhase === 'inhale' 
              ? 'Take a deep, slow breath through your nose' 
              : 'Release the breath slowly through your mouth'
            }
          </p>
        </div>

        {/* Breath Counter */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-white mb-2">
            {breathCount}
          </div>
          <p className="text-gray-400 text-sm">Breaths Completed</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {isGuided ? (
            <motion.button
              onClick={stopBreathing}
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Stop Guided
            </motion.button>
          ) : (
            <motion.button
              onClick={resetBreathing}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Guided
            </motion.button>
          )}
        </div>

        {/* Breathing Tips */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <h3 className="text-white font-semibold mb-2">Breathing Tips</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Sit comfortably with your back straight</li>
            <li>• Place your hands on your belly</li>
            <li>• Focus on the rhythm of your breath</li>
            <li>• Let your thoughts come and go</li>
          </ul>
        </div>

        {/* Progress Ring */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-700"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="text-primary-400"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: breathPhase === 'inhale' ? 1 : 0 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {breathPhase === 'inhale' ? 'IN' : 'OUT'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreathingBubble