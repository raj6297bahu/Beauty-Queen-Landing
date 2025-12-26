# Beauty Queen - Complete E-commerce Platform

A full-stack beauty products e-commerce platform with authentication, shopping cart, payment gateway, and user management.

## Features

### 🎨 Frontend
- **Landing Page** - Beautiful, responsive landing page
- **Authentication** - Login and Signup with OTP verification
- **Dashboard** - User dashboard with order tracking
- **E-commerce Shop** - Product browsing with filters and search
- **Shopping Cart** - Add, update, and remove items
- **Checkout** - Secure checkout with payment gateway
- **Feedback Form** - User feedback system
- **User Guide** - Animated guide for using the app

### 🔧 Backend
- **RESTful API** - Complete API for all features
- **MongoDB Database** - User, Product, Order, and Feedback models
- **JWT Authentication** - Secure token-based authentication
- **OTP Verification** - Email-based OTP for signup
- **Payment Gateway** - Razorpay integration
- **Email Service** - Nodemailer for OTP and notifications

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay
- **Email**: Nodemailer (Gmail SMTP)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account with App Password

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd beauty-queen
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/beautyqueen
JWT_SECRET=your_secret_key_here
SESSION_SECRET=your_session_secret_here
EMAIL_USER=devdanmukherjeerajmukherjee@gmail.com
EMAIL_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. **Set up Gmail App Password**
   - Go to Google Account Settings
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Use that password in `EMAIL_PASS`

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

6. **Seed the database with sample products**
```bash
node scripts/seedProducts.js
```

7. **Start the server**
```bash
npm start
```

8. **Access the application**
   - Open `http://localhost:3000` in your browser

## Project Structure

```
beauty-queen/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── Order.js             # Order model
│   └── Feedback.js          # Feedback model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   ├── cart.js              # Cart routes
│   ├── orders.js            # Order routes
│   └── feedback.js          # Feedback routes
├── public/
│   ├── css/
│   │   └── common.css       # Shared styles
│   ├── js/
│   │   └── api.js           # API helper functions
│   ├── landing.html         # Landing page
│   ├── login.html           # Login page
│   ├── signup.html          # Signup page
│   ├── dashboard.html       # User dashboard
│   ├── shop.html            # E-commerce shop
│   ├── cart.html            # Shopping cart
│   ├── feedback.html        # Feedback form
│   └── guide.html           # User guide
├── scripts/
│   └── seedProducts.js      # Database seeder
├── server.js                # Main server file
├── package.json             # Dependencies
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders/create` - Create order
- `POST /api/orders/verify-payment` - Verify payment
- `GET /api/orders/my-orders` - Get user orders

### Feedback
- `POST /api/feedback/submit` - Submit feedback

## Usage Guide

1. **Sign Up**: Create account with email verification (OTP)
2. **Browse**: Explore products in the shop
3. **Add to Cart**: Select products and add to cart
4. **Checkout**: Proceed to checkout with payment
5. **Track Orders**: View orders in dashboard
6. **Give Feedback**: Share your experience

## Payment Gateway Setup

1. Create account at [Razorpay](https://razorpay.com)
2. Get your Key ID and Key Secret from dashboard
3. Add them to `.env` file
4. For testing, use Razorpay test keys

## Deployment

### For GitHub Deployment:

1. **Initialize Git**
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Create GitHub Repository**
   - Create new repo on GitHub
   - Push your code

3. **Deploy to Platform**
   - **Heroku**: Connect GitHub repo
   - **Render**: Connect GitHub repo
   - **Railway**: Connect GitHub repo

4. **Set Environment Variables**
   - Add all `.env` variables in platform settings
   - Update `MONGODB_URI` to MongoDB Atlas if needed

## Notes

- Email is configured to send from: `devdanmukherjeerajmukherjee@gmail.com`
- Make sure MongoDB is running before starting server
- Use environment variables for sensitive data
- Change JWT_SECRET in production

## License

MIT

## Author

Rajdeep Mukherjee
