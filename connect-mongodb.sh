#!/bin/bash

# MongoDB Connection Setup Script
# Usage: ./connect-mongodb.sh "your_connection_string"

if [ -z "$1" ]; then
    echo "❌ Please provide your MongoDB connection string"
    echo ""
    echo "Usage:"
    echo "  ./connect-mongodb.sh \"mongodb+srv://user:pass@cluster.net/beautyqueen?retryWrites=true&w=majority\""
    echo ""
    echo "Or set it interactively:"
    read -p "Enter your MongoDB connection string: " MONGODB_URI
else
    MONGODB_URI="$1"
fi

# Ensure database name is included
if [[ ! "$MONGODB_URI" == *"/beautyqueen"* ]]; then
    if [[ "$MONGODB_URI" == *"?"* ]]; then
        MONGODB_URI="${MONGODB_URI//\?/\/beautyqueen?}"
    else
        MONGODB_URI="${MONGODB_URI}/beautyqueen"
    fi
    echo "✅ Added /beautyqueen to connection string"
fi

echo ""
echo "🔄 Testing MongoDB connection..."
echo "📍 URI: ${MONGODB_URI//:[^:@]*@/:****@}"
echo ""

# Test the connection
node test-mongodb.js "$MONGODB_URI"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Connection successful!"
    echo ""
    echo "📝 Setting up environment..."
    
    # Export for current session
    export MONGODB_URI="$MONGODB_URI"
    
    # Try to create/update .env file (if not blocked)
    if [ -w .env ] || [ ! -f .env ]; then
        # Check if MONGODB_URI already exists in .env
        if grep -q "MONGODB_URI" .env 2>/dev/null; then
            # Update existing
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" .env
            else
                # Linux
                sed -i "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" .env
            fi
            echo "✅ Updated .env file"
        else
            # Add new
            echo "MONGODB_URI=$MONGODB_URI" >> .env
            echo "✅ Added to .env file"
        fi
    else
        echo "⚠️  Cannot write to .env file (it may be protected)"
        echo "   Please manually add this to your .env file:"
        echo "   MONGODB_URI=$MONGODB_URI"
    fi
    
    echo ""
    echo "🚀 Starting server with MongoDB connection..."
    echo ""
    
    # Stop any existing server
    pkill -f "node.*server.js" 2>/dev/null
    
    # Start server with MongoDB URI
    export MONGODB_URI="$MONGODB_URI"
    export JWT_SECRET=${JWT_SECRET:-beautyqueen_jwt_secret_key_2024_dev}
    export SESSION_SECRET=${SESSION_SECRET:-beautyqueen_session_secret_2024_dev}
    export PORT=${PORT:-3000}
    export NODE_ENV=${NODE_ENV:-development}
    
    node server.js &
    SERVER_PID=$!
    
    echo "✅ Server started (PID: $SERVER_PID)"
    echo "📍 Server running on http://localhost:3000"
    echo ""
    echo "⏳ Waiting for server to connect to MongoDB..."
    sleep 3
    
    # Check health
    HEALTH=$(curl -s http://localhost:3000/health 2>/dev/null)
    if echo "$HEALTH" | grep -q "connected"; then
        echo "✅ MongoDB connected successfully!"
        echo ""
        echo "🎉 Your application is ready!"
        echo "   Open http://localhost:3000 in your browser"
    else
        echo "⚠️  Server is running but MongoDB connection status unknown"
        echo "   Check http://localhost:3000/health for status"
    fi
else
    echo ""
    echo "❌ Connection failed. Please check:"
    echo "   1. MongoDB Atlas Network Access (allow 0.0.0.0/0)"
    echo "   2. Username and password are correct"
    echo "   3. Connection string format is correct"
    exit 1
fi

