#!/usr/bin/env bash

# Release script for DSA CLI
# Usage: ./scripts/release-cli.sh <version> "<description>"
# Example: ./scripts/release-cli.sh 0.1.1 "Added new ASCII art banner"

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: $0 <version> \"<description>\""
    echo "Example: $0 0.1.1 \"Added new ASCII art banner\""
    exit 1
fi

VERSION=$1
DESCRIPTION=$2
CLI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../cli" && pwd)"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Validate version format (basic semantic version check)
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$ ]]; then
    echo -e "${RED}Error: Invalid version format${NC}"
    echo "Version should follow semantic versioning: MAJOR.MINOR.PATCH"
    echo "Example: 0.1.1 or 1.0.0-beta"
    exit 1
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  🚀 Releasing DSA CLI v${VERSION}${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Update version in package.json
echo -e "${YELLOW}Step 1: Updating version in package.json...${NC}"
cd "$CLI_DIR"
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "  Current version: $CURRENT_VERSION"
echo "  New version: $VERSION"

# Update package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '$VERSION';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"
echo -e "${GREEN}✓ Updated cli/package.json${NC}"
echo ""

# Step 2: Update version in checkUpdate.ts
echo -e "${YELLOW}Step 2: Updating version in checkUpdate.ts...${NC}"
CHECK_UPDATE_FILE="$CLI_DIR/src/lib/checkUpdate.ts"
if [ -f "$CHECK_UPDATE_FILE" ]; then
    # Use sed to replace CURRENT_VERSION constant
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/const CURRENT_VERSION = '.*';/const CURRENT_VERSION = '$VERSION';/" "$CHECK_UPDATE_FILE"
    else
        # Linux
        sed -i "s/const CURRENT_VERSION = '.*';/const CURRENT_VERSION = '$VERSION';/" "$CHECK_UPDATE_FILE"
    fi
    echo -e "${GREEN}✓ Updated cli/src/lib/checkUpdate.ts${NC}"
else
    echo -e "${RED}✗ Error: checkUpdate.ts not found${NC}"
    exit 1
fi
echo ""

# Step 3: Build CLI
echo -e "${YELLOW}Step 3: Building CLI...${NC}"
cd "$CLI_DIR"
if ! npm run build; then
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Step 4: Check git status
echo -e "${YELLOW}Step 4: Checking git status...${NC}"
cd "$ROOT_DIR"
if ! git diff --quiet; then
    echo -e "${YELLOW}⚠  You have uncommitted changes.${NC}"
    echo "The following files will be committed:"
    git status --short
    echo ""
    read -p "Continue? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Release cancelled${NC}"
        exit 1
    fi
fi

# Step 5: Commit changes
echo -e "${YELLOW}Step 5: Committing changes...${NC}"
git add "$CLI_DIR/package.json" "$CLI_DIR/src/lib/checkUpdate.ts" "$CLI_DIR/dist/"
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠  No changes to commit${NC}"
else
    git commit -m "chore(cli): Bump version to $VERSION

$DESCRIPTION"
    echo -e "${GREEN}✓ Changes committed${NC}"
fi
echo ""

# Step 6: Create and push tag
echo -e "${YELLOW}Step 6: Creating git tag...${NC}"
TAG="v$VERSION"
if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo -e "${RED}✗ Tag $TAG already exists${NC}"
    read -p "Delete and recreate? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d "$TAG"
        git push origin ":refs/tags/$TAG" 2>/dev/null || true
    else
        echo -e "${RED}Release cancelled${NC}"
        exit 1
    fi
fi

git tag -a "$TAG" -m "CLI v$VERSION: $DESCRIPTION"
echo -e "${GREEN}✓ Tag $TAG created${NC}"
echo ""

# Step 7: Push changes
echo -e "${YELLOW}Step 7: Pushing to remote...${NC}"
read -p "Push commits and tag to origin? (Y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    git push origin main
    git push origin "$TAG"
    echo -e "${GREEN}✓ Pushed to origin${NC}"
else
    echo -e "${YELLOW}⚠  Skipped push. Run manually:${NC}"
    echo "  git push origin main"
    echo "  git push origin $TAG"
fi
echo ""

# Step 8: Instructions for GitHub release
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✓ Release preparation complete!${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Create a GitHub release:"
echo -e "   ${CYAN}https://github.com/joudbitar/dsa-teacher/releases/new${NC}"
echo ""
echo "2. Select tag: ${CYAN}$TAG${NC}"
echo ""
echo "3. Release title: ${CYAN}CLI v$VERSION${NC}"
echo ""
echo "4. Release description:"
echo "   $DESCRIPTION"
echo ""
echo "5. Click 'Publish release'"
echo ""
echo -e "${GREEN}After publishing, users will be notified of the update when they run:${NC}"
echo "  • dsa test"
echo "  • dsa submit"
echo "  • dsa update"
echo ""
echo -e "${YELLOW}To test update detection locally:${NC}"
echo "  rm ~/.dsa-cli-update-check"
echo "  dsa test  # in a project directory"
echo ""

