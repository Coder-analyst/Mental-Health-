import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Sphere, 
  Box, 
  Cylinder, 
  Text3D, 
  Float, 
  Billboard,
  useTexture,
  Sparkles
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useSpeechSynthesis } from 'react-speech-kit';

const AvatarContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 400px;
  background: rgba(0, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 2px solid #00ffff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.3),
    inset 0 0 20px rgba(0, 255, 255, 0.1);
  z-index: 1000;
`;

const ChatWindow = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.3);
`;

const Message = styled(motion.div)`
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    background: rgba(255, 0, 255, 0.2);
    border: 1px solid #ff00ff;
    color: #ff00ff;
    margin-left: 20px;
    text-align: right;
  ` : `
    background: rgba(0, 255, 255, 0.2);
    border: 1px solid #00ffff;
    color: #00ffff;
    margin-right: 20px;
  `}
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ffff;
  border-radius: 10px;
  color: #00ffff;
  font-family: 'Rajdhani', sans-serif;
  outline: none;
  
  &::placeholder {
    color: rgba(0, 255, 255, 0.5);
  }
  
  &:focus {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background: linear-gradient(45deg, #00ffff, #0088ff);
  border: none;
  border-radius: 10px;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.active ? '#00ff00' : '#ff0000'};
  box-shadow: 0 0 10px ${props => props.active ? '#00ff00' : '#ff0000'};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

// 3D Avatar Component
function Avatar3D({ mood, isListening, isSpeaking }) {
  const avatarRef = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const mouthRef = useRef();

  useFrame((state) => {
    // Floating animation
    if (avatarRef.current) {
      avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Eye animations
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkCycle = Math.sin(state.clock.elapsedTime * 3);
      if (blinkCycle > 0.9) {
        eyeLeftRef.current.scale.y = 0.1;
        eyeRightRef.current.scale.y = 0.1;
      } else {
        eyeLeftRef.current.scale.y = 1;
        eyeRightRef.current.scale.y = 1;
      }
    }

    // Mouth animation when speaking
    if (mouthRef.current && isSpeaking) {
      mouthRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.3);
    }
  });

  const moodColors = {
    happy: '#00ff00',
    thinking: '#ffff00',
    excited: '#ff00ff',
    neutral: '#00ffff',
    concerned: '#ff8800'
  };

  return (
    <group ref={avatarRef}>
      {/* Head */}
      <Sphere args={[0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={moodColors[mood] || '#00ffff'}
          emissive={moodColors[mood] || '#00ffff'}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Eyes */}
      <Sphere ref={eyeLeftRef} args={[0.1]} position={[-0.3, 0.2, 0.7]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Sphere>
      <Sphere ref={eyeRightRef} args={[0.1]} position={[0.3, 0.2, 0.7]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Sphere>

      {/* Mouth */}
      <Box ref={mouthRef} args={[0.3, 0.1, 0.1]} position={[0, -0.2, 0.7]}>
        <meshStandardMaterial
          color={isSpeaking ? '#ff0000' : '#ffffff'}
          emissive={isSpeaking ? '#ff0000' : '#ffffff'}
          emissiveIntensity={0.5}
        />
      </Box>

      {/* Holographic Ring */}
      <Float rotationIntensity={2} floatIntensity={0}>
        <group>
          {[0, 1, 2].map(i => (
            <Cylinder
              key={i}
              args={[1.2 + i * 0.2, 1.2 + i * 0.2, 0.02]}
              position={[0, 0, 0]}
              rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
            >
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.5}
                transparent
                opacity={0.3 - i * 0.1}
              />
            </Cylinder>
          ))}
        </group>
      </Float>

      {/* Listening Indicator */}
      {isListening && (
        <Float floatIntensity={2}>
          <group position={[0, 1.5, 0]}>
            <Sparkles count={20} scale={2} size={2} speed={2} color="#00ff00" />
            <Text3D
              font="/fonts/orbitron.json"
              size={0.1}
              height={0.01}
              position={[-0.3, 0, 0]}
            >
              Listening...
              <meshStandardMaterial
                color="#00ff00"
                emissive="#00ff00"
                emissiveIntensity={0.5}
              />
            </Text3D>
          </group>
        </Float>
      )}

      {/* Thinking Indicator */}
      {mood === 'thinking' && (
        <Float floatIntensity={1} rotationIntensity={1}>
          <group position={[0, 1.2, 0]}>
            {[0, 1, 2].map(i => (
              <Sphere key={i} args={[0.05]} position={[i * 0.2 - 0.2, Math.sin(Date.now() * 0.01 + i) * 0.1, 0]}>
                <meshStandardMaterial
                  color="#ffff00"
                  emissive="#ffff00"
                  emissiveIntensity={1}
                />
              </Sphere>
            ))}
          </group>
        </Float>
      )}

      {/* Neural Network Effect */}
      <group>
        {Array.from({ length: 8 }, (_, i) => (
          <Float key={i} floatIntensity={0.5} speed={1 + i * 0.2}>
            <Sphere
              args={[0.02]}
              position={[
                Math.cos((i * Math.PI) / 4) * 1.5,
                Math.sin((i * Math.PI) / 4) * 1.5,
                Math.sin(i) * 0.5
              ]}
            >
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.8}
              />
            </Sphere>
          </Float>
        ))}
      </group>
    </group>
  );
}

const predefinedResponses = {
  greetings: [
    "Hello! I'm SmaartAva, your AI real estate assistant. How can I help you find the perfect property in Mumbai?",
    "Welcome to the future of real estate! I'm here to help you predict house prices and find amazing deals.",
    "Hi there! Ready to explore Mumbai's property market with AI precision?"
  ],
  priceQuestions: [
    "I can predict house prices based on location, amenities, and market trends. Which area interests you?",
    "Let me analyze the property data for you. What's your budget range and preferred location?",
    "I'll use advanced ML algorithms to give you accurate price predictions. Tell me about your requirements."
  ],
  schemes: [
    "I can help you find applicable government schemes like PMAY, MHADA, and others. What's your family income?",
    "There are many housing schemes available! Let me check your eligibility based on your profile.",
    "Government subsidies can save you lakhs! Share your details and I'll find the best schemes for you."
  ],
  areas: [
    "Mumbai has amazing areas like Bandra, Andheri, Powai, and Navi Mumbai. Each has unique advantages!",
    "Let me show you price trends and growth potential for different Mumbai localities.",
    "I can compare multiple areas based on infrastructure, connectivity, and future development plans."
  ],
  infrastructure: [
    "Mumbai's metro expansion and new airport will boost property values significantly!",
    "Infrastructure like metro stations, malls, and hospitals can increase property prices by 15-30%.",
    "I analyze nearby amenities to predict future price appreciation. Location is everything!"
  ]
};

export default function SmaartAva({ position, userProfile }) {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm SmaartAva, your AI property advisor. Ask me anything about Mumbai real estate!", isUser: false, timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [mood, setMood] = useState('neutral');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const { speak, voices, supported } = useSpeechSynthesis();

  const getResponseCategory = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return 'greetings';
    if (lower.includes('price') || lower.includes('cost') || lower.includes('expensive')) return 'priceQuestions';
    if (lower.includes('scheme') || lower.includes('subsidy') || lower.includes('government')) return 'schemes';
    if (lower.includes('area') || lower.includes('location') || lower.includes('where')) return 'areas';
    if (lower.includes('metro') || lower.includes('infrastructure') || lower.includes('development')) return 'infrastructure';
    return 'priceQuestions';
  };

  const generateResponse = (userMessage) => {
    const category = getResponseCategory(userMessage);
    const responses = predefinedResponses[category];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add personality based on user profile
    if (userProfile) {
      return `${randomResponse} Since you're looking in the ${userProfile.preferredArea || 'Mumbai'} area, I have some specific insights for you!`;
    }
    
    return randomResponse;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { text: inputText, isUser: true, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    // Set AI thinking mood
    setMood('thinking');

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateResponse(inputText);
      const aiMessage = { text: response, isUser: false, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response
      if (supported) {
        setIsSpeaking(true);
        speak({
          text: response,
          voice: voices.find(v => v.name.includes('Female')) || voices[0],
          rate: 0.9,
          pitch: 1.1
        });
        setTimeout(() => setIsSpeaking(false), response.length * 50);
      }

      setMood('happy');
      setTimeout(() => setMood('neutral'), 3000);
    }, 1500);

    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      setIsListening(true);
      setMood('excited');

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        setMood('neutral');
      };

      recognition.onerror = () => {
        setIsListening(false);
        setMood('concerned');
        setTimeout(() => setMood('neutral'), 2000);
      };

      recognition.start();
    }
  };

  return (
    <>
      {/* 3D Avatar in the scene */}
      <Float floatIntensity={1} rotationIntensity={0.5}>
        <group position={[35, 15, 20]}>
          <Avatar3D mood={mood} isListening={isListening} isSpeaking={isSpeaking} />
          <Billboard>
            <Text3D
              font="/fonts/orbitron.json"
              size={0.5}
              height={0.1}
              position={[0, -2, 0]}
            >
              SmaartAva
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.5}
              />
            </Text3D>
          </Billboard>
        </group>
      </Float>

      {/* Chat Interface */}
      <AnimatePresence>
        {!isMinimized && (
          <AvatarContainer
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <StatusIndicator active={true} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 className="hologram-text" style={{ margin: 0 }}>SmaartAva AI</h3>
              <Button onClick={() => setIsMinimized(true)}>_</Button>
            </div>

            <ChatWindow>
              <AnimatePresence>
                {messages.map((message, index) => (
                  <Message
                    key={index}
                    isUser={message.isUser}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {message.text}
                  </Message>
                ))}
              </AnimatePresence>
            </ChatWindow>

            <InputContainer>
              <ChatInput
                type="text"
                placeholder="Ask me about Mumbai real estate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={startListening} disabled={isListening}>
                🎤
              </Button>
              <Button onClick={handleSendMessage}>Send</Button>
            </InputContainer>

            {mood === 'thinking' && (
              <motion.div
                style={{ 
                  textAlign: 'center', 
                  color: '#ffff00', 
                  fontSize: '12px',
                  marginTop: '5px'
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                SmaartAva is thinking...
              </motion.div>
            )}
          </AvatarContainer>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      {isMinimized && (
        <motion.div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            zIndex: 1000
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMinimized(false)}
        >
          <span style={{ fontSize: '24px' }}>🤖</span>
        </motion.div>
      )}
    </>
  );
}