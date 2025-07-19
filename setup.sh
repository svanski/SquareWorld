#!/bin/bash

echo "Setting up Square World..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

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
echo "This will start both the React frontend (http://localhost:3000) and NestJS backend (http://localhost:3001)"
