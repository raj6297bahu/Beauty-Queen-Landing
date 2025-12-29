#!/usr/bin/env node

/**
 * MongoDB Connection Setup Helper
 * This script helps you connect to MongoDB Atlas
 */

const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function testConnection(uri) {
    try {
        console.log('\n🔄 Testing MongoDB connection...');
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        
        await mongoose.connection.close();
        return true;
    } catch (error) {
        console.error(`❌ Connection Failed: ${error.message}`);
        
        if (error.message.includes('authentication failed')) {
            console.error('💡 Fix: Check your MongoDB username and password');
        } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
            console.error('💡 Fix: Check MongoDB Atlas Network Access - allow 0.0.0.0/0');
        } else if (error.message.includes('bad auth')) {
            console.error('💡 Fix: Check database user permissions in MongoDB Atlas');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('💡 Fix: Check your MongoDB Atlas cluster URL');
        }
        
        return false;
    }
}

async function main() {
    console.log('🔧 MongoDB Connection Setup\n');
    console.log('You have two options:');
    console.log('1. MongoDB Atlas (Cloud - Recommended)');
    console.log('2. Local MongoDB (Requires MongoDB installation)\n');
    
    const choice = await question('Choose option (1 or 2): ');
    
    let mongoURI;
    
    if (choice === '1') {
        console.log('\n📋 MongoDB Atlas Setup:');
        console.log('1. Go to https://cloud.mongodb.com');
        console.log('2. Create/Select your cluster');
        console.log('3. Click "Connect" → "Connect your application"');
        console.log('4. Copy the connection string\n');
        
        const cluster = await question('Enter your MongoDB Atlas connection string: ');
        
        if (cluster.trim()) {
            mongoURI = cluster.trim();
            // Ensure it includes the database name
            if (!mongoURI.includes('/beautyqueen')) {
                if (mongoURI.includes('?')) {
                    mongoURI = mongoURI.replace('?', '/beautyqueen?');
                } else {
                    mongoURI = mongoURI + '/beautyqueen';
                }
            }
        } else {
            // Use the cluster from the docs
            const username = 'devdanmukherjeerajmukherjee_db_user';
            const password = await question(`Enter password for ${username}: `);
            mongoURI = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.5dmyz9v.mongodb.net/beautyqueen?retryWrites=true&w=majority`;
        }
    } else if (choice === '2') {
        console.log('\n📋 Local MongoDB Setup:');
        console.log('Make sure MongoDB is installed and running');
        console.log('Start MongoDB with: mongod\n');
        
        mongoURI = await question('Enter local MongoDB URI (default: mongodb://localhost:27017/beautyqueen): ');
        if (!mongoURI.trim()) {
            mongoURI = 'mongodb://localhost:27017/beautyqueen';
        }
    } else {
        console.log('Invalid choice. Exiting.');
        rl.close();
        process.exit(1);
    }
    
    console.log(`\n🔗 Connection String: ${mongoURI.replace(/:[^:@]+@/, ':****@')}`);
    
    const success = await testConnection(mongoURI);
    
    if (success) {
        console.log('\n✅ Connection successful!');
        console.log('\n📝 Add this to your .env file:');
        console.log(`MONGODB_URI=${mongoURI}`);
        console.log('\nOr set it as an environment variable:');
        console.log(`export MONGODB_URI="${mongoURI}"`);
    } else {
        console.log('\n❌ Connection failed. Please check:');
        console.log('1. MongoDB Atlas Network Access (allow 0.0.0.0/0)');
        console.log('2. Database user credentials');
        console.log('3. Connection string format');
    }
    
    rl.close();
    process.exit(success ? 0 : 1);
}

main().catch(err => {
    console.error('Error:', err);
    rl.close();
    process.exit(1);
});

