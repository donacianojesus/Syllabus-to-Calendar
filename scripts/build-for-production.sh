#!/bin/bash

# Build script for production deployment
echo "🚀 Building LawBandit Calendar for production..."

# Build frontend
echo "📦 Building frontend..."
cd src/frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
    echo "📁 Built files are in src/frontend/dist/"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Build backend
echo "📦 Building backend..."
cd ../backend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Backend build successful!"
    echo "📁 Built files are in src/backend/dist/"
else
    echo "❌ Backend build failed!"
    exit 1
fi

echo ""
echo "🎉 Build complete! Ready for deployment."
echo ""
echo "Next steps:"
echo "1. Deploy backend to Railway/Render"
echo "2. Update VITE_API_URL in vercel.json with your backend URL"
echo "3. Deploy frontend to Vercel"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
