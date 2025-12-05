# Troubleshooting MongoDB Atlas Connection Issues

## Common Error: `queryTxt ETIMEOUT`

This error means your computer cannot reach MongoDB Atlas. Here's how to fix it:

## ✅ Solution 1: Whitelist Your IP Address (MOST COMMON FIX)

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Log in to your account

2. **Navigate to Network Access**
   - Click on **"Network Access"** in the left sidebar
   - Or go directly to: https://cloud.mongodb.com/v2#/security/network/whitelist

3. **Add Your IP Address**
   - Click **"Add IP Address"** button
   - For development, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - Click **"Confirm"**
   - ⚠️ **Wait 1-2 minutes** for changes to take effect

4. **Verify the IP is Added**
   - You should see your IP address (or `0.0.0.0/0`) in the list
   - Status should be "Active"

## ✅ Solution 2: Verify Your Connection String

1. **Check your `.env` file** in the `backend` folder:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/db1?retryWrites=true&w=majority
   ```

2. **Make sure:**
   - Replace `username` with your Atlas database username
   - Replace `password` with your Atlas database password
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
   - Special characters in password must be URL-encoded (e.g., `@` becomes `%40`)

3. **Get a fresh connection string:**
   - Go to Atlas Dashboard → Your Cluster → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Add `/db1` before the `?` in the connection string

## ✅ Solution 3: Test Your Connection

Run the connection test script:

```bash
cd backend
npm run test:connection
```

This will help identify the exact issue.

## ✅ Solution 4: Check Firewall/Antivirus

- Some firewalls or antivirus software block MongoDB connections
- Try temporarily disabling them to test
- Add MongoDB to your firewall's allowed applications

## ✅ Solution 5: Verify Database User Credentials

1. **Go to Database Access** in Atlas
2. **Verify your database user exists**
3. **Check the user has proper permissions:**
   - Should have "Atlas admin" or "Read and write to any database"
4. **Reset password if needed:**
   - Click on the user → "Edit" → "Edit Password"

## ✅ Solution 6: Check Internet Connection

- Make sure you have a stable internet connection
- Try accessing https://cloud.mongodb.com/ in your browser
- If Atlas website doesn't load, it's a network issue

## Quick Diagnostic Steps

1. **Test connection:**
   ```bash
   npm run test:connection
   ```

2. **Check your .env file exists and has MONGO_URI:**
   ```bash
   # Windows PowerShell
   Get-Content .env
   
   # Or check if file exists
   Test-Path .env
   ```

3. **Verify connection string format:**
   - Should start with `mongodb+srv://`
   - Should include username and password
   - Should include cluster address
   - Should include `/db1` before `?`

## Still Having Issues?

1. **Check Atlas Status:**
   - Visit: https://status.mongodb.com/
   - Make sure there are no outages

2. **Try MongoDB Compass:**
   - Download: https://www.mongodb.com/try/download/compass
   - Try connecting with the same connection string
   - If Compass works but Node.js doesn't, it's a code issue
   - If Compass doesn't work, it's a network/Atlas configuration issue

3. **Check Node.js version:**
   ```bash
   node --version
   ```
   - Should be Node.js 14 or higher

4. **Verify all dependencies are installed:**
   ```bash
   npm install
   ```

## Example Working .env File

```env
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/db1?retryWrites=true&w=majority
MONGO_DB_NAME=db1
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
PORT=3000
CLIENT_URL=http://localhost:5173
```

## Need More Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Community Forums: https://developer.mongodb.com/community/forums/

