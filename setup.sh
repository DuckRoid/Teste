#!/bin/bash

echo "🚀 ChatApp - Setup Script"
echo "=========================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB not found. Please install MongoDB or use Docker."
fi
echo ""

# Setup Server
echo "📦 Setting up server..."
cd server
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env with your configuration"
fi

echo "Installing server dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
echo "✅ Server dependencies installed"
echo ""

# Setup Client
echo "📦 Setting up client..."
cd ../client
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

echo "Installing client dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
echo "✅ Client dependencies installed"
echo ""

cd ..

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure MongoDB is running (or use Docker: docker-compose up -d mongodb)"
echo "2. Edit server/.env with your JWT_SECRET and MongoDB URI"
echo "3. Start the server: cd server && npm run dev"
echo "4. In a new terminal, start the client: cd client && npm run dev"
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "Or use Docker Compose:"
echo "  docker-compose up"
echo ""
echo "🎉 Happy chatting!"
