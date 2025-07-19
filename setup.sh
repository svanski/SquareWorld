#!/bin/bash

echo "Setting up Square World..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ui
npm install
cd ..

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "This will start both the React frontend (http://localhost:5173) and NestJS backend (http://localhost:3001)"
