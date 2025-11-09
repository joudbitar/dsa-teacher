# 🔑 GitHub App Credentials Setup - IMPORTANT CLARIFICATION

## ⚠️ Important: This is a Supabase Edge Function, NOT a Local API

The backend that creates GitHub repos is a **Supabase Edge Function** that runs in the cloud at:
- `https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/projects`

It does **NOT** run locally, so `.env.local` files won't work for GitHub App credentials.

## ✅ Correct Setup: Supabase Edge Function Secrets

The GitHub App credentials must be set in **Supabase Dashboard → Edge Functions → Secrets**, not in a local `.env.local` file.

### Step 1: Get GitHub App Credentials

You need these values from Joud (or whoever set up the GitHub App):

1. **GITHUB_APP_ID**: The GitHub App ID (e.g., `2255169`)
2. **GITHUB_APP_INSTALLATION_ID**: The installation ID (e.g., `93648759`)
3. **GITHUB_APP_PRIVATE_KEY**: The private key file (`.pem` format)
4. **GITHUB_ORG**: The GitHub organization (e.g., `dsa-teacher`)

### Step 2: Set Secrets in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/settings/functions

2. Click **"Add Secret"** for each of these:

   #### Secret 1: `GITHUB_ORG`
   - **Value**: `dsa-teacher`

   #### Secret 2: `GITHUB_APP_ID`
   - **Value**: `2255169` (or the actual App ID)

   #### Secret 3: `GITHUB_APP_INSTALLATION_ID`
   - **Value**: `93648759` (or the actual Installation ID)

   #### Secret 4: `GITHUB_APP_PRIVATE_KEY`
   - **Value**: Paste the **entire contents** of the `.pem` file
   - **Important**: 
     - Include the `-----BEGIN RSA PRIVATE KEY-----` line
     - Include all the base64 content
     - Include the `-----END RSA PRIVATE KEY-----` line
     - Preserve newlines (the code will auto-fix escaped newlines if needed)

   #### Secret 5: `SUPABASE_URL`
   - **Value**: `https://mwlhxwbkuumjxpnvldli.supabase.co`

   #### Secret 6: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Get this from Supabase Dashboard → Settings → API → Service Role Key
   - **Important**: This is the Service Role Key, NOT the anon key!

### Step 3: Deploy the Function (if you made code changes)

If you've updated the function code, deploy it:

```bash
./deploy-functions.sh
```

Or manually:
```bash
cd supabase/functions
supabase functions deploy projects --project-ref mwlhxwbkuumjxpnvldli
```

### Step 4: Test

1. Hard refresh your browser (Cmd+Shift+R)
2. Make sure you're signed in
3. Click "Start with JavaScript" (or any language)
4. Check the browser console for detailed error messages

## 🔍 How to Verify Secrets Are Set

### Option 1: Using Supabase CLI

```bash
supabase secrets list --project-ref mwlhxwbkuumjxpnvldli
```

This will show all set secrets (values are hidden for security).

### Option 2: Check Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/settings/functions
2. Scroll to "Secrets" section
3. Verify all 6 secrets are listed

### Option 3: Check Function Logs

1. Go to: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/logs/edge-functions
2. Try creating a project
3. Check the logs - they will show which secrets are missing

## 🚨 Common Mistakes

### ❌ Mistake 1: Setting credentials in `.env.local`
- **Why it doesn't work**: The Edge Function runs in the cloud, not locally
- **Solution**: Set secrets in Supabase Dashboard

### ❌ Mistake 2: Using the wrong private key format
- **Why it fails**: GitHub API requires PEM format with proper headers
- **Solution**: Copy the entire `.pem` file contents, including BEGIN/END markers

### ❌ Mistake 3: Using Anon Key instead of Service Role Key
- **Why it fails**: Service Role Key is needed for database operations
- **Solution**: Use the Service Role Key from Settings → API

### ❌ Mistake 4: Wrong GitHub App Installation
- **Why it fails**: The App must be installed on the `dsa-teacher` organization
- **Solution**: Verify the App is installed on the correct org in GitHub

## 📝 Example: What the Private Key Should Look Like

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(many lines of base64 encoded data)
...
-----END RSA PRIVATE KEY-----
```

**Important**: 
- Copy the ENTIRE key, including BEGIN and END lines
- Preserve newlines (Supabase will handle this automatically)
- Don't add extra quotes or escaping

## 🔧 Troubleshooting

### Error: "GitHub App private key not configured"
- **Solution**: Set `GITHUB_APP_PRIVATE_KEY` secret in Supabase Dashboard

### Error: "Authentication failed"
- **Solution**: 
  1. Verify App ID, Installation ID, and Private Key are correct
  2. Check that the GitHub App is installed on the organization
  3. Verify the private key matches the GitHub App

### Error: "Template repository not found"
- **Solution**: 
  1. Verify template repositories exist (e.g., `template-dsa-stack-js`)
  2. Check GitHub App has access to the organization
  3. Verify repositories are marked as templates in GitHub

### Error: "Repository not found" (when cloning)
- **Solution**: This means the repo creation failed. Check Supabase logs to see why.

## 🎯 Quick Checklist

- [ ] `GITHUB_ORG` secret is set
- [ ] `GITHUB_APP_ID` secret is set
- [ ] `GITHUB_APP_INSTALLATION_ID` secret is set
- [ ] `GITHUB_APP_PRIVATE_KEY` secret is set (full PEM content)
- [ ] `SUPABASE_URL` secret is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` secret is set
- [ ] Function is deployed (if code was changed)
- [ ] Browser is refreshed
- [ ] User is signed in

## 📞 Need Help?

If you're still getting errors after setting all secrets:

1. **Check the browser console** for detailed error messages
2. **Check Supabase logs** at: https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/logs/edge-functions
3. **Run the verification script**: `./verify-github-secrets.sh`
4. **Check the error message** - it should now tell you exactly what's missing

## 🔐 Security Note

**Never commit secrets to git!** The `.gitignore` file already excludes `.env.local`, but make sure you never commit:
- Private keys
- Service role keys
- Installation IDs

These should only exist in:
- Supabase Dashboard (Edge Function Secrets)
- Your local machine (for testing with Supabase CLI)

