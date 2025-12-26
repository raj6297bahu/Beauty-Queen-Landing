# Fix Database Connection Error on Render

## Common Issues & Solutions

### Issue 1: MongoDB Atlas Network Access

**Problem**: MongoDB Atlas blocks connections from unknown IPs.

**Solution**:
1. Go to **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
2. Click on your cluster
3. Go to **"Network Access"** (left sidebar)
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Click **"Confirm"**
7. Wait 2-3 minutes for changes to apply

### Issue 2: Environment Variable Format

**Problem**: MONGODB_URI not set correctly in Render.

**Solution**:
1. Go to your Render dashboard
2. Click on your service
3. Go to **"Environment"** tab
4. Check `MONGODB_URI` value
5. It should look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/beautyqueen?retryWrites=true&w=majority
   ```
6. Make sure:
   - Username and password are correct
   - Database name is included (`/beautyqueen`)
   - No extra spaces
   - Password is URL-encoded (if it has special characters)

### Issue 3: Connection String Issues

**Fix the connection string format**:

Your connection string should be:
```
mongodb+srv://devdanmukherjeerajmukherjee_db_user:YOUR_PASSWORD@cluster0.5dmyz9v.mongodb.net/beautyqueen?retryWrites=true&w=majority
```

**Important**:
- Replace `YOUR_PASSWORD` with actual password
- Include `/beautyqueen` before the `?`
- If password has special characters, URL encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - etc.

### Issue 4: Database User Permissions

**Problem**: Database user doesn't have proper permissions.

**Solution**:
1. Go to MongoDB Atlas → **Database Access**
2. Find your user (`devdanmukherjeerajmukherjee_db_user`)
3. Click **"Edit"**
4. Make sure **"Atlas admin"** or **"Read and write to any database"** is selected
5. Click **"Update User"**

### Issue 5: Environment Variables Not Loading

**Problem**: dotenv not loading in production.

**Solution**: Update server.js to handle production environment:

```javascript
// At the top of server.js
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
```

## Quick Fix Steps

1. **Check MongoDB Atlas Network Access**:
   - Allow 0.0.0.0/0 (all IPs)

2. **Verify Environment Variables in Render**:
   - Go to Render Dashboard → Your Service → Environment
   - Check `MONGODB_URI` is set correctly
   - Format: `mongodb+srv://user:pass@cluster.net/beautyqueen?retryWrites=true&w=majority`

3. **Test Connection String**:
   - Copy your MONGODB_URI from Render
   - Test it locally in your `.env` file
   - If it works locally, it should work on Render

4. **Check Render Logs**:
   - Go to Render Dashboard → Your Service → Logs
   - Look for specific error messages
   - Common errors:
     - "authentication failed" → Wrong password
     - "connection timeout" → Network access issue
     - "bad auth" → User permissions issue

## Updated Database Config

Make sure your `config/database.js` handles errors properly:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error.message);
        console.error('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
        process.exit(1);
    }
};

module.exports = connectDB;
```

## Still Not Working?

1. **Check Render Logs** for exact error message
2. **Verify MongoDB Atlas**:
   - Network Access allows 0.0.0.0/0
   - Database user has proper permissions
   - Connection string is correct
3. **Test locally** with the same connection string
4. **Redeploy** on Render after fixing issues

