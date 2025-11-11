# Deploy from GitHub to Vercel

## Current Status
✅ All code is pushed to GitHub: https://github.com/raj6297bahu/Beauty-Queen-Landing
✅ Vercel project exists: beauty-queen-landing
✅ Production URL: https://beauty-queen-landing.vercel.app

## Connect GitHub Repository to Vercel (For Automatic Deployments)

### Step 1: Connect Repository via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: **beauty-queen-landing**
3. Go to **Settings** → **Git**
4. Click **Connect Git Repository**
5. Select **GitHub** and authorize Vercel to access your repositories
6. Select the repository: **raj6297bahu/Beauty-Queen-Landing**
7. Click **Connect**

### Step 2: Configure Deployment Settings

After connecting:
1. **Production Branch**: Set to `main` (should be automatic)
2. **Root Directory**: Leave as `.` (root)
3. **Build Command**: Leave empty (Vercel will auto-detect)
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install` (should be automatic)

### Step 3: Environment Variables

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

- **EMAIL_USER**: `snehabanerjee2701@gmail.com`
- **EMAIL_PASS**: `oqfv ndcb oovz fhti`

Set these for:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 4: Automatic Deployments

Once connected, every push to the `main` branch will automatically trigger a new deployment!

## Manual Deployment (If Needed)

If you need to manually trigger a deployment:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click **Redeploy** on the latest deployment

## Verify Deployment

After connecting GitHub:
1. Make a small change to any file
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Go to Vercel Dashboard → Deployments
4. You should see a new deployment automatically triggered!

## Troubleshooting

### If deployment fails:
1. Check Vercel Dashboard → Deployments → Click on failed deployment → View logs
2. Verify environment variables are set correctly
3. Check that `vercel.json` is in the root directory
4. Ensure `server.js` exports the Express app correctly

### If site is not accessible:
1. Check the production URL: https://beauty-queen-landing.vercel.app
2. Verify deployment status is "Ready" in Vercel Dashboard
3. Check browser console for any errors

## Current Configuration Files

- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `server.js` - Express app with serverless export
- ✅ `package.json` - Dependencies and scripts
- ✅ `.gitignore` - Excludes node_modules and .env files

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Ensure GitHub repository is properly connected
4. Check that all files are committed and pushed to GitHub

