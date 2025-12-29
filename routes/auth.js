const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'beautyqueen_secret_key_2024';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Email transporter with optimized settings for production
const getTransporter = () => {
    const emailUser = process.env.EMAIL_USER || 'devdanmukherjeerajmukherjee@gmail.com';
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailPass) {
        console.warn('⚠️  EMAIL_PASS not set. Email functionality will not work.');
        console.warn('   Please set EMAIL_PASS in your .env file with Gmail App Password');
    }
    
    return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        pool: true,
        maxConnections: 1,
        maxMessages: 3
    });
};

const transporter = getTransporter();

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP with timeout and better error handling
router.post('/send-otp', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { email, type = 'signup' } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: 'Invalid email format' });
        }

        // Check if EMAIL_PASS is configured
        if (!process.env.EMAIL_PASS) {
            return res.status(500).json({ 
                success: false, 
                error: 'Email service not configured. Please contact administrator.',
                details: 'EMAIL_PASS not set in environment variables'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        console.log(`[OTP] Generating OTP for ${email} (type: ${type}) at ${new Date().toISOString()}`);
        
        // Invalidate any existing OTPs for this email and type
        await OTP.updateMany(
            { email: email.toLowerCase(), type, used: false },
            { used: true }
        );

        // Store OTP in database
        const otpRecord = new OTP({
            email: email.toLowerCase(),
            otp,
            type,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        });
        await otpRecord.save();

        // Prepare email content based on type
        const emailSubject = type === 'forgot-password' 
            ? 'Password Reset OTP - Beauty Queen'
            : 'Your OTP for Beauty Queen Verification';
        
        const emailContent = type === 'forgot-password'
            ? `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password for your Beauty Queen account.</p>
                    <p>Your OTP verification code is:</p>
                    <h1 style="color: #e91e63; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <p>Best regards,<br>Beauty Queen Team</p>
                </div>
            `
            : `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Your OTP for Beauty Queen Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP verification code for Beauty Queen is:</p>
                    <h1 style="color: #e91e63; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                    <p>Best regards,<br>Beauty Queen Team</p>
                </div>
            `;
        
        const mailOptions = {
            from: {
                name: 'Beauty Queen',
                address: process.env.EMAIL_USER || 'devdanmukherjeerajmukherjee@gmail.com'
            },
            to: email,
            subject: emailSubject,
            html: emailContent
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
            message: 'OTP sent successfully to your email',
            duration: duration
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[OTP] Error after ${duration}ms:`, error.message);
        
        // More specific error messages
        let errorMessage = 'Failed to send OTP';
        if (error.message.includes('timeout')) {
            errorMessage = 'Email service timeout. Please try again.';
        } else if (error.message.includes('authentication') || error.message.includes('Invalid login')) {
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

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, type = 'signup' } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        // Find valid OTP
        const otpRecord = await OTP.findOne({
            email: email.toLowerCase(),
            otp,
            type,
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Mark OTP as used
        otpRecord.used = true;
        await otpRecord.save();

        res.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, otp } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (!otp) {
            return res.status(400).json({ success: false, message: 'OTP is required' });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({
            email: email.toLowerCase(),
            otp,
            type: 'signup',
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = new User({ name, email: email.toLowerCase(), password, phone });
        await user.save();

        // Mark OTP as used
        otpRecord.used = true;
        await otpRecord.save();

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

// Forgot Password - Request OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if user exists for security
            return res.json({ 
                success: true, 
                message: 'If an account exists with this email, an OTP has been sent' 
            });
        }

        // Check if EMAIL_PASS is configured
        if (!process.env.EMAIL_PASS) {
            return res.status(500).json({ 
                success: false, 
                message: 'Email service not configured. Please contact administrator.' 
            });
        }

        // Generate and send OTP
        const otp = generateOTP();
        
        // Invalidate any existing password reset OTPs
        await OTP.updateMany(
            { email: email.toLowerCase(), type: 'forgot-password', used: false },
            { used: true }
        );

        // Store OTP in database
        const otpRecord = new OTP({
            email: email.toLowerCase(),
            otp,
            type: 'forgot-password',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        });
        await otpRecord.save();

        // Send email
        const mailOptions = {
            from: {
                name: 'Beauty Queen',
                address: process.env.EMAIL_USER || 'devdanmukherjeerajmukherjee@gmail.com'
            },
            to: email,
            subject: 'Password Reset OTP - Beauty Queen',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password for your Beauty Queen account.</p>
                    <p>Your OTP verification code is:</p>
                    <h1 style="color: #e91e63; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <p>Best regards,<br>Beauty Queen Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'If an account exists with this email, an OTP has been sent' 
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Failed to send reset OTP' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({
            email: email.toLowerCase(),
            otp,
            type: 'forgot-password',
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Mark OTP as used
        otpRecord.used = true;
        await otpRecord.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
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

