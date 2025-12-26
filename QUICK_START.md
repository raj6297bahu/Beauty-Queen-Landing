# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env File
Copy `.env.example` to `.env` and fill in your values:
```bash
# On Mac/Linux
cp .env.example .env

# On Windows
copy .env.example .env
```

### 3. Start MongoDB
```bash
# If MongoDB is installed locally
mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

### 4. Seed Products
```bash
node scripts/seedProducts.js
```

### 5. Start Server
```bash
npm start
```

### 6. Open Browser
Navigate to: **http://localhost:3000**

## 📋 What You Need

1. **Node.js** (v14+) - [Download](https://nodejs.org)
2. **MongoDB** - Local or Atlas account
3. **Gmail Account** - For OTP emails
4. **Razorpay Account** - For payments (optional for testing)

## 🎯 First Steps After Starting

1. **Sign Up** - Create an account at `/signup`
2. **Verify Email** - Check email for OTP
3. **Browse Shop** - Go to `/shop` to see products
4. **Add to Cart** - Add products to cart
5. **Checkout** - Complete an order

## ⚙️ Important Configuration

### Gmail Setup
- Enable 2-Step Verification
- Generate App Password
- Add to `.env` as `EMAIL_PASS`

### Razorpay Setup (Optional)
- Sign up at razorpay.com
- Get test keys from dashboard
- Add to `.env` file

## 📁 Project Structure

```
beauty-queen/
├── public/          # Frontend pages
├── routes/         # API routes
├── models/         # Database models
├── config/         # Configuration
├── middleware/     # Auth middleware
└── scripts/        # Utility scripts
```

## 🆘 Need Help?

Check `SETUP_GUIDE.md` for detailed instructions.

