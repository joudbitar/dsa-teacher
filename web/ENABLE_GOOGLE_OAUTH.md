# Quick Guide: Enable Google OAuth in Supabase

## 🚀 Quick Steps

### Step 1: Enable Google Provider in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli
2. Click on **Authentication** in the left sidebar
3. Click on **Providers**
4. Find **Google** in the list and click on it
5. Toggle **Enable Google provider** to **ON** (green)

### Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a new project** (or select existing):
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it "DSA Lab" (or any name)
   - Click "Create"

3. **Enable Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" or "People API"
   - Click on it and click **Enable**

4. **Configure OAuth Consent Screen**:
   - Go to **APIs & Services** → **OAuth consent screen**
   - Select **External** (unless you have Google Workspace)
   - Click **Create**
   - Fill in:
     - **App name:** DSA Lab
     - **User support email:** Your email
     - **Developer contact:** Your email
   - Click **Save and Continue**
   - **Scopes:** Click "Add or Remove Scopes"
     - Select: `.../auth/userinfo.email` and `.../auth/userinfo.profile`
     - Click **Update** → **Save and Continue**
   - **Test users:** Add your email (if in testing mode)
   - Click **Save and Continue** → **Back to Dashboard**

5. **Create OAuth Client ID**:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - **Application type:** Web application
   - **Name:** DSA Lab Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs:**
     ```
     https://mwlhxwbkuumjxpnvldli.supabase.co/auth/v1/callback
     ```
   - Click **Create**
   - **Copy the Client ID and Client Secret** (you'll need these next)

### Step 3: Add Credentials to Supabase

1. Back in Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** (from Google Cloud Console)
3. Paste your **Client Secret** (from Google Cloud Console)
4. Click **Save**

### Step 4: Test It!

1. Go back to your app
2. Click "Continue with Google"
3. You should be redirected to Google's login page
4. After selecting your account, you'll be redirected back to your app

## ✅ That's It!

Google OAuth should now work. The error message should disappear and you'll be able to log in with Google.

## 🐛 Troubleshooting

**Still getting errors?**
- Make sure the redirect URI in Google Cloud Console is **exactly**: `https://mwlhxwbkuumjxpnvldli.supabase.co/auth/v1/callback`
- Make sure `http://localhost:5173` is in **Authorized JavaScript origins**
- Make sure Client ID and Client Secret are correctly copied (no extra spaces)
- Try refreshing your browser after saving in Supabase

**Need help?**
- Check the full guide in `AUTH_TESTING.md` for more detailed instructions

