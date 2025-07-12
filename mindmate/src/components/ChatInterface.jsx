import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ChatInterface = ({ mood, setMood }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your MindMate AI companion. How are you feeling today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // AI Response Generator (Mock for now)
  const generateAIResponse = (userMessage) => {
    const responses = {
      happy: [
        "That's wonderful! I'm so glad you're feeling happy today. What's bringing you this joy?",
        "Your positive energy is contagious! Keep spreading that happiness around.",
        "It's great to see you in such good spirits. What would you like to accomplish today?"
      ],
      sad: [
        "I'm here for you. It's okay to feel sad sometimes. Would you like to talk about what's on your mind?",
        "I understand this is a difficult time. Remember, you're not alone in this.",
        "Let's take a moment to breathe together. Sometimes just acknowledging our feelings helps."
      ],
      anxious: [
        "I can sense you're feeling anxious. Let's take some deep breaths together.",
        "Anxiety can be overwhelming. What's causing you to feel this way?",
        "Remember, this feeling will pass. You're stronger than your anxiety."
      ],
      angry: [
        "I can see you're feeling frustrated. It's okay to feel angry sometimes.",
        "Let's work through this together. What's making you feel this way?",
        "Taking a moment to pause and breathe can help when we're feeling angry."
      ],
      neutral: [
        "How are you really feeling? Sometimes neutral can mean we're processing things.",
        "It's okay to feel neutral. What's on your mind today?",
        "Let's explore what might help you feel more engaged or positive."
      ]
    }

    // Simple sentiment analysis (in real app, use proper NLP)
    const lowerMessage = userMessage.toLowerCase()
    let detectedMood = 'neutral'
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      detectedMood = 'happy'
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      detectedMood = 'sad'
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
      detectedMood = 'anxious'
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('frustrated')) {
      detectedMood = 'angry'
    }

    // Update mood if detected
    if (detectedMood !== 'neutral') {
      setMood(detectedMood)
    }

    const moodResponses = responses[detectedMood] || responses.neutral
    return moodResponses[Math.floor(Math.random() * moodResponses.length)]
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="glass-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-zen-400 flex items-center justify-center">
            🧠
          </div>
          <div>
            <h3 className="font-semibold text-white">MindMate AI</h3>
            <p className="text-xs text-gray-400">Mental Health Companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-primary-500 to-zen-500 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 p-3 rounded-2xl">
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How are you feeling today?"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-primary-400"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '100px' }}
          />
          <motion.button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="btn-primary px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➤
          </motion.button>
        </div>
        
        {/* Quick Mood Buttons */}
        <div className="flex gap-2 mt-3">
          {['😊', '😔', '😤', '😰', '😐'].map((emoji, index) => (
            <motion.button
              key={index}
              onClick={() => setInputMessage(prev => prev + ` I'm feeling ${['happy', 'sad', 'angry', 'anxious', 'neutral'][index]} today.`)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatInterface