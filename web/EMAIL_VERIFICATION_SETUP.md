# Email Verification Setup

## Enable Email Verification in Supabase

By default, Supabase requires email verification. Here's how to configure it:

### Step 1: Check Email Verification Settings

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli
2. Click **Authentication** in the left sidebar
3. Click **Settings** (or go to **Providers** → **Email**)
4. Look for **"Confirm email"** toggle

### Step 2: Configure Email Verification

**Option A: Email Verification Enabled (Recommended for Production)**
- Toggle **"Confirm email"** to **ON**
- Users must verify their email before they can log in
- More secure, prevents fake accounts

**Option B: Email Verification Disabled (For Development/Testing)**
- Toggle **"Confirm email"** to **OFF**
- Users can log in immediately after signup
- Useful for testing without checking emails

### Step 3: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the confirmation email template if desired
3. The default template works fine

### Step 4: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL:** `http://localhost:5173` (for development)
3. Add **Redirect URLs:**
   - `http://localhost:5173/challenges`
   - `http://localhost:5173/auth?mode=login`
   - Add your production URLs when deploying

## How It Works

### With Email Verification Enabled:

1. User signs up with email/password
2. Supabase sends a confirmation email
3. User clicks the confirmation link in the email
4. User is redirected back to your app
5. User can now log in

### With Email Verification Disabled:

1. User signs up with email/password
2. User is immediately logged in
3. User is redirected to `/challenges`

## Testing Email Verification

### Test with Verification Enabled:

1. Sign up with a real email address
2. Check your email inbox (and spam folder)
3. Click the confirmation link
4. You should be redirected back to your app
5. Try logging in - it should work now

### Test with Verification Disabled:

1. Sign up with any email
2. You should be immediately logged in
3. No email confirmation needed

## Troubleshooting

**Not receiving confirmation emails?**
- Check spam/junk folder
- Make sure email provider is enabled in Supabase
- Check Supabase logs for email sending errors
- For development, you can disable email verification temporarily

**Confirmation link not working?**
- Make sure redirect URLs are configured in Supabase
- Check that the link hasn't expired (usually valid for 24 hours)
- Try requesting a new confirmation email

**Want to resend confirmation email?**
- Users can request a new confirmation email from the login page
- Or you can add a "Resend confirmation" feature

## Current Behavior

The app is configured to:
- Show a success message after signup
- Instruct users to check their email for verification
- Not auto-redirect if email verification is required
- Allow users to go to login page manually

This works whether email verification is enabled or disabled in Supabase.

