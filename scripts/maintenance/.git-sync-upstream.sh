#!/bin/bash
# Script to sync fork with upstream repository

# Replace this with your upstream repository URL
UPSTREAM_URL="https://github.com/ORIGINAL-OWNER/dsa-teacher.git"

echo "Adding upstream remote..."
git remote add upstream "$UPSTREAM_URL" 2>/dev/null || git remote set-url upstream "$UPSTREAM_URL"

echo "Fetching from upstream..."
git fetch upstream

echo "Merging upstream/main into local main..."
git merge upstream/main

echo "Done! Your local main is now synced with upstream."
echo "To push to your fork: git push origin main"

