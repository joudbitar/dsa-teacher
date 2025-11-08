#!/bin/bash

# Quick deployment commands
# Run these one by one in your terminal

echo "======================================"
echo "DSA Lab - Deployment Commands"
echo "======================================"
echo ""
echo "Step 1: Get your access token from:"
echo "  https://app.supabase.com/account/tokens"
echo ""
echo "Step 2: Run this command (replace YOUR_TOKEN):"
echo ""
echo "export SUPABASE_ACCESS_TOKEN=\"YOUR_TOKEN\""
echo ""
echo "Step 3: Deploy backend:"
echo ""
echo "supabase functions deploy projects --project-ref mwlhxwbkuumjxpnvldli"
echo ""
echo "Step 4: Build frontend:"
echo ""
echo "cd /Users/tahamoula/Desktop/dsa-teacher/web && pnpm build"
echo ""
echo "======================================"
echo ""

# If SUPABASE_ACCESS_TOKEN is set, offer to deploy
if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "✓ Access token detected!"
    echo ""
    read -p "Deploy now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deploying backend..."
        cd "$(dirname "$0")"
        supabase functions deploy projects --project-ref mwlhxwbkuumjxpnvldli
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Backend deployed!"
            echo ""
            echo "Building frontend..."
            cd web
            pnpm build
            
            if [ $? -eq 0 ]; then
                echo ""
                echo "✅ Frontend built!"
                echo ""
                echo "🎉 All done! Test the app now."
            fi
        fi
    fi
else
    echo "⚠️  No access token detected."
    echo "Set it first: export SUPABASE_ACCESS_TOKEN=\"your_token\""
fi

