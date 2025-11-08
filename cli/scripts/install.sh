#!/bin/bash
# DSA CLI Installation Script
# Automates the installation of the DSA Lab CLI

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$CLI_DIR/.." && pwd)"

echo -e "${BLUE}🚀 DSA CLI Installation${NC}"
echo ""

# Function to print error and exit
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print info
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Step 1: Check if Node.js is installed
info "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    error_exit "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
fi

NODE_VERSION=$(node --version)
success "Node.js found: $NODE_VERSION"

# Check Node.js version (need 18+)
NODE_MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
    error_exit "Node.js version 18+ required. Found: $NODE_VERSION"
fi

# Step 2: Check if npm is installed
info "Checking for npm..."
if ! command -v npm &> /dev/null; then
    error_exit "npm is not installed. Please install npm."
fi

NPM_VERSION=$(npm --version)
success "npm found: $NPM_VERSION"

# Step 3: Check/Install pnpm
info "Checking for pnpm..."
if ! command -v pnpm &> /dev/null; then
    warning "pnpm not found. Installing pnpm globally..."
    npm install -g pnpm || error_exit "Failed to install pnpm"
    success "pnpm installed"
    
    # Add pnpm to PATH for current session
    export PATH="$(npm config get prefix)/bin:$PATH"
    
    # Check if pnpm is in PATH now
    if ! command -v pnpm &> /dev/null; then
        warning "pnpm installed but not in PATH. You may need to restart your terminal or run:"
        echo "  export PATH=\"\$(npm config get prefix)/bin:\$PATH\""
        echo ""
        echo "Or add to your shell config (~/.zshrc or ~/.bashrc):"
        echo "  export PATH=\"\$(npm config get prefix)/bin:\$PATH\""
        echo ""
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    PNPM_VERSION=$(pnpm --version)
    success "pnpm found: $PNPM_VERSION"
fi

# Step 4: Set up pnpm (if needed)
info "Setting up pnpm..."
if [ -z "$PNPM_HOME" ] || [ ! -d "$PNPM_HOME" ]; then
    info "Running pnpm setup..."
    pnpm setup || warning "pnpm setup had issues, but continuing..."
    
    # Try to source shell config if it exists
    if [ -f "$HOME/.zshrc" ]; then
        source "$HOME/.zshrc" 2>/dev/null || true
    elif [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc" 2>/dev/null || true
    fi
    
    # Add to PATH for current session
    export PATH="$(npm config get prefix)/bin:$PATH"
    if [ -n "$PNPM_HOME" ]; then
        export PATH="$PNPM_HOME:$PATH"
    fi
fi

# Step 5: Navigate to CLI directory
info "Navigating to CLI directory..."
cd "$CLI_DIR" || error_exit "Failed to navigate to CLI directory: $CLI_DIR"

# Step 6: Install CLI dependencies
info "Installing CLI dependencies..."
pnpm install || error_exit "Failed to install dependencies"

# Step 7: Build TypeScript
info "Building TypeScript..."
pnpm build || error_exit "Failed to build TypeScript"

# Step 8: Install CLI globally
info "Linking CLI globally..."
pnpm link --global || error_exit "Failed to link CLI globally"

# Step 9: Verify installation
info "Verifying installation..."
if command -v dsa &> /dev/null; then
    DSA_VERSION=$(dsa --version 2>/dev/null || echo "unknown")
    success "CLI installed successfully!"
    echo ""
    echo -e "${GREEN}Version: $DSA_VERSION${NC}"
    echo ""
    success "Installation complete!"
    echo ""
    echo -e "${BLUE}You can now use the 'dsa' command from anywhere:${NC}"
    echo "  dsa test"
    echo "  dsa submit"
    echo "  dsa --help"
    echo ""
else
    warning "CLI installed but 'dsa' command not found in PATH."
    echo ""
    echo "Try:"
    echo "  1. Restart your terminal"
    echo "  2. Or run: export PATH=\"\$(pnpm config get prefix)/bin:\$PATH\""
    echo "  3. Or add to your shell config: export PATH=\"\$(pnpm config get prefix)/bin:\$PATH\""
    echo ""
    echo "Then verify with: dsa --version"
fi

