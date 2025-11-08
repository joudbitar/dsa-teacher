# Authentication Testing Guide

## 🧪 How to Test Authentication

### 1. **Test Email/Password Sign Up**

1. Navigate to the landing page
2. Click "Start Learning" or "Start Coding" button
3. You should be redirected to the signup page (`/auth?mode=signup`)
4. Fill in the form:
   - Email: `test@example.com` (use a real email if email confirmation is enabled)
   - Password: `password123` (must be at least 6 characters)
   - Confirm Password: `password123`
5. Click "Sign up"
6. **Expected Result:**
   - If email confirmation is disabled: You should be automatically logged in and redirected to `/challenges`
   - If email confirmation is enabled: You'll see a success message and need to check your email

### 2. **Test Email/Password Log In**

1. Navigate to `/login` or click "Log in" in the navbar
2. Enter your credentials:
   - Email: The email you used to sign up
   - Password: Your password
3. Click "Log in"
4. **Expected Result:**
   - You should be logged in and redirected to `/challenges`
   - The navbar should show your email and a "Sign out" button

### 3. **Test Google OAuth Login**

**First, set up Google OAuth in Supabase (see setup instructions below)**

1. Navigate to `/login` or `/signup`
2. Click "Continue with Google" button
3. **Expected Result:**
   - You'll be redirected to Google's OAuth consent screen
   - After selecting your Google account, you'll be redirected back to `/challenges`
   - You should be logged in with your Google account

### 4. **Test Protected Routes**

1. **While logged out:**
   - Try to navigate to `/challenges` directly
   - **Expected Result:** You should be redirected to `/login`

2. **While logged in:**
   - Navigate to `/challenges`
   - **Expected Result:** You should see the challenges page

### 5. **Test Sign Out**

1. While logged in, click "Sign out" in the navbar
2. **Expected Result:**
   - You should be logged out
   - The navbar should show "Log in" and "Start Learning" buttons again
   - If you try to access `/challenges`, you should be redirected to `/login`

### 6. **Test Session Persistence**

1. Log in to your account
2. Close the browser tab/window
3. Reopen the app
4. **Expected Result:**
   - You should still be logged in (session persisted in localStorage)
   - The navbar should show your email

### 7. **Test Error Handling**

1. **Invalid credentials:**
   - Try logging in with wrong email/password
   - **Expected Result:** Error message should appear

2. **Password mismatch:**
   - Try signing up with passwords that don't match
   - **Expected Result:** Error message "Passwords do not match"

3. **Short password:**
   - Try signing up with password less than 6 characters
   - **Expected Result:** Error message "Password must be at least 6 characters"

## 🔧 Setting Up Google OAuth in Supabase

### Step 1: Enable Google Provider in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click on it
5. Toggle **Enable Google provider** to ON

### Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External (unless you have a Google Workspace)
   - App name: DSA Lab (or your app name)
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Add scopes: `email`, `profile`, `openid`
   - Click **Save and Continue**
   - Add test users (if in testing mode) or publish the app
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: DSA Lab Web Client
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (for local development)
     - `https://your-production-domain.com` (for production)
   - **Authorized redirect URIs:**
     - `https://mwlhxwbkuumjxpnvldli.supabase.co/auth/v1/callback`
     - Add your production callback URL if needed
   - Click **Create**
7. Copy the **Client ID** and **Client Secret**

### Step 3: Configure Google in Supabase

1. Back in Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** and **Client Secret** from Google Cloud Console
3. Click **Save**

### Step 4: Update Redirect URLs (if needed)

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your site URL:
   - **Site URL:** `http://localhost:5173` (for development)
   - **Redirect URLs:** Add `http://localhost:5173/challenges` and your production URLs

### Step 5: Test Google OAuth

1. Restart your dev server if it's running
2. Navigate to your app
3. Click "Continue with Google" on the login/signup page
4. You should be redirected to Google's OAuth screen
5. After authorizing, you'll be redirected back to your app

## 🐛 Troubleshooting

### Google OAuth Not Working

- **Check redirect URI:** Make sure the redirect URI in Google Cloud Console matches exactly: `https://mwlhxwbkuumjxpnvldli.supabase.co/auth/v1/callback`
- **Check authorized origins:** Make sure `http://localhost:5173` is in authorized JavaScript origins
- **Check Supabase settings:** Verify Client ID and Client Secret are correctly entered
- **Check browser console:** Look for any error messages

### Email/Password Not Working

- **Check Supabase settings:** Make sure Email provider is enabled in Authentication → Providers
- **Check email confirmation:** If enabled, you need to confirm your email before logging in
- **Check browser console:** Look for any error messages
- **Check network tab:** Verify API calls are being made correctly

### Session Not Persisting

- **Check localStorage:** Open browser DevTools → Application → Local Storage → Check for Supabase session
- **Check Supabase settings:** Verify session settings in your Supabase client configuration

### Protected Routes Not Working

- **Check AuthProvider:** Make sure `AuthProvider` wraps your routes in `App.tsx`
- **Check ProtectedRoute:** Verify `ProtectedRoute` is used correctly
- **Check user state:** Use browser DevTools to check if user is logged in

## ✅ Checklist

- [ ] Email/Password signup works
- [ ] Email/Password login works
- [ ] Google OAuth login works (after setup)
- [ ] Protected routes redirect when not logged in
- [ ] Protected routes allow access when logged in
- [ ] Sign out works correctly
- [ ] Session persists across page refreshes
- [ ] Error messages display correctly
- [ ] Navbar shows correct state (logged in vs logged out)

## 📝 Notes

- **Email Confirmation:** By default, Supabase may require email confirmation. You can disable this in Authentication → Settings → Email Auth
- **Development vs Production:** Make sure to add both development and production URLs to Google OAuth settings
- **Security:** Never commit your `.env.local` file to git. It's already in `.gitignore`

