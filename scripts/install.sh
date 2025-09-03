#!/bin/bash

# LawBandit Calendar Installation Script

echo "🚀 Setting up LawBandit Calendar..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd src/backend
npm install
cd ../..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd src/frontend
npm install
cd ../..

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

echo "✅ Installation complete!"
echo ""
echo "🎉 Next steps:"
echo "1. Edit .env file with your configuration (if needed)"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see docs/DEVELOPMENT.md"
