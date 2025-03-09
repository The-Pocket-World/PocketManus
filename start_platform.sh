#!/bin/bash

# PocketManus Platform Startup Script
# This script starts both the backend and frontend servers for the PocketManus platform

echo "Starting PocketManus Platform..."

# Check if Python and Node.js are installed
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Error: Node.js/npm is not installed. Please install Node.js 14 or higher."
    exit 1
fi

# Check if required Python packages are installed
if ! python -c "import fastapi, uvicorn" &> /dev/null; then
    echo "Installing required Python packages..."
    pip install fastapi uvicorn
fi

# Start the backend server in the background
echo "Starting backend server..."
cd "$(dirname "$0")/backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Install frontend dependencies if node_modules doesn't exist
cd "$(dirname "$0")/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start the frontend development server
echo "Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID
    exit 0
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM

echo "PocketManus Platform is running!"
echo "- Backend: http://localhost:8000"
echo "- Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop the servers."

# Keep the script running
wait
