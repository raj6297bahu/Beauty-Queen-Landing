# 🔌 How to Connect MongoDB

## Quick Setup Guide

Since MongoDB is not installed locally, you have two options:

### Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**Step 1: Get Your MongoDB Atlas Connection String**

1. Go to **MongoDB Atlas**: https://cloud.mongodb.com
2. Sign in to your account
3. Click on your cluster (or create a new one)
4. Click **"Connect"** button
5. Choose **"Connect your application"**
6. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**Step 2: Update the Connection String**

Replace `<password>` with your actual MongoDB password, and add `/beautyqueen` before the `?`:

```
mongodb+srv://username:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/beautyqueen?retryWrites=true&w=majority
```

**Step 3: Test the Connection**

Run this command to test your connection:

```bash
node test-mongodb.js "mongodb+srv://username:password@cluster.net/beautyqueen?retryWrites=true&w=majority"
```

**Step 4: Set Environment Variable**

Create a `.env` file in the project root (or update existing one):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.net/beautyqueen?retryWrites=true&w=majority
```

Or export it in your terminal:

```bash
export MONGODB_URI="mongodb+srv://username:password@cluster.net/beautyqueen?retryWrites=true&w=majority"
```

**Step 5: Restart the Server**

The server will automatically connect to MongoDB when you restart it.

---

### Option 2: Install Local MongoDB

**For macOS (using Homebrew):**

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Test connection
mongosh
```

**For other platforms:**
- Visit: https://www.mongodb.com/try/download/community
- Follow installation instructions for your OS

**After installation, the default connection string is:**
```
mongodb://localhost:27017/beautyqueen
```

---

## 🔧 Using Your Existing MongoDB Atlas Cluster

Based on your project files, you might already have a MongoDB Atlas cluster:

**Cluster:** `cluster0.5dmyz9v.mongodb.net`  
**Username:** `devdanmukherjeerajmukherjee_db_user`

**To connect:**

1. Get your password from MongoDB Atlas (Database Access section)
2. Run the test script:
   ```bash
   node test-mongodb.js "mongodb+srv://devdanmukherjeerajmukherjee_db_user:YOUR_PASSWORD@cluster0.5dmyz9v.mongodb.net/beautyqueen?retryWrites=true&w=majority"
   ```

---

## ⚠️ Important: MongoDB Atlas Network Access

Before connecting, make sure MongoDB Atlas allows connections from your IP:

1. Go to **MongoDB Atlas Dashboard**
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**
6. Wait 2-3 minutes for changes to apply

---

## ✅ Verify Connection

After setting up, check if MongoDB is connected:

```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "ok",
  "database": "connected"  // ✅ This should say "connected"
}
```

---

## 🚀 Quick Start Commands

**Test MongoDB connection:**
```bash
node test-mongodb.js "your_connection_string"
```

**Start server with MongoDB:**
```bash
export MONGODB_URI="your_connection_string"
npm start
```

**Or use the startup script:**
```bash
MONGODB_URI="your_connection_string" ./start-local.sh
```

---

## 🆘 Troubleshooting

**"authentication failed"**
- Check your username and password
- Verify password doesn't have special characters that need URL encoding

**"connection timeout"**
- Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- Wait 2-3 minutes after changing network settings

**"bad auth"**
- Check user permissions in MongoDB Atlas → Database Access
- Ensure user has "Read and write to any database" permission

**"ENOTFOUND"**
- Verify your cluster URL is correct
- Check if cluster is running in MongoDB Atlas

---

## 📝 Next Steps

Once MongoDB is connected:

1. **Seed the database** with sample products:
   ```bash
   node scripts/seedProducts.js
   ```

2. **Access your application:**
   - Landing: http://localhost:3000
   - Shop: http://localhost:3000/shop
   - Dashboard: http://localhost:3000/dashboard

3. **Create an account** and start using the app!

