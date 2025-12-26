const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/auth');

// Submit feedback
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message, rating } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const feedback = new Feedback({
            user: req.user?._id,
            name,
            email,
            subject,
            message,
            rating
        });

        await feedback.save();
        res.json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get feedbacks (admin only - can be added later)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json({ success: true, feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

