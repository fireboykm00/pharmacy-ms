#!/bin/bash

# Simple script to open two terminals for backend and frontend

echo "🚀 Opening Pharmacy Management System in separate terminals..."

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

# Open backend terminal
echo "📦 Opening backend terminal..."
gnome-terminal --working-directory=$(pwd)/backend --title="Pharmacy Backend" -- bash -c "echo '🔧 Starting Pharmacy Backend...'; mvn spring-boot:run; exec bash" &

# Wait a moment
sleep 2

# Open frontend terminal  
echo "🎨 Opening frontend terminal..."
gnome-terminal --working-directory=$(pwd)/frontend --title="Pharmacy Frontend" -- bash -c "echo '🎨 Starting Pharmacy Frontend...'; pnpm dev; exec bash" &

echo ""
echo "✅ Two terminal windows have been opened!"
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
echo "💡 Close each terminal window to stop the corresponding service."
