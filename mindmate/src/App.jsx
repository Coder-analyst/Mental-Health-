import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import AIAvatar from './components/AIAvatar'
import ZenRoom from './components/ZenRoom'
import FocusRoom from './components/FocusRoom'
import EmotionTunnel from './components/EmotionTunnel'
import ChatInterface from './components/ChatInterface'
import MoodTracker from './components/MoodTracker'
import BreathingBubble from './components/BreathingBubble'

function App() {
  const [currentRoom, setCurrentRoom] = useState('welcome')
  const [mood, setMood] = useState('neutral')
  const [isBreathing, setIsBreathing] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const rooms = {
    welcome: 'Welcome',
    zen: 'Zen Room',
    focus: 'Focus Room',
    tunnel: 'Emotion Tunnel',
    breathing: 'Breathing Exercise'
  }

  const renderRoom = () => {
    switch (currentRoom) {
      case 'zen':
        return <ZenRoom mood={mood} />
      case 'focus':
        return <FocusRoom />
      case 'tunnel':
        return <EmotionTunnel mood={mood} />
      case 'breathing':
        return <BreathingBubble isActive={isBreathing} />
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <AIAvatar mood={mood} />
          </div>
        )
    }
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold text-gradient"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            🧠 MindMate
          </motion.h1>
          
          <div className="flex gap-2">
            {Object.entries(rooms).map(([key, name]) => (
              <motion.button
                key={key}
                onClick={() => setCurrentRoom(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentRoom === key 
                    ? 'btn-primary' 
                    : 'btn-secondary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {name}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 h-full pt-20">
        <div className="h-full">
          {renderRoom()}
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-4">
        <motion.button
          onClick={() => setShowChat(!showChat)}
          className="btn-primary w-14 h-14 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          💬
        </motion.button>
        
        <motion.button
          onClick={() => setIsBreathing(!isBreathing)}
          className="btn-secondary w-14 h-14 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🫁
        </motion.button>
      </div>

      {/* Mood Tracker */}
      <div className="absolute top-20 left-6 z-20">
        <MoodTracker mood={mood} setMood={setMood} />
      </div>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            className="absolute bottom-20 right-6 z-30 w-80 h-96"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatInterface mood={mood} setMood={setMood} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing Overlay */}
      <AnimatePresence>
        {isBreathing && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BreathingBubble isActive={isBreathing} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
