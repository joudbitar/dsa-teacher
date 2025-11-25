# Supabase Email Template Customization Guide

This guide explains how to customize Supabase email templates to match Shelly's branding and ensure proper redirect URLs.

## Overview

Supabase sends authentication emails (signup confirmation, password reset, etc.) using templates configured in the Supabase Dashboard. By default, these templates are generic and may redirect to `localhost`. This guide shows you how to customize them to be on-brand and use the correct production URLs.

## Quick Fix: Redirect URL

The redirect URL issue has been fixed in code. The `signUp` function now automatically uses the correct site URL. However, you should still customize the email templates for better branding.

## Customizing Email Templates

### Step 1: Access Supabase Dashboard

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Authentication** → **Email Templates**

### Step 2: Customize Signup Confirmation Email

1. Click on **"Confirm signup"** template
2. Replace the default template with the branded version below

#### Branded Signup Confirmation Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Shelly</title>
    <style>
      body {
        font-family: "JetBrains Mono", "Courier New", monospace;
        background-color: #f0ecda;
        color: #171512;
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #7f5539 0%, #b08968 100%);
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      .content {
        padding: 40px 30px;
        background-color: #ffffff;
      }
      .content h2 {
        color: #171512;
        font-size: 22px;
        margin-top: 0;
        margin-bottom: 20px;
      }
      .content p {
        color: #4b463f;
        font-size: 16px;
        margin-bottom: 16px;
      }
      .button {
        display: inline-block;
        padding: 14px 32px;
        background-color: #7f5539;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        margin: 24px 0;
        transition: background-color 0.2s;
      }
      .button:hover {
        background-color: #b08968;
      }
      .footer {
        background-color: #e5e0cc;
        padding: 24px 30px;
        text-align: center;
        border-top: 1px solid #d3cdbb;
      }
      .footer p {
        color: #4b463f;
        font-size: 14px;
        margin: 8px 0;
      }
      .logo {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">🐢 Shelly</div>
        <h1>Welcome to Shelly!</h1>
      </div>
      <div class="content">
        <h2>Confirm your email address</h2>
        <p>Hi there!</p>
        <p>
          Thanks for signing up for Shelly. We're excited to have you join us on
          your journey to master data structures and algorithms.
        </p>
        <p>
          To get started, please confirm your email address by clicking the
          button below:
        </p>
        <div style="text-align: center;">
          <a href="{{ .ConfirmationURL }}" class="button"
            >Confirm Email Address</a
          >
        </div>
        <p style="font-size: 14px; color: #4B463F; margin-top: 24px;">
          If the button doesn't work, you can copy and paste this link into your
          browser:<br />
          <a
            href="{{ .ConfirmationURL }}"
            style="color: #7F5539; word-break: break-all;"
            >{{ .ConfirmationURL }}</a
          >
        </p>
        <p style="font-size: 14px; color: #4B463F; margin-top: 16px;">
          This link will expire in 24 hours. If you didn't create an account,
          you can safely ignore this email.
        </p>
      </div>
      <div class="footer">
        <p><strong>Shelly</strong> - Master the fundamentals</p>
        <p style="font-size: 12px;">
          Build the fundamentals like a real engineer
        </p>
      </div>
    </div>
  </body>
</html>
```

### Step 3: Customize Password Reset Email

1. Click on **"Reset password"** template
2. Replace with the branded version below

#### Branded Password Reset Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password - Shelly</title>
    <style>
      body {
        font-family: "JetBrains Mono", "Courier New", monospace;
        background-color: #f0ecda;
        color: #171512;
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #7f5539 0%, #b08968 100%);
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      .content {
        padding: 40px 30px;
        background-color: #ffffff;
      }
      .content h2 {
        color: #171512;
        font-size: 22px;
        margin-top: 0;
        margin-bottom: 20px;
      }
      .content p {
        color: #4b463f;
        font-size: 16px;
        margin-bottom: 16px;
      }
      .button {
        display: inline-block;
        padding: 14px 32px;
        background-color: #7f5539;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        margin: 24px 0;
        transition: background-color 0.2s;
      }
      .button:hover {
        background-color: #b08968;
      }
      .footer {
        background-color: #e5e0cc;
        padding: 24px 30px;
        text-align: center;
        border-top: 1px solid #d3cdbb;
      }
      .footer p {
        color: #4b463f;
        font-size: 14px;
        margin: 8px 0;
      }
      .logo {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 10px;
      }
      .warning {
        background-color: #fff4e5;
        border-left: 4px solid #f4a300;
        padding: 16px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .warning p {
        margin: 0;
        color: #4b463f;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">🐢 Shelly</div>
        <h1>Reset Your Password</h1>
      </div>
      <div class="content">
        <h2>Password reset requested</h2>
        <p>Hi there!</p>
        <p>
          We received a request to reset your password for your Shelly account.
        </p>
        <p>Click the button below to choose a new password:</p>
        <div style="text-align: center;">
          <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
        </div>
        <div class="warning">
          <p>
            <strong>⚠️ Security Notice:</strong> If you didn't request this
            password reset, you can safely ignore this email. Your password will
            remain unchanged.
          </p>
        </div>
        <p style="font-size: 14px; color: #4B463F; margin-top: 24px;">
          If the button doesn't work, you can copy and paste this link into your
          browser:<br />
          <a
            href="{{ .ConfirmationURL }}"
            style="color: #7F5539; word-break: break-all;"
            >{{ .ConfirmationURL }}</a
          >
        </p>
        <p style="font-size: 14px; color: #4B463F; margin-top: 16px;">
          This link will expire in 1 hour.
        </p>
      </div>
      <div class="footer">
        <p><strong>Shelly</strong> - Master the fundamentals</p>
        <p style="font-size: 12px;">
          Build the fundamentals like a real engineer
        </p>
      </div>
    </div>
  </body>
</html>
```

### Step 4: Customize Magic Link Email (if used)

If you're using magic link authentication, customize the **"Magic Link"** template similarly.

### Step 5: Customize Email Change Confirmation (if used)

Customize the **"Change email address"** template with the same branding.

## Brand Colors Reference

Use these colors in your templates to match Shelly's brand:

- **Primary Brown**: `#7F5539` (Coffee bean - buttons, highlights)
- **Secondary Brown**: `#B08968` (Latte - secondary elements)
- **Background**: `#F0ECDA` (Latte foam - main background)
- **Surface**: `#E5E0CC` (Card surfaces)
- **Text Primary**: `#171512` (Espresso - main text)
- **Text Secondary**: `#4B463F` (Muted mocha - secondary text)
- **Border**: `#D3CDBB` (Light taupe - borders)
- **Success**: `#2E7D32` (Deep green)
- **Warning**: `#F4A300` (Golden orange)
- **Error**: `#B91C1C` (Warm red)

## Font

Use **JetBrains Mono** or fallback to `'Courier New', monospace` for a consistent look.

## Environment Variables

For production, make sure to set the `VITE_SITE_URL` environment variable:

```bash
# In your production environment
VITE_SITE_URL=https://your-production-domain.com
```

This ensures redirect URLs use the production domain instead of localhost.

## Testing

After updating templates:

1. Test signup flow - sign up with a test email
2. Check that the email looks correct
3. Verify the confirmation link redirects to the correct URL
4. Test password reset flow

## Troubleshooting

### Emails still redirecting to localhost

- Check that `VITE_SITE_URL` is set in production
- Verify the `signUp` function is using `getSiteUrl()` (already fixed in code)
- Check Supabase project settings → Authentication → URL Configuration

### Email template not updating

- Clear browser cache
- Wait a few minutes for changes to propagate
- Check that you saved the template in Supabase dashboard

### Styling issues

- Test in multiple email clients (Gmail, Outlook, Apple Mail)
- Some email clients strip certain CSS - keep styles inline when possible
- Test on mobile devices

## Additional Resources

- [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase URL Configuration](https://supabase.com/docs/guides/auth/auth-deep-linking)
