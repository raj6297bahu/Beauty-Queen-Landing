#!/bin/bash

# Start script for Beauty Queen on localhost
# This sets default environment variables if .env doesn't exist

export PORT=${PORT:-3000}
export MONGODB_URI=${MONGODB_URI:-mongodb://localhost:27017/beautyqueen}
export JWT_SECRET=${JWT_SECRET:-beautyqueen_jwt_secret_key_2024_dev}
export SESSION_SECRET=${SESSION_SECRET:-beautyqueen_session_secret_2024_dev}
export EMAIL_USER=${EMAIL_USER:-devdanmukherjeerajmukherjee@gmail.com}
export EMAIL_PASS=${EMAIL_PASS:-your_gmail_app_password_here}
export RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID:-your_razorpay_key_id}
export RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET:-your_razorpay_key_secret}
export NODE_ENV=${NODE_ENV:-development}

echo "🚀 Starting Beauty Queen server..."
echo "📍 Server will run on http://localhost:${PORT}"
echo ""
echo "⚠️  Note: Make sure MongoDB is running!"
echo "   - Local MongoDB: mongod"
echo "   - Or update MONGODB_URI to use MongoDB Atlas"
echo ""

node server.js

