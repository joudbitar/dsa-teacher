# DSA CLI Installation Script for Windows (PowerShell)
# Automates the installation of the DSA Lab CLI on Windows

$ErrorActionPreference = "Stop"

Write-Host "🚀 DSA CLI Installation" -ForegroundColor Blue
Write-Host ""

# Script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CliDir = Split-Path -Parent $ScriptDir

# Step 1: Check if Node.js is installed
Write-Host "ℹ️  Checking for Node.js..." -ForegroundColor Blue
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check Node.js version (need 18+)
$nodeMajorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajorVersion -lt 18) {
    Write-Host "❌ Error: Node.js version 18+ required. Found: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Step 2: Check if npm is installed
Write-Host "ℹ️  Checking for npm..." -ForegroundColor Blue
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

# Step 3: Check/Install pnpm
Write-Host "ℹ️  Checking for pnpm..." -ForegroundColor Blue
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm found: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  pnpm not found. Installing pnpm globally..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: Failed to install pnpm" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ pnpm installed" -ForegroundColor Green
}

# Step 4: Set up pnpm (if needed)
Write-Host "ℹ️  Setting up pnpm..." -ForegroundColor Blue
if (-not $env:PNPM_HOME) {
    Write-Host "ℹ️  Running pnpm setup..." -ForegroundColor Blue
    pnpm setup
    # Reload environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
}

# Step 5: Navigate to CLI directory
Write-Host "ℹ️  Navigating to CLI directory..." -ForegroundColor Blue
Set-Location $CliDir

# Step 6: Install CLI dependencies
Write-Host "ℹ️  Installing CLI dependencies..." -ForegroundColor Blue
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 7: Build TypeScript
Write-Host "ℹ️  Building TypeScript..." -ForegroundColor Blue
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to build TypeScript" -ForegroundColor Red
    exit 1
}

# Step 8: Install CLI globally
Write-Host "ℹ️  Linking CLI globally..." -ForegroundColor Blue
pnpm link --global
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to link CLI globally" -ForegroundColor Red
    exit 1
}

# Step 9: Verify installation
Write-Host "ℹ️  Verifying installation..." -ForegroundColor Blue
try {
    $dsaVersion = dsa --version 2>$null
    Write-Host "✅ CLI installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Version: $dsaVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Installation complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now use the 'dsa' command from anywhere:" -ForegroundColor Blue
    Write-Host "  dsa test"
    Write-Host "  dsa submit"
    Write-Host "  dsa --help"
    Write-Host ""
} catch {
    Write-Host "⚠️  CLI installed but 'dsa' command not found in PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Yellow
    Write-Host "  1. Restart your terminal/PowerShell"
    Write-Host "  2. Or refresh your PATH environment variable"
    Write-Host ""
    Write-Host "Then verify with: dsa --version"
}

