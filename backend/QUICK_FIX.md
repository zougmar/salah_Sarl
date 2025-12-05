# Quick Fix for Connection Timeout

## Your Error: `queryTxt ETIMEOUT`

This means your computer **cannot reach** MongoDB Atlas. Here's the fastest fix:

## 🚀 3-Minute Fix

### Step 1: Whitelist Your IP (2 minutes)

1. **Open MongoDB Atlas:**
   - Go to: https://cloud.mongodb.com/
   - Log in with your account

2. **Add IP Address:**
   - Click **"Network Access"** in the left menu (or go to: https://cloud.mongodb.com/v2#/security/network/whitelist)
   - Click the green **"Add IP Address"** button
   - Click **"ALLOW ACCESS FROM ANYWHERE"** 
   - This adds `0.0.0.0/0` (allows all IPs)
   - Click **"Confirm"**

3. **Wait 2-3 minutes** ⏳
   - Changes take a few minutes to propagate
   - You'll see a green checkmark when it's active

### Step 2: Check Cluster Status (30 seconds)

1. **Go to your cluster:**
   - Click **"Database"** in the left menu
   - Check if your cluster shows "Paused" or "Resume"
   - If paused, click **"Resume"** and wait for it to start

### Step 3: Test Connection (30 seconds)

```bash
npm run test:connection
```

If it works, you'll see:
```
✅ Connection successful!
✅ Connected to database: db1
```

Then run the seeder:
```bash
npm run seed
```

## ✅ Still Not Working?

### Check Your Connection String

Your `.env` file should look like this:

```env
MONGO_URI=mongodb+srv://omar:YOUR_PASSWORD@omar.qtrul2y.mongodb.net/db1?retryWrites=true&w=majority
```

**Important:**
- Replace `YOUR_PASSWORD` with your actual Atlas database password
- If your password has special characters, they must be URL-encoded:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

### Verify Database User

1. Go to Atlas → **"Database Access"**
2. Find your user (should be `omar`)
3. Click **"Edit"** → Check password is correct
4. Make sure user has **"Atlas admin"** or **"Read and write to any database"** role

### Test with MongoDB Compass

1. Download: https://www.mongodb.com/try/download/compass
2. Use the same connection string
3. If Compass works → it's a code issue
4. If Compass doesn't work → it's an Atlas configuration issue

## 🎯 Most Common Issue

**99% of the time, it's the IP whitelist!**

Make sure you:
1. ✅ Added IP address in Network Access
2. ✅ Waited 2-3 minutes after adding
3. ✅ See the IP address as "Active" in the list

## Need Help?

If you've done all the above and it still doesn't work:
1. Check: https://status.mongodb.com/ (make sure Atlas is up)
2. Try from a different network (mobile hotspot)
3. Check your firewall/antivirus settings

