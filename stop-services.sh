#!/bin/bash

# Pharmacy Management System - Service Stopper
# Stops all services running on ports 8080 and 5173

echo "🛑 Stopping Pharmacy Management System Services..."

# Function to stop processes on a specific port
stop_port() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "🛑 Stopping $service_name on port $port..."
        local pids=$(lsof -t -i:$port)
        if [ -n "$pids" ]; then
            for pid in $pids; do
                echo "   Killing process $pid..."
                kill -9 $pid 2>/dev/null
            done
            sleep 2
            echo "✅ $service_name on port $port stopped"
        fi
    else
        echo "✅ No $service_name found on port $port"
    fi
}

# Stop backend (port 8080)
stop_port 8080 "Backend"

# Stop frontend (port 5173) 
stop_port 5173 "Frontend"

# Also check for any Java processes that might be Spring Boot
echo ""
echo "🔍 Checking for any remaining Java processes..."
java_pids=$(pgrep -f "spring-boot:run" 2>/dev/null)
if [ -n "$java_pids" ]; then
    echo "🛑 Stopping remaining Spring Boot processes..."
    for pid in $java_pids; do
        echo "   Killing Java process $pid..."
        kill -9 $pid 2>/dev/null
    done
    echo "✅ Spring Boot processes stopped"
else
    echo "✅ No Spring Boot processes found"
fi

# Check for any Node.js processes that might be Vite dev servers
echo ""
echo "🔍 Checking for any remaining Node.js processes..."
node_pids=$(pgrep -f "vite\|pnpm dev" 2>/dev/null)
if [ -n "$node_pids" ]; then
    echo "🛑 Stopping remaining Node.js processes..."
    for pid in $node_pids; do
        echo "   Killing Node.js process $pid..."
        kill -9 $pid 2>/dev/null
    done
    echo "✅ Node.js processes stopped"
else
    echo "✅ No Node.js processes found"
fi

echo ""
echo "🎉 All Pharmacy Management System services have been stopped!"
echo "💡 You can now safely restart the services with ./run.sh"
