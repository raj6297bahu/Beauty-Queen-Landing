#!/bin/bash

# Start server with MongoDB connection string
# This script shows detailed error messages

export MONGODB_URI="mongodb+srv://devdanmukherjeerajmukherjee_db_user:8BnFGaWG2cURlwNt@cluster0.5dmyz9v.mongodb.net/beautyqueen?retryWrites=true&w=majority"
export JWT_SECRET="beautyqueen_jwt_secret_key_2024_dev"
export SESSION_SECRET="beautyqueen_session_secret_2024_dev"
export PORT=3000
export NODE_ENV=development

echo "🚀 Starting Beauty Queen server..."
echo "📍 MongoDB URI: mongodb+srv://devdanmukherjeerajmukherjee_db_user:****@cluster0.5dmyz9v.mongodb.net/beautyqueen"
echo ""
echo "⏳ Attempting to connect to MongoDB..."
echo "   (This may take 10-15 seconds if network access was just enabled)"
echo ""

# Start server (will show connection errors if any)
node server.js

