# ✅ Verify MongoDB Atlas Network Access

## Quick Verification Steps

Please verify the following in MongoDB Atlas:

### 1. Check Network Access Status

1. Go to: https://cloud.mongodb.com
2. Click on **cluster0.5dmyz9v**
3. Click **"Network Access"** in the left sidebar
4. Check if you see **0.0.0.0/0** in the IP Access List
5. Status should be **"Active"** (green checkmark)

**If 0.0.0.0/0 is NOT there:**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"**
- Click **"Confirm"**
- Wait 2-3 minutes

### 2. Check Database User

1. Go to **"Database Access"** in the left sidebar
2. Find user: **devdanmukherjeerajmukherjee_db_user**
3. Verify:
   - ✅ User exists
   - ✅ Status is "Active"
   - ✅ Has "Read and write to any database" permission (or "Atlas admin")

### 3. Test Connection Manually

Try this command in your terminal:

```bash
node test-mongodb.js "mongodb+srv://devdanmukherjeerajmukherjee_db_user:8BnFGaWG2cURlwNt@cluster0.5dmyz9v.mongodb.net/beautyqueen?retryWrites=true&w=majority"
```

**Expected result:** ✅ MongoDB Connected Successfully!

## Common Issues

### Issue 1: Network Access Not Active Yet
**Solution:** Wait 2-5 minutes after adding IP address. Changes can take time to propagate.

### Issue 2: Wrong IP Address Added
**Solution:** Make sure you added **0.0.0.0/0** (Allow Access from Anywhere), not a specific IP.

### Issue 3: User Doesn't Have Permissions
**Solution:** 
- Go to Database Access
- Edit the user
- Select "Read and write to any database"
- Save changes

### Issue 4: Connection String Format
**Verify your connection string has:**
- ✅ Username and password
- ✅ `/beautyqueen` before the `?`
- ✅ `?retryWrites=true&w=majority` at the end

## After Verification

Once network access is confirmed and connection test passes:

1. **Start the server:**
   ```bash
   ./start-with-mongodb.sh
   ```

2. **Or manually:**
   ```bash
   export MONGODB_URI="mongodb+srv://devdanmukherjeerajmukherjee_db_user:8BnFGaWG2cURlwNt@cluster0.5dmyz9v.mongodb.net/beautyqueen?retryWrites=true&w=majority"
   npm start
   ```

3. **Check health:**
   ```bash
   curl http://localhost:3000/health
   ```

   Should show: `"database": "connected"`

## Still Not Working?

If after 5 minutes it still doesn't work:

1. **Double-check Network Access:**
   - Make sure 0.0.0.0/0 is listed and Active
   - Try removing and re-adding it

2. **Check MongoDB Atlas Status:**
   - Go to MongoDB Atlas dashboard
   - Check if cluster is running (not paused)
   - Look for any alerts or warnings

3. **Try from MongoDB Atlas:**
   - Click "Connect" on your cluster
   - Choose "Connect with MongoDB Shell"
   - If that works, the connection string should work too

4. **Contact Support:**
   - MongoDB Atlas has 24/7 support
   - Check their status page for outages

