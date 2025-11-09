#!/bin/bash

# Script to set GitHub App secrets in Supabase Edge Functions
# This script can read from .env.local or you can set secrets manually in Supabase Dashboard

set -e

PROJECT_REF="mwlhxwbkuumjxpnvldli"

echo "🔐 Setting GitHub App Secrets in Supabase Edge Functions"
echo "========================================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo "   Install it: https://supabase.com/docs/guides/cli"
    echo ""
    echo "   Alternatively, set secrets manually in Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase CLI"
    echo "   Run: supabase login"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "📁 Found .env.local file"
    echo "   Reading GitHub App credentials from .env.local..."
    echo ""
    
    # Source .env.local
    set -a
    source .env.local
    set +a
    
    # Set secrets from .env.local
    if [ -n "$GITHUB_ORG" ]; then
        echo "✓ Setting GITHUB_ORG=$GITHUB_ORG"
        supabase secrets set GITHUB_ORG="$GITHUB_ORG" --project-ref $PROJECT_REF
    else
        echo "⚠️  GITHUB_ORG not found in .env.local"
    fi
    
    if [ -n "$GITHUB_APP_ID" ]; then
        echo "✓ Setting GITHUB_APP_ID=$GITHUB_APP_ID"
        supabase secrets set GITHUB_APP_ID="$GITHUB_APP_ID" --project-ref $PROJECT_REF
    else
        echo "⚠️  GITHUB_APP_ID not found in .env.local"
    fi
    
    if [ -n "$GITHUB_APP_INSTALLATION_ID" ]; then
        echo "✓ Setting GITHUB_APP_INSTALLATION_ID=$GITHUB_APP_INSTALLATION_ID"
        supabase secrets set GITHUB_APP_INSTALLATION_ID="$GITHUB_APP_INSTALLATION_ID" --project-ref $PROJECT_REF
    else
        echo "⚠️  GITHUB_APP_INSTALLATION_ID not found in .env.local"
    fi
    
    # Handle private key
    if [ -n "$GITHUB_APP_PRIVATE_KEY_PATH" ] && [ -f "$GITHUB_APP_PRIVATE_KEY_PATH" ]; then
        echo "✓ Setting GITHUB_APP_PRIVATE_KEY from file: $GITHUB_APP_PRIVATE_KEY_PATH"
        supabase secrets set GITHUB_APP_PRIVATE_KEY="$(cat $GITHUB_APP_PRIVATE_KEY_PATH)" --project-ref $PROJECT_REF
    elif [ -n "$GITHUB_APP_PRIVATE_KEY" ]; then
        echo "✓ Setting GITHUB_APP_PRIVATE_KEY from environment variable"
        supabase secrets set GITHUB_APP_PRIVATE_KEY="$GITHUB_APP_PRIVATE_KEY" --project-ref $PROJECT_REF
    else
        echo "⚠️  GITHUB_APP_PRIVATE_KEY not found in .env.local"
        echo "   You need to set it manually or provide GITHUB_APP_PRIVATE_KEY_PATH"
    fi
    
    # Set Supabase URL if provided
    if [ -n "$SUPABASE_URL" ]; then
        echo "✓ Setting SUPABASE_URL=$SUPABASE_URL"
        supabase secrets set SUPABASE_URL="$SUPABASE_URL" --project-ref $PROJECT_REF
    else
        echo "⚠️  SUPABASE_URL not found in .env.local, using default"
        supabase secrets set SUPABASE_URL="https://$PROJECT_REF.supabase.co" --project-ref $PROJECT_REF
    fi
    
    # Set Service Role Key if provided
    if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        echo "✓ Setting SUPABASE_SERVICE_ROLE_KEY"
        supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" --project-ref $PROJECT_REF
    else
        echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
        echo "   Get it from: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
    fi
    
else
    echo "⚠️  .env.local not found"
    echo ""
    echo "You have two options:"
    echo ""
    echo "Option 1: Create .env.local with these variables:"
    echo "   GITHUB_ORG=dsa-teacher"
    echo "   GITHUB_APP_ID=2255169"
    echo "   GITHUB_APP_INSTALLATION_ID=93648759"
    echo "   GITHUB_APP_PRIVATE_KEY_PATH=/path/to/private-key.pem"
    echo "   SUPABASE_URL=https://$PROJECT_REF.supabase.co"
    echo "   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    echo ""
    echo "Option 2: Set secrets manually in Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
    echo ""
    exit 1
fi

echo ""
echo "✅ Secrets set successfully!"
echo ""
echo "📋 Verify secrets:"
echo "   supabase secrets list --project-ref $PROJECT_REF"
echo ""
echo "🧪 Test the function:"
echo "   1. Open your web app"
echo "   2. Click 'Start with JavaScript'"
echo "   3. Check browser console for any errors"
echo ""

