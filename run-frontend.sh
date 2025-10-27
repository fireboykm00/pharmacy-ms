#!/bin/bash

echo "🎨 Starting Pharmacy Management Frontend..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    echo "💡 You can install pnpm with: npm install -g pnpm"
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Start the development server
echo "🚀 Starting React development server..."
pnpm dev

echo "🎨 Frontend server stopped"
