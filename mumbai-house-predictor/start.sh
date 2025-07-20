#!/bin/bash

echo "🏙️ Welcome to Mumbai House Price Predictor 3D!"
echo "🚀 Starting the most futuristic real estate app ever built..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if we're in the correct directory
if [ ! -d "frontend" ] || [ ! -d "backend" ] || [ ! -d "ml-model" ]; then
    print_error "Please run this script from the project root directory."
    exit 1
fi

print_status "Installing dependencies..."

# Install frontend dependencies
print_status "📦 Installing frontend dependencies..."
cd frontend
if npm install; then
    print_success "Frontend dependencies installed!"
else
    print_error "Failed to install frontend dependencies."
    exit 1
fi
cd ..

# Install backend dependencies
print_status "🐍 Installing backend dependencies..."
cd backend
if pip3 install -r requirements.txt; then
    print_success "Backend dependencies installed!"
else
    print_error "Failed to install backend dependencies."
    exit 1
fi
cd ..

# Train ML model if it doesn't exist
if [ ! -d "ml-model/models" ]; then
    print_status "🤖 Training ML model (this may take a few minutes)..."
    cd ml-model
    if python3 train_model.py; then
        print_success "ML model trained successfully!"
    else
        print_warning "ML model training failed, but the app will still work with simulated predictions."
    fi
    cd ..
else
    print_success "ML model already exists!"
fi

# Create a simple process management script
cat > run_all.sh << 'EOF'
#!/bin/bash

# Function to kill all processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down all services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting all services..."

# Start backend
echo "🐍 Starting backend API server..."
cd backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "⚛️ Starting frontend development server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📱 Frontend (3D Experience): http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all background jobs
wait
EOF

chmod +x run_all.sh

print_success "Setup completed successfully!"
echo ""
echo "🎉 ${GREEN}Mumbai House Price Predictor 3D is ready!${NC}"
echo ""
echo "${PURPLE}To start the application:${NC}"
echo "  ${CYAN}./run_all.sh${NC}"
echo ""
echo "${PURPLE}Or start services individually:${NC}"
echo "  ${CYAN}Backend:${NC}  cd backend && python3 -m uvicorn app.main:app --reload"
echo "  ${CYAN}Frontend:${NC} cd frontend && npm start"
echo ""
echo "${YELLOW}🌟 Features you'll experience:${NC}"
echo "  🏙️ 3D Mumbai skyline with interactive buildings"
echo "  🤖 SmaartAva AI assistant with voice commands"
echo "  📈 3D data mountains showing price trends"
echo "  🎮 Gamified property hunt mode"
echo "  💫 Holographic displays and particle effects"
echo "  🔮 AI-powered price predictions"
echo "  🏛️ Government scheme recommendations"
echo ""
echo "${GREEN}Welcome to the future of real estate! 🚀${NC}"