# Complete Setup Guide for Beauty Queen

## Step-by-Step Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express, mongoose, bcryptjs, jsonwebtoken
- nodemailer, cors, dotenv
- razorpay, express-session, cookie-parser

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update MONGODB_URI in .env

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/beautyqueen
JWT_SECRET=your_random_secret_key_here
SESSION_SECRET=your_random_session_secret_here
EMAIL_USER=devdanmukherjeerajmukherjee@gmail.com
EMAIL_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Set Up Gmail for OTP

1. Go to your Google Account: https://myaccount.google.com
2. Enable **2-Step Verification**
3. Go to **App Passwords**: https://myaccount.google.com/apppasswords
4. Generate new App Password for "Mail"
5. Copy the 16-character password
6. Paste it in `.env` as `EMAIL_PASS`

### 5. Set Up Razorpay (Payment Gateway)

1. Go to https://razorpay.com
2. Sign up for an account
3. Go to Settings → API Keys
4. Generate Test Keys (for development)
5. Copy Key ID and Key Secret
6. Add to `.env` file

**Note**: For production, use Live Keys from Razorpay dashboard.

### 6. Seed the Database

Run the seeder script to add sample products:

```bash
node scripts/seedProducts.js
```

This will create 8 sample beauty products in your database.

### 7. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 8. Access the Application

Open your browser and navigate to:
- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Sign Up**: http://localhost:3000/signup
- **Shop**: http://localhost:3000/shop (requires login)
- **Dashboard**: http://localhost:3000/dashboard (requires login)

## Testing the Application

### 1. Create an Account
- Go to Sign Up page
- Enter your details
- Click "Send OTP"
- Check your email for OTP
- Enter OTP and complete signup

### 2. Browse Products
- Login to your account
- Go to Shop page
- Browse products
- Use filters and search

### 3. Add to Cart
- Click "Add to Cart" on any product
- Go to Cart page
- Update quantities
- Proceed to checkout

### 4. Place an Order
- Fill shipping details
- Choose payment method (COD or Online)
- Complete the order

### 5. View Dashboard
- Check your orders
- View cart count
- Access quick actions

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB port (default: 27017)

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS in .env
- Check Gmail App Password is correct
- Ensure 2-Step Verification is enabled

### Payment Gateway Not Working
- Verify Razorpay keys in .env
- Check if using test keys for development
- Ensure Razorpay script is loaded in cart.html

### Products Not Showing
- Run seed script: `node scripts/seedProducts.js`
- Check MongoDB connection
- Verify products collection exists

## Production Deployment

### For GitHub Deployment:

1. **Update .gitignore**
   - Make sure `.env` is in .gitignore
   - Never commit sensitive data

2. **Set Environment Variables on Platform**
   - Heroku: Settings → Config Vars
   - Render: Environment → Environment Variables
   - Railway: Variables tab

3. **Update MongoDB URI**
   - Use MongoDB Atlas connection string
   - Update in platform environment variables

4. **Update CORS Settings**
   - Allow your domain in server.js
   - Update CORS origin

5. **Use Production Keys**
   - Replace Razorpay test keys with live keys
   - Update JWT_SECRET with strong random string

## Features Checklist

✅ Email changed to devdanmukherjeerajmukherjee@gmail.com  
✅ Complete project structure  
✅ MongoDB database with models  
✅ New landing page  
✅ Authentication (Login/Signup/Logout)  
✅ Dashboard  
✅ E-commerce shop  
✅ Shopping cart  
✅ Payment gateway (Razorpay)  
✅ Feedback form  
✅ User guide with animations  
✅ API endpoints  
✅ Responsive design  

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check network connectivity for API calls

Happy Coding! 🎉

