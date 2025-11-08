#!/bin/bash

# Script to deploy Supabase Edge Functions
# This ensures the improved error handling is deployed

set -e

echo "🚀 Deploying Supabase Edge Functions"
echo "====================================="
echo ""

PROJECT_REF="mwlhxwbkuumjxpnvldli"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo "   Install it: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "Checking authentication..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase CLI"
    echo "   Run: supabase login"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Deploy the projects function
echo "📦 Deploying projects function..."
cd supabase/functions

# Deploy to the specific project
supabase functions deploy projects --project-ref $PROJECT_REF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully deployed projects function!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Make sure all secrets are set in Supabase Dashboard:"
    echo "      https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
    echo "   2. Test the 'Start Language' button again"
    echo "   3. Check the browser console for detailed error messages"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo "   Check the error messages above"
    exit 1
fi

