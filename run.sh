#!/bin/bash

# Pharmacy Management System - Run Script
# This script opens two separate terminals for backend and frontend

echo "🚀 Starting Pharmacy Management System..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists mvn; then
    echo "❌ Maven is not installed. Please install Maven first."
    exit 1
fi

if ! command_exists pnpm; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Function to stop processes on a specific port
stop_port() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "🛑 Stopping existing $service_name on port $port..."
        local pid=$(lsof -t -i:$port)
        if [ -n "$pid" ]; then
            kill -9 $pid 2>/dev/null
            sleep 2
            echo "✅ $service_name on port $port stopped"
        fi
    else
        echo "✅ Port $port is free"
    fi
}

echo "🧹 Cleaning up existing services..."
stop_port 8080 "Backend"
stop_port 5173 "Frontend"
echo ""

# Check if gnome-terminal is available
if command_exists gnome-terminal; then
    TERMINAL_CMD="gnome-terminal"
elif command_exists xterm; then
    TERMINAL_CMD="xterm"
elif command_exists konsole; then
    TERMINAL_CMD="konsole"
else
    echo "❌ No supported terminal emulator found. Please install gnome-terminal, xterm, or konsole."
    exit 1
fi

echo "📦 Opening backend terminal..."
cd backend

# Start backend in new terminal
if [ "$TERMINAL_CMD" = "gnome-terminal" ]; then
    gnome-terminal --title="Pharmacy Backend" -- bash -c "echo '🔧 Starting Pharmacy Backend...'; mvn spring-boot:run; exec bash"
elif [ "$TERMINAL_CMD" = "xterm" ]; then
    xterm -title "Pharmacy Backend" -e "bash -c 'echo \"🔧 Starting Pharmacy Backend...\"; mvn spring-boot:run; exec bash'" &
elif [ "$TERMINAL_CMD" = "konsole" ]; then
    konsole --new-tab -p "tabtitle=Pharmacy Backend" -e bash -c "echo '🔧 Starting Pharmacy Backend...'; mvn spring-boot:run; exec bash" &
fi

BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 3

echo "🎨 Opening frontend terminal..."
cd ../frontend

# Start frontend in new terminal
if [ "$TERMINAL_CMD" = "gnome-terminal" ]; then
    gnome-terminal --title="Pharmacy Frontend" -- bash -c "echo '🎨 Starting Pharmacy Frontend...'; pnpm dev; exec bash"
elif [ "$TERMINAL_CMD" = "xterm" ]; then
    xterm -title "Pharmacy Frontend" -e "bash -c 'echo \"🎨 Starting Pharmacy Frontend...\"; pnpm dev; exec bash'" &
elif [ "$TERMINAL_CMD" = "konsole" ]; then
    konsole --new-tab -p "tabtitle=Pharmacy Frontend" -e bash -c "echo '🎨 Starting Pharmacy Frontend...'; pnpm dev; exec bash" &
fi

FRONTEND_PID=$!

echo ""
echo "✅ Pharmacy Management System is starting in separate terminals!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8080"
echo "🗄️  H2 Console: http://localhost:8080/h2-console"
echo ""
echo "📋 Login Credentials:"
echo "   Admin: admin@pharmacy.com / admin123"
echo "   Pharmacist: pharmacist@pharmacy.com / pharma123"
echo "   Cashier: cashier@pharmacy.com / cashier123"
echo ""
echo "💡 Each service is running in its own terminal window."
echo "   Close the terminal windows to stop the services."
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping background processes..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Background processes stopped"
    exit 0
}

# Set up signal handler for Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
