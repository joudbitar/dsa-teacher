#!/bin/bash
# Deployment Script for Supabase Edge Functions
# Run this script to deploy all functions to production

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 Deploying Supabase Edge Functions to Production           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Login to Supabase (will open browser)
echo "📝 Step 1: Login to Supabase..."
echo "   This will open your browser for authentication."
echo ""
supabase login

# Step 2: Link to project
echo ""
echo "🔗 Step 2: Linking to project mwlhxwbkuumjxpnvldli..."
supabase link --project-ref mwlhxwbkuumjxpnvldli

# Step 3: Deploy all functions
echo ""
echo "📦 Step 3: Deploying all functions..."
echo ""

echo "   ✓ Deploying modules function..."
supabase functions deploy modules --no-verify-jwt --project-ref mwlhxwbkuumjxpnvldli

echo "   ✓ Deploying projects function..."
supabase functions deploy projects --no-verify-jwt --project-ref mwlhxwbkuumjxpnvldli

echo "   ✓ Deploying submissions function..."
supabase functions deploy submissions --no-verify-jwt --project-ref mwlhxwbkuumjxpnvldli

# Step 4: Set environment secrets
echo ""
echo "🔐 Step 4: Setting environment secrets..."
echo "   Reading from .env.local..."
echo ""
echo "   ℹ️  Note: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are automatically available in Edge Functions"
echo ""

# Source .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
    
    echo "   ✓ Setting GITHUB_ORG..."
    supabase secrets set GITHUB_ORG="$GITHUB_ORG" --project-ref mwlhxwbkuumjxpnvldli
    
    echo "   ✓ Setting GITHUB_APP_ID..."
    supabase secrets set GITHUB_APP_ID="$GITHUB_APP_ID" --project-ref mwlhxwbkuumjxpnvldli
    
    echo "   ✓ Setting GITHUB_APP_INSTALLATION_ID..."
    supabase secrets set GITHUB_APP_INSTALLATION_ID="$GITHUB_APP_INSTALLATION_ID" --project-ref mwlhxwbkuumjxpnvldli
    
    echo "   ✓ Setting GITHUB_APP_PRIVATE_KEY..."
    if [ -f "$GITHUB_APP_PRIVATE_KEY_PATH" ]; then
        supabase secrets set GITHUB_APP_PRIVATE_KEY="$(cat $GITHUB_APP_PRIVATE_KEY_PATH)" --project-ref mwlhxwbkuumjxpnvldli
    else
        echo "   ⚠️  GITHUB_APP_PRIVATE_KEY_PATH not found, using env var..."
        supabase secrets set GITHUB_APP_PRIVATE_KEY="$GITHUB_APP_PRIVATE_KEY" --project-ref mwlhxwbkuumjxpnvldli
    fi
else
    echo "   ❌ .env.local not found! Please create it with required variables."
    exit 1
fi

# Step 5: Test deployed functions
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Deployment Complete!                                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🧪 Testing deployed endpoints..."
echo ""

BASE_URL="https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1"

echo "1. Testing GET /modules..."
curl -s "$BASE_URL/modules" | jq -e '.[]|select(.id=="stack")' > /dev/null && echo "   ✅ Modules endpoint working!" || echo "   ❌ Modules endpoint failed"

echo ""
echo "2. Testing GET /projects..."
curl -s -H "x-user-id: test-deploy" "$BASE_URL/projects" | jq -e 'type == "array"' > /dev/null && echo "   ✅ Projects GET endpoint working!" || echo "   ❌ Projects GET endpoint failed"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🎉 All Functions Deployed Successfully!                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📖 API Base URL:"
echo "   $BASE_URL"
echo ""
echo "📝 Endpoints:"
echo "   GET  $BASE_URL/modules"
echo "   GET  $BASE_URL/projects"
echo "   POST $BASE_URL/projects"
echo "   POST $BASE_URL/submissions"
echo ""
echo "📚 For full API documentation, see:"
echo "   supabase/functions/README.md"
echo ""

