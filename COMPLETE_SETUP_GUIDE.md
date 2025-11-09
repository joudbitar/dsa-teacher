# 🔑 Complete Setup Guide: GitHub App Credentials

## 📋 Overview

The "Start Language" button creates a GitHub repository using a **Supabase Edge Function**. This function runs in the cloud and requires GitHub App credentials to be set as **Supabase Edge Function Secrets**.

## 🎯 Two Ways to Set Secrets

### Option 1: Using Supabase CLI Script (Recommended)

If you have a `.env.local` file with the credentials:

1. **Create `.env.local`** in the project root:
   ```bash
   GITHUB_ORG=dsa-teacher
   GITHUB_APP_ID=2255169
   GITHUB_APP_INSTALLATION_ID=93648759
   GITHUB_APP_PRIVATE_KEY_PATH=/path/to/private-key.pem
   SUPABASE_URL=https://mwlhxwbkuumjxpnvldli.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Run the setup script**:
   ```bash
   ./SETUP_GITHUB_SECRETS.sh
   ```

This script will read from `.env.local` and set all secrets in Supabase.

### Option 2: Manual Setup in Supabase Dashboard

1. **Go to Supabase Dashboard**:
   https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/settings/functions

2. **Click "Add Secret"** for each:

   - **GITHUB_ORG**: `dsa-teacher`
   - **GITHUB_APP_ID**: `2255169` (or actual App ID)
   - **GITHUB_APP_INSTALLATION_ID**: `93648759` (or actual Installation ID)
   - **GITHUB_APP_PRIVATE_KEY**: Paste entire contents of `.pem` file
   - **SUPABASE_URL**: `https://mwlhxwbkuumjxpnvldli.supabase.co`
   - **SUPABASE_SERVICE_ROLE_KEY**: Get from Settings → API → Service Role Key

## 🔍 Getting the Required Values

### 1. GitHub App Credentials

Ask Joud (or the person who set up the GitHub App) for:
- **GITHUB_APP_ID**: The GitHub App ID
- **GITHUB_APP_INSTALLATION_ID**: The installation ID
- **GITHUB_APP_PRIVATE_KEY**: The private key file (`.pem` format)

### 2. Private Key File

The private key should be in PEM format:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(many lines of base64)
...
-----END RSA PRIVATE KEY-----
```

**Important**: Copy the ENTIRE key, including BEGIN and END markers.

### 3. Service Role Key

1. Go to: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/settings/api
2. Find **Service Role Key** (NOT the anon key!)
3. Copy it (starts with `eyJ...`)

## ✅ Verification

### Check Secrets Are Set

```bash
supabase secrets list --project-ref mwlhxwbkuumjxpnvldli
```

Or check in Supabase Dashboard:
https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/settings/functions

### Test the Function

1. **Deploy the function** (if you made code changes):
   ```bash
   ./deploy-functions.sh
   ```

2. **Open your web app** and try creating a project

3. **Check browser console** for detailed error messages

4. **Check Supabase logs**:
   https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/logs/edge-functions

## 🚨 Troubleshooting

### Error: "GitHub App private key not configured"

**Solution**: Set `GITHUB_APP_PRIVATE_KEY` secret in Supabase Dashboard

### Error: "Authentication failed"

**Solution**: 
1. Verify App ID, Installation ID, and Private Key are correct
2. Check that the GitHub App is installed on the organization
3. Verify the private key matches the GitHub App

### Error: "Repository not found" (when cloning)

**Solution**: This means repo creation failed. Check Supabase logs to see why.

### Error: "Template repository not found"

**Solution**: 
1. Verify template repositories exist (e.g., `template-dsa-stack-js`)
2. Check GitHub App has access to the organization
3. Verify repositories are marked as templates in GitHub

## 📝 Important Notes

1. **The Edge Function runs in the cloud**, not locally
2. **Secrets must be set in Supabase Dashboard**, not just in `.env.local`
3. **`.env.local` is only used by the setup script** to set secrets
4. **Never commit secrets to git** - they're in `.gitignore`

## 🎯 Quick Checklist

- [ ] GitHub App credentials obtained from Joud
- [ ] `.env.local` created (if using Option 1)
- [ ] Secrets set in Supabase Dashboard (either via script or manually)
- [ ] Function deployed (if code was changed)
- [ ] Browser refreshed
- [ ] User signed in
- [ ] Test "Start Language" button

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli
- **Edge Function Secrets**: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/settings/functions
- **Function Logs**: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/logs/edge-functions
- **API Settings**: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/settings/api

