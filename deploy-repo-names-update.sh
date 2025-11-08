#!/bin/bash

# Deploy the meaningful repository names update
# This script deploys both backend and frontend changes

set -e

echo "🚀 Deploying Meaningful Repository Names Update"
echo "=============================================="
echo ""

PROJECT_REF="mwlhxwbkuumjxpnvldli"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo "   Install it: brew install supabase/tap/supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "Checking authentication..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase CLI"
    echo ""
    echo "Please login first:"
    echo "  Option 1: supabase login"
    echo "  Option 2: export SUPABASE_ACCESS_TOKEN=your_token"
    echo "             (Get token from: https://app.supabase.com/account/tokens)"
    echo ""
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Deploy the projects function
echo "📦 Deploying projects Edge Function..."
cd supabase/functions

supabase functions deploy projects --project-ref $PROJECT_REF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backend deployed successfully!"
    echo ""
else
    echo ""
    echo "❌ Backend deployment failed"
    exit 1
fi

# Go back to root
cd ../..

# Build frontend
echo "📦 Building frontend..."
cd web

if command -v pnpm &> /dev/null; then
    pnpm build
elif command -v npm &> /dev/null; then
    npm run build
else
    echo "❌ Neither pnpm nor npm found"
    exit 1
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Frontend built successfully!"
    echo ""
    echo "📝 Frontend is ready to deploy. Upload the 'web/dist' folder to your hosting service."
    echo ""
else
    echo ""
    echo "❌ Frontend build failed"
    exit 1
fi

echo "═══════════════════════════════════════════════"
echo "✨ Deployment Complete!"
echo "═══════════════════════════════════════════════"
echo ""
echo "📋 What's Next:"
echo "  1. Test by creating a new project in the web app"
echo "  2. Verify repo name is: {username}-{module}-1"
echo "  3. Click '+ New Attempt' to create another repo"
echo "  4. Verify repo name is: {username}-{module}-2"
echo ""
echo "📖 Full documentation: MEANINGFUL_REPO_NAMES_UPDATE.md"
echo ""

