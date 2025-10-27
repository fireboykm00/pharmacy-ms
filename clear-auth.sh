#!/bin/bash

echo "🧹 Clearing authentication data..."

# Stop any running services first
echo "🛑 Stopping existing services..."
./stop-services.sh

echo "✅ Authentication data cleared!"
echo "💡 Old JWT tokens have been invalidated."
echo "🔄 Please restart the application with ./run.sh"
echo "🔑 You will need to login again with fresh credentials."
