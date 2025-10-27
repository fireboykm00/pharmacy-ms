#!/bin/bash

echo "🔧 Starting Pharmacy Management Backend..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Start the Spring Boot application
echo "📦 Starting Spring Boot application..."
mvn spring-boot:run

echo "🔧 Backend server stopped"
