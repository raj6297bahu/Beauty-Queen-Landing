const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Get cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        res.json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const user = await User.findById(req.user._id);

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const existingItem = user.cart.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        await user.populate('cart.product');
        res.json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update cart item
router.put('/update/:itemId', authMiddleware, async (req, res) => {
    try {
        const { quantity } = req.body;
        const user = await User.findById(req.user._id);
        const item = user.cart.id(req.params.itemId);
        
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        item.quantity = quantity;
        await user.save();
        await user.populate('cart.product');
        res.json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Remove from cart
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart.pull(req.params.itemId);
        await user.save();
        await user.populate('cart.product');
        res.json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

