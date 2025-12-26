require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const products = [
    {
        name: "Hydrating Face Serum",
        description: "Deeply hydrating serum with hyaluronic acid for glowing skin",
        price: 1299,
        originalPrice: 1799,
        category: "Skincare",
        stock: 50,
        rating: 4.5,
        featured: true
    },
    {
        name: "Matte Lipstick - Rosewood",
        description: "Long-lasting matte lipstick in beautiful rosewood shade",
        price: 599,
        originalPrice: 799,
        category: "Makeup",
        stock: 30,
        rating: 4.3,
        featured: true
    },
    {
        name: "Nourishing Hair Oil",
        description: "Natural hair oil for strong and shiny hair",
        price: 899,
        originalPrice: 1199,
        category: "Haircare",
        stock: 40,
        rating: 4.7,
        featured: true
    },
    {
        name: "Floral Perfume - Spring",
        description: "Fresh floral fragrance perfect for everyday wear",
        price: 1999,
        originalPrice: 2499,
        category: "Fragrance",
        stock: 25,
        rating: 4.6,
        featured: false
    },
    {
        name: "Makeup Brush Set",
        description: "Professional 12-piece makeup brush set",
        price: 1499,
        originalPrice: 1999,
        category: "Accessories",
        stock: 20,
        rating: 4.4,
        featured: false
    },
    {
        name: "Vitamin C Face Cream",
        description: "Brightening face cream with vitamin C",
        price: 1599,
        originalPrice: 2099,
        category: "Skincare",
        stock: 35,
        rating: 4.8,
        featured: true
    },
    {
        name: "Eyeshadow Palette - Nudes",
        description: "12-shade nude eyeshadow palette",
        price: 1299,
        originalPrice: 1699,
        category: "Makeup",
        stock: 28,
        rating: 4.5,
        featured: false
    },
    {
        name: "Anti-Dandruff Shampoo",
        description: "Effective anti-dandruff shampoo for healthy scalp",
        price: 699,
        originalPrice: 899,
        category: "Haircare",
        stock: 45,
        rating: 4.2,
        featured: false
    }
];

async function seedProducts() {
    try {
        await connectDB();
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();

