# 🧠 MindMate - AI Mental Health & Productivity Co-Pilot

A revolutionary 3D immersive mental health and productivity application built with React, Three.js, and modern web technologies.

## ✨ Features

### 🧠 Mental Health Companion
- **AI Chat Interface**: Intelligent conversations with GPT-4 powered responses
- **Mood Tracking**: Real-time mood monitoring with visual analytics
- **Breathing Exercises**: Guided breathing with 3D visual feedback
- **Emotional Support**: Empathetic AI responses based on user sentiment

### 📈 Productivity Tools
- **3D Pomodoro Timer**: Immersive focus sessions with visual feedback
- **Focus Room**: Dedicated 3D environment for deep work
- **Productivity Analytics**: Track your focus sessions and progress
- **Goal Visualization**: 3D representation of your achievements

### 🌌 Immersive 3D Environments
- **Zen Room**: Calming floating island with meditation space
- **Focus Room**: Minimalist workspace with productivity tools
- **Emotion Tunnel**: Visual journey through your mood history
- **AI Avatar**: Reactive 3D companion that responds to your emotions

### 🎨 Beautiful UI/UX
- **Glassmorphism Design**: Modern glass-like interface elements
- **Smooth Animations**: Framer Motion powered transitions
- **Dark Mode**: Focus-friendly dark theme
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Three.js** - 3D graphics and animations
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework

### 3D Features
- **@react-three/drei** - Useful helpers for React Three Fiber
- **@react-three/fiber** - React renderer for Three.js
- **Three.js** - 3D library for web graphics

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Glassmorphism and neumorphism effects
- **Google Fonts** - Inter and Poppins typography

## 📁 Project Structure

```
mindmate/
├── src/
│   ├── components/
│   │   ├── AIAvatar.jsx          # 3D AI companion
│   │   ├── BreathingBubble.jsx   # Breathing exercise interface
│   │   ├── ChatInterface.jsx     # AI chat component
│   │   ├── EmotionTunnel.jsx     # Mood visualization tunnel
│   │   ├── FocusRoom.jsx         # 3D productivity space
│   │   ├── MoodTracker.jsx       # Mood tracking component
│   │   └── ZenRoom.jsx           # 3D meditation space
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles and Tailwind
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## 🎮 How to Use

### Navigation
- Use the top navigation to switch between different 3D environments
- Click the floating action buttons for quick access to chat and breathing exercises
- Use the mood tracker on the left to update your current emotional state

### 3D Environments
1. **Welcome**: Meet your AI companion and get started
2. **Zen Room**: Meditate in a peaceful floating environment
3. **Focus Room**: Use the Pomodoro timer for productive work sessions
4. **Emotion Tunnel**: Visualize your mood patterns over time
5. **Breathing Exercise**: Guided breathing with visual feedback

### AI Chat
- Click the chat button to open the AI conversation interface
- Share your feelings and get empathetic responses
- Use quick mood buttons for instant mood updates

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#0ea5e9` to `#0284c7`)
- **Zen**: Purple gradient (`#a855f7` to `#9333ea`)
- **Success**: Green (`#10b981`)
- **Warning**: Orange (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Typography
- **Primary Font**: Inter (clean, modern)
- **Display Font**: Poppins (for headings)

### Effects
- **Glassmorphism**: Translucent glass-like elements
- **Neumorphism**: Soft, realistic shadows
- **Gradients**: Smooth color transitions
- **Animations**: Smooth, purposeful motion

## 🔧 Customization

### Adding New 3D Environments
1. Create a new component in `src/components/`
2. Import Three.js and React Three Fiber components
3. Add the environment to the `renderRoom()` function in `App.jsx`
4. Update the navigation in the rooms object

### Customizing AI Responses
1. Modify the `generateAIResponse()` function in `ChatInterface.jsx`
2. Add new mood categories and responses
3. Integrate with actual AI APIs for production use

### Styling Changes
1. Update `tailwind.config.js` for new colors and animations
2. Modify `src/index.css` for custom CSS classes
3. Use the existing design system classes for consistency

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the dist folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** for 3D graphics capabilities
- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling
- **React Three Fiber** for React integration with Three.js

## 🆘 Support

If you need help or have questions:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Built with ❤️ for better mental health and productivity**
