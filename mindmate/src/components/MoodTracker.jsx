import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'

const MoodTracker = ({ mood, setMood }) => {
  const [showMoodSelector, setShowMoodSelector] = useState(false)

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: '#10b981' },
    { id: 'excited', emoji: '🤩', label: 'Excited', color: '#ec4899' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#8b5cf6' },
    { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#f59e0b' },
    { id: 'sad', emoji: '😔', label: 'Sad', color: '#3b82f6' },
    { id: 'angry', emoji: '😤', label: 'Angry', color: '#ef4444' }
  ]

  const currentMood = moods.find(m => m.id === mood) || moods[2]

  return (
    <div className="relative">
      {/* Current Mood Display */}
      <motion.div
        className="glass-card p-4 cursor-pointer"
        onClick={() => setShowMoodSelector(!showMoodSelector)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">{currentMood.emoji}</div>
          <div className="text-sm font-medium text-white">{currentMood.label}</div>
          <div className="text-xs text-gray-400">Click to change</div>
        </div>
      </motion.div>

      {/* Mood Selector */}
      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            className="absolute top-full left-0 mt-2 glass-card p-4 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-3">
              {moods.map((moodOption) => (
                <motion.button
                  key={moodOption.id}
                  onClick={() => {
                    setMood(moodOption.id)
                    setShowMoodSelector(false)
                  }}
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    mood === moodOption.id
                      ? 'bg-white/20 border-2 border-white/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{moodOption.emoji}</div>
                  <div className="text-xs text-white">{moodOption.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood History (Mini Chart) */}
      <div className="mt-4 glass-card p-3">
        <div className="text-xs text-gray-400 mb-2">Today's Mood</div>
        <div className="flex items-end gap-1 h-8">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-white/20 rounded-t"
              style={{
                height: `${Math.random() * 60 + 20}%`,
                backgroundColor: moods[Math.floor(Math.random() * moods.length)].color + '40'
              }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 60 + 20}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-1">Last 6 hours</div>
      </div>

      {/* Mood Insights */}
      <div className="mt-4 glass-card p-3">
        <div className="text-xs text-gray-400 mb-2">Insights</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white">Most common mood:</span>
            <span className="text-primary-400">Happy</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white">Mood stability:</span>
            <span className="text-green-400">Good</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white">Check-ins today:</span>
            <span className="text-zen-400">5</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodTracker