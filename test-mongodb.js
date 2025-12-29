#!/usr/bin/env node

/**
 * Quick MongoDB Connection Test
 * Usage: node test-mongodb.js "your_connection_string"
 */

const mongoose = require('mongoose');

const mongoURI = process.argv[2] || process.env.MONGODB_URI;

if (!mongoURI) {
    console.error('❌ No MongoDB URI provided!');
    console.log('\nUsage:');
    console.log('  node test-mongodb.js "mongodb+srv://user:pass@cluster.net/beautyqueen"');
    console.log('  Or set MONGODB_URI environment variable');
    console.log('\nTo get your MongoDB Atlas connection string:');
    console.log('1. Go to https://cloud.mongodb.com');
    console.log('2. Click "Connect" on your cluster');
    console.log('3. Choose "Connect your application"');
    console.log('4. Copy the connection string');
    console.log('5. Replace <password> with your actual password');
    console.log('6. Add /beautyqueen before the ?');
    process.exit(1);
}

async function testConnection() {
    try {
        console.log('🔄 Testing MongoDB connection...');
        console.log(`📍 URI: ${mongoURI.replace(/:[^:@]+@/, ':****@')}\n`);
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000
        });
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        
        // Test a simple operation
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`   Collections: ${collections.length} found`);
        
        await mongoose.connection.close();
        console.log('\n✅ Connection test passed! You can now use this URI in your .env file.');
        process.exit(0);
    } catch (error) {
        console.error(`\n❌ Connection Failed: ${error.message}\n`);
        
        if (error.message.includes('authentication failed')) {
            console.error('💡 Fix: Check your MongoDB username and password');
            console.error('   - Go to MongoDB Atlas → Database Access');
            console.error('   - Verify your user credentials');
        } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
            console.error('💡 Fix: Check MongoDB Atlas Network Access');
            console.error('   - Go to MongoDB Atlas → Network Access');
            console.error('   - Click "Add IP Address"');
            console.error('   - Click "Allow Access from Anywhere" (0.0.0.0/0)');
            console.error('   - Wait 2-3 minutes for changes to apply');
        } else if (error.message.includes('bad auth')) {
            console.error('💡 Fix: Check database user permissions');
            console.error('   - Go to MongoDB Atlas → Database Access');
            console.error('   - Edit your user');
            console.error('   - Ensure "Read and write to any database" is selected');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('💡 Fix: Check your MongoDB Atlas cluster URL');
            console.error('   - Verify the cluster name in your connection string');
        }
        
        process.exit(1);
    }
}

testConnection();

