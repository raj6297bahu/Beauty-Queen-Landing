const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',  // Allow all origins temporarily for testing
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.static(__dirname));

// Gmail configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'drajmukherjee@gmail.com',
        pass: process.env.SMTP_PASS || 'sxhe xzpa tdwp oesz'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Test email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Generate OTP
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);
    return otp;
}

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
    console.log('Received request to send OTP');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { email } = req.body;
    console.log('Email to send OTP:', email);
    
    if (!email) {
        console.log('No email provided');
        return res.status(400).json({ success: false, error: 'Email is required' });
    }

    try {
        const otp = generateOTP();

        const mailOptions = {
            from: {
                name: 'Beauty Queen',
                address: process.env.SMTP_USER || 'drajmukherjee@gmail.com'
            },
            to: email,
            subject: 'Your OTP for Beauty Queen Verification',
            text: `OTP verification for Beauty Queen is: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Your OTP for Beauty Queen Verification</h2>
                    <p>Hello,</p>
                    <p>OTP verification for Beauty Queen is:</p>
                    <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                    <p>Best regards,<br>Beauty Queen Team</p>
                </div>
            `
        };

        console.log('Attempting to send email...');
        console.log('Mail options:', mailOptions);
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        res.json({ success: true, otp: otp });
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send OTP',
            details: error.message 
        });
    }
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
    console.log('Received OTP verification request');
    console.log('Request body:', req.body);
    
    const { email, otp, originalOtp } = req.body;
    console.log('Verifying OTP for email:', email);
    console.log('Provided OTP:', otp);
    console.log('Original OTP:', originalOtp);
    
    if (otp === originalOtp) {
        console.log('OTP verified successfully');
        res.json({ success: true, message: 'OTP verified successfully' });
    } else {
        console.log('Invalid OTP provided');
        res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
}); 