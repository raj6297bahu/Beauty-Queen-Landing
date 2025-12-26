const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            console.error('MONGODB_URI is not set in environment variables');
            process.exit(1);
        }

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`✅ Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        console.error('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (check format)' : 'NOT SET');
        
        if (error.message.includes('authentication failed')) {
            console.error('💡 Fix: Check your MongoDB username and password');
        } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
            console.error('💡 Fix: Check MongoDB Atlas Network Access - allow 0.0.0.0/0');
        } else if (error.message.includes('bad auth')) {
            console.error('💡 Fix: Check database user permissions in MongoDB Atlas');
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;

