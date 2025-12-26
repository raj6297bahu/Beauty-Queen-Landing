const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
});

// Create order
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const user = await User.findById(req.user._id).populate('cart.product');

        if (user.cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const items = user.cart.map(item => {
            const price = item.product.price;
            totalAmount += price * item.quantity;
            return {
                product: item.product._id,
                quantity: item.quantity,
                price: price
            };
        });

        const order = new Order({
            user: user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD'
        });

        await order.save();

        // If online payment, create Razorpay order
        if (paymentMethod === 'Razorpay') {
            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100, // Convert to paise
                currency: 'INR',
                receipt: `order_${order._id}`
            });

            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            return res.json({
                success: true,
                order,
                razorpayOrderId: razorpayOrder.id,
                razorpayKeyId: razorpay.key_id
            });
        }

        // Clear cart after order
        user.cart = [];
        await user.save();

        res.json({ success: true, order });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Verify payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        
        // In production, verify signature
        const order = await Order.findOne({ razorpayOrderId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpayPaymentId;
        await order.save();

        // Clear cart
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user orders
router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

