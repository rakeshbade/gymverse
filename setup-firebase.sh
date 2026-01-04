#!/bin/bash

# VyaM Firebase Setup Script
set -e

echo "🔥 VyaM Firebase Setup"
echo "======================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI already installed"
fi

# Login to Firebase
echo ""
echo "📝 Logging into Firebase..."
firebase login

# Initialize Firebase
if [ ! -f "firebase.json" ]; then
    echo ""
    echo "🔧 Initializing Firebase..."
    firebase init
else
    echo "✅ firebase.json exists"
fi

# Deploy rules
echo ""
echo "🔐 Deploying security rules..."
firebase deploy --only firestore:rules,storage

# Upload workouts
echo ""
echo "📤 Uploading workouts.json..."
firebase storage:upload assets/workouts.json master/workouts.json

echo ""
echo "✅ Setup complete!"
