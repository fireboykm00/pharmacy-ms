#!/bin/bash

# Pharmacy Management System - Multi-Terminal Launcher
# Supports multiple terminal emulators

echo "🚀 Pharmacy Management System - Terminal Launcher"

# Function to open terminal with command
open_terminal() {
    local title="$1"
    local command="$2"
    local working_dir="$3"
    
    if command -v gnome-terminal >/dev/null 2>&1; then
        gnome-terminal --title="$title" --working-directory="$working_dir" -- bash -c "$command; exec bash" &
    elif command -v xterm >/dev/null 2>&1; then
        xterm -title "$title" -e "cd '$working_dir' && bash -c '$command; exec bash'" &
    elif command -v konsole >/dev/null 2>&1; then
        konsole --new-tab -p "tabtitle=$title" --workdir "$working_dir" -e bash -c "$command; exec bash" &
    elif command -v xfce4-terminal >/dev/null 2>&1; then
        xfce4-terminal --title="$title" --working-directory="$working_dir" -- bash -c "$command; exec bash" &
    else
        echo "❌ No supported terminal found. Please run manually:"
        echo "   Terminal 1: cd backend && mvn spring-boot:run"
        echo "   Terminal 2: cd frontend && pnpm dev"
        exit 1
    fi
}

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

# Get absolute paths
BACKEND_DIR="$(pwd)/backend"
FRONTEND_DIR="$(pwd)/frontend"

echo "📦 Opening Backend Terminal..."
open_terminal "Pharmacy Backend" "echo '🔧 Starting Pharmacy Backend...'; mvn spring-boot:run" "$BACKEND_DIR"

sleep 3

echo "🎨 Opening Frontend Terminal..."
open_terminal "Pharmacy Frontend" "echo '🎨 Starting Pharmacy Frontend...'; pnpm dev" "$FRONTEND_DIR"

echo ""
echo "✅ System started in separate terminals!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8080"
echo "🗄️  H2 Console: http://localhost:8080/h2-console"
echo ""
echo "📋 Login Credentials:"
echo "   Admin: admin@pharmacy.com / admin123"
echo "   Pharmacist: pharmacist@pharmacy.com / pharma123"
echo "   Cashier: cashier@pharmacy.com / cashier123"
