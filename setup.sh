#!/bin/bash

# Geopolitical Intelligence Dashboard Setup Script
# This script sets up the entire project for development or production

echo "🌍 Setting up Geopolitical Intelligence Dashboard..."

# Check if .env file exists, if not create from example
if [ ! -f "geo-backend/.env" ]; then
    echo "📝 Creating backend environment file..."
    cp geo-backend/.env.example geo-backend/.env
    echo "⚠️  Please edit geo-backend/.env with your API keys!"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd geo-backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd geo-frontend
npm install
cd ..

# Git initialization
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Geopolitical Intelligence Dashboard"
    
    echo "🏷️  Setting up Git tags..."
    git tag -a v1.0.0 -m "Initial release - Geopolitical Intelligence Dashboard"
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   Terminal 1 (Backend): cd geo-backend && uvicorn app.main:app --reload"
echo "   Terminal 2 (Frontend): cd geo-frontend && npm start"
echo ""
echo "🐳 For Docker deployment:"
echo "   docker-compose up --build"
echo ""
echo "📖 Don't forget to:"
echo "   1. Edit geo-backend/.env with your NewsData API key"
echo "   2. Visit http://localhost:3000 for the dashboard"
echo "   3. Visit http://localhost:8000/docs for API documentation"
