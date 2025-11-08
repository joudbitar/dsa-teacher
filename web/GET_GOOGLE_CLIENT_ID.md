# How to Get Google Client ID and Client Secret

## What are Client ID and Client Secret?

These are credentials from Google that allow your app to use Google login. Think of them like a username and password that Google gives your app to prove it's legitimate.

## Step-by-Step Guide

### Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Sign in with your Google account

### Step 2: Create a New Project (or Select Existing)

1. At the top, click the project dropdown (it might say "Select a project" or show a project name)
2. Click **"New Project"**
3. Enter project name: **"DSA Lab"** (or any name you like)
4. Click **"Create"**
5. Wait a few seconds, then select this new project from the dropdown

### Step 3: Configure OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have Google Workspace)
3. Click **"Create"**

4. Fill in the form:
   - **App name:** `DSA Lab`
   - **User support email:** Your email address
   - **Developer contact information:** Your email address
   - Click **"Save and Continue"**

5. **Scopes** (Step 2):
   - Click **"Add or Remove Scopes"**
   - Check these boxes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click **"Update"**
   - Click **"Save and Continue"**

6. **Test users** (Step 3):
   - If you see "Test users", click **"Add Users"**
   - Add your email address
   - Click **"Add"**
   - Click **"Save and Continue"**

7. **Summary** (Step 4):
   - Click **"Back to Dashboard"**

### Step 4: Create OAuth Credentials

1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**
2. At the top, click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth client ID"**

4. If you see "Configure consent screen", click it and complete Step 3 above first, then come back here.

5. Fill in the form:
   - **Application type:** Select **"Web application"**
   - **Name:** `DSA Lab Web Client` (or any name)

6. **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Enter: `http://localhost:5173`
   - Click **"+ ADD URI"** again
   - Enter: `http://localhost:3000` (if you use a different port, use that)

7. **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Enter: `https://mwlhxwbkuumjxpnvldli.supabase.co/auth/v1/callback`
   - ⚠️ **IMPORTANT:** Copy this EXACTLY - no extra spaces or characters!

8. Click **"Create"**

9. **A popup will appear with your credentials:**
   - **Client ID:** A long string that looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **Client Secret:** A long string that looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   
   ⚠️ **COPY THESE NOW!** You won't be able to see the Client Secret again after closing this popup.

### Step 5: Add to Supabase

1. Go to: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli
2. Click **"Authentication"** in the left sidebar
3. Click **"Providers"**
4. Find **"Google"** and click on it
5. Toggle **"Enable Google provider"** to **ON** (green)
6. Paste your **Client ID** in the "Client ID" field
7. Paste your **Client Secret** in the "Client Secret" field
8. Click **"Save"**

### Step 6: Test It!

1. Go back to your app
2. Click "Continue with Google"
3. You should be redirected to Google's login page
4. After selecting your account, you'll be redirected back to your app

## 🎉 Done!

Google login should now work!

## 🐛 Troubleshooting

**"Invalid client" error?**
- Make sure you copied the Client ID and Client Secret correctly (no extra spaces)
- Make sure the redirect URI in Google Cloud Console is exactly: `https://mwlhxwbkuumjxpnvldli.supabase.co/auth/v1/callback`

**"Redirect URI mismatch" error?**
- Go back to Google Cloud Console → Credentials → Your OAuth client
- Make sure the redirect URI is exactly: `https://mwlhxwbkuumjxpnvldli.supabase.co/auth/v1/callback`
- No trailing slashes, no extra characters

**Can't find Client Secret?**
- If you closed the popup, you'll need to create new credentials
- Go to Google Cloud Console → Credentials → Your OAuth client
- You can see the Client ID, but not the Secret
- Click the edit icon (pencil) to regenerate or create new credentials

## Quick Reference

- **Client ID:** Public identifier for your app (safe to share)
- **Client Secret:** Private key (keep it secret, only use in Supabase)
- **Redirect URI:** Where Google sends users after they log in

