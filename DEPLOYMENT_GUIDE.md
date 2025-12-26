# Deployment Guide - Beauty Queen

Your code is now on GitHub: `https://github.com/raj6297bahu/Beauty-Queen-Landing`

## 🚀 Deployment Options

### Option 1: Render (Recommended - Free & Easy)

**Steps:**

1. **Go to Render**: https://render.com
2. **Sign up/Login** with your GitHub account
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository**:
   - Select `raj6297bahu/Beauty-Queen-Landing`
   - Click "Connect"
5. **Configure the service**:
   - **Name**: `beauty-queen` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_random_secret_key
   SESSION_SECRET=your_random_session_secret
   EMAIL_USER=drajmukherjee@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RAZORPAY_KEY_ID=your_razorpay_key (optional)
   RAZORPAY_KEY_SECRET=your_razorpay_secret (optional)
   ```
7. **Click "Create Web Service"**
8. **Wait for deployment** (5-10 minutes)
9. **Get your live URL**: `https://beauty-queen.onrender.com` (or your custom name)

**Your website will be live at**: `https://your-app-name.onrender.com`

---

### Option 2: Railway (Also Free & Easy)

**Steps:**

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select** `raj6297bahu/Beauty-Queen-Landing`
5. **Add Environment Variables** (Click on your service → Variables):
   - Add all the same variables as Render
6. **Deploy automatically starts**
7. **Get your live URL**: Railway provides a URL like `https://your-app.up.railway.app`

---

### Option 3: Vercel (If you want to try)

**Steps:**

1. **Go to Vercel**: https://vercel.com
2. **Import your GitHub repository**
3. **Configure**:
   - Framework Preset: Other
   - Build Command: Leave empty
   - Output Directory: Leave empty
   - Install Command: `npm install`
4. **Add Environment Variables**
5. **Deploy**

---

## 📋 Environment Variables Needed

Copy these from your `.env` file and add them to your deployment platform:

```
PORT=3000
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret
EMAIL_USER=drajmukherjee@gmail.com
EMAIL_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=your_key (optional)
RAZORPAY_KEY_SECRET=your_secret (optional)
```

## 🔧 Important Notes

1. **MongoDB Atlas**: Make sure your MongoDB Atlas connection string allows connections from anywhere (0.0.0.0/0) in Network Access
2. **Gmail App Password**: Make sure you have the correct App Password for drajmukherjee@gmail.com
3. **CORS**: The server is configured to accept requests from any origin
4. **Database**: Run the seeder script after deployment if needed, or products are already seeded

## ✅ After Deployment

1. **Test your website**: Visit your live URL
2. **Check all pages**: Landing, Shop, Cart, Checkout
3. **Test signup**: Create an account with OTP
4. **Test checkout**: Place a test order

## 🎉 Your Live Website

Once deployed, you'll get a URL like:
- Render: `https://beauty-queen.onrender.com`
- Railway: `https://your-app.up.railway.app`
- Vercel: `https://your-app.vercel.app`

**Share this URL with anyone to access your website!**

---

## 🆘 Troubleshooting

**If deployment fails:**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check build logs for errors
- Make sure PORT is set correctly

**If website doesn't load:**
- Wait a few minutes (first deployment takes time)
- Check if service is running in dashboard
- Verify all environment variables

**Need help?** Check the deployment platform's documentation or logs.

