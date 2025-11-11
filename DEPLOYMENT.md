# Deployment Guide for Beauty Queen

## Prerequisites
- Node.js installed
- Vercel account (free tier works)

## Quick Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   npx vercel login
   ```
   Follow the prompts to authenticate in your browser.

3. **Deploy to Production**:
   ```bash
   npx vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository or drag and drop the project folder
4. Configure environment variables (see below)
5. Click "Deploy"

## Environment Variables

After deployment, set these environment variables in Vercel Dashboard:

1. Go to your project settings → Environment Variables
2. Add the following:
   - `EMAIL_USER`: Your Gmail address (e.g., `snehabanerjee2701@gmail.com`)
   - `EMAIL_PASS`: Your Gmail app password (e.g., `oqfv ndcb oovz fhti`)

**Note**: Make sure to use a Gmail App Password, not your regular password. You can generate one at: https://myaccount.google.com/apppasswords

## Testing Locally

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Set environment variables (optional, uses fallback values)
export EMAIL_USER=your-email@gmail.com
export EMAIL_PASS=your-app-password

# Start server
npm start

# Open http://localhost:3000 in your browser
```

## Post-Deployment

After deployment:
1. Your site will be available at a URL like: `https://your-project-name.vercel.app`
2. Test the OTP functionality
3. If email sending fails, verify environment variables are set correctly

## Troubleshooting

- **Email not sending**: Check environment variables in Vercel dashboard
- **CORS errors**: Already configured in server.js
- **Server timeout**: Vercel has a 10-second timeout for free tier, but OTP sending should complete faster

