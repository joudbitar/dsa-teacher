#!/bin/bash

# Deploy Backend Functions to Supabase
# This script deploys the updated Edge Functions with JWT authentication

echo "🚀 Deploying DSA Lab Backend Functions to Supabase..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Install it with: npm install -g supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase."
    echo "Run: supabase login"
    exit 1
fi

echo "📦 Deploying 'projects' function..."
supabase functions deploy projects

if [ $? -eq 0 ]; then
    echo "✅ Projects function deployed successfully!"
else
    echo "❌ Failed to deploy projects function"
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Refresh your browser at http://localhost:5173/challenges/stack"
echo "2. You should no longer see 'Missing x-user-id header' errors"
echo "3. The challenge page should load with full content"

