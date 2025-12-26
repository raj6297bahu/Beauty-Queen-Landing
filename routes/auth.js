const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'beautyqueen_secret_key_2024';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Email transporter with optimized settings for production
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'drajmukherjee@gmail.com',
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    pool: true, // Keep connection pool
    maxConnections: 1,
    maxMessages: 3
});

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP with timeout and better error handling
router.post('/send-otp', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: 'Invalid email format' });
        }

        const otp = generateOTP();
        console.log(`[OTP] Generating OTP for ${email} at ${new Date().toISOString()}`);
        
        const mailOptions = {
            from: {
                name: 'Beauty Queen',
                address: process.env.EMAIL_USER || 'drajmukherjee@gmail.com'
            },
            to: email,
            subject: 'Your OTP for Beauty Queen Verification',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Your OTP for Beauty Queen Verification</h2>
                    <p>Hello,</p>
                    <p>OTP verification for Beauty Queen is:</p>
                    <h1 style="color: #e91e63; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                    <p>Best regards,<br>Beauty Queen Team</p>
                </div>
            `
        };

        // Send email with timeout
        const sendEmailPromise = transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email sending timeout after 15 seconds')), 15000)
        );

        const info = await Promise.race([sendEmailPromise, timeoutPromise]);
        
        const duration = Date.now() - startTime;
        console.log(`[OTP] Email sent successfully in ${duration}ms. MessageId: ${info.messageId || 'N/A'}`);
        
        res.json({ 
            success: true, 
            otp: otp,
            message: 'OTP sent successfully',
            duration: duration
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[OTP] Error after ${duration}ms:`, error.message);
        
        // More specific error messages
        let errorMessage = 'Failed to send OTP';
        if (error.message.includes('timeout')) {
            errorMessage = 'Email service timeout. Please try again.';
        } else if (error.message.includes('authentication')) {
            errorMessage = 'Email authentication failed. Please check email configuration.';
        } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
            errorMessage = 'Cannot connect to email server. Please try again later.';
        }
        
        res.status(500).json({ 
            success: false, 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, otp, originalOtp } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (otp !== originalOtp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = new User({ name, email, password, phone });
        await user.save();

        const token = generateToken(user._id);
        res.json({
            success: true,
            message: 'User created successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

module.exports = router;

