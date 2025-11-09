#!/usr/bin/env bash

# Remote installer for the DSA Lab CLI without relying on npm publishes.
# Usage (replace <org> with your GitHub org or user):
#   curl -fsSL https://raw.githubusercontent.com/<org>/dsa-lab/main/scripts/install-cli.sh | bash
#
# Environment variables:
#   DSA_CLI_REPO    Git clone URL (default: https://github.com/<org>/dsa-lab)
#   DSA_CLI_REF     Git ref to install (default: main). Supports branches or tags.
#   DSA_CLI_HOME    Installation directory (default: ~/.local/share/dsa-cli)
#   DSA_CLI_BIN     Directory for the executable symlink (default: ~/.local/bin)

set -euo pipefail

info()  { printf '\033[0;34m[INFO]\033[0m %s\n' "$*"; }
warn()  { printf '\033[0;33m[WARN]\033[0m %s\n' "$*" >&2; }
error() { printf '\033[0;31m[ERROR]\033[0m %s\n' "$*" >&2; exit 1; }

REPO_URL_DEFAULT="https://github.com/joudbitar/dsa-teacher"
REPO_URL="${DSA_CLI_REPO:-$REPO_URL_DEFAULT}"
REPO_REF="${DSA_CLI_REF:-main}"
INSTALL_DIR="${DSA_CLI_HOME:-$HOME/.local/share/dsa-cli}"
BIN_DIR="${DSA_CLI_BIN:-$HOME/.local/bin}"
LOCAL_DIR="${DSA_CLI_LOCAL_DIR:-}"
USE_LOCAL_SOURCE=0

if [[ -n "$LOCAL_DIR" ]]; then
  USE_LOCAL_SOURCE=1
elif [[ "$REPO_URL" == "local" ]]; then
  SCRIPT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
  LOCAL_DIR="${SCRIPT_ROOT}/cli"
  USE_LOCAL_SOURCE=1
fi

if [[ $USE_LOCAL_SOURCE -eq 0 && "$REPO_URL" == *"<org>"* ]]; then
  error "Set DSA_CLI_REPO to your GitHub repository URL (e.g., https://github.com/acme/dsa-lab)."
fi

if [[ $USE_LOCAL_SOURCE -eq 0 ]]; then
  ARCHIVE_URL="${REPO_URL}/archive/refs/heads/${REPO_REF}.tar.gz"
  if [[ "$REPO_REF" == refs/tags/* ]]; then
    ARCHIVE_URL="${REPO_URL}/archive/${REPO_REF}.tar.gz"
  elif [[ "$REPO_REF" == v* ]]; then
    # Allow passing a tag like v0.1.0
    ARCHIVE_URL="${REPO_URL}/archive/refs/tags/${REPO_REF}.tar.gz"
  fi

  command -v curl >/dev/null 2>&1 || error "curl is required"
  command -v tar >/dev/null 2>&1 || error "tar is required"
fi
command -v node >/dev/null 2>&1 || error "Node.js 18+ is required"

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if (( NODE_MAJOR < 18 )); then
  error "Node.js 18 or newer is required (found $(node --version))"
fi

if ! command -v corepack >/dev/null 2>&1; then
  warn "corepack not found; attempting to enable via Node.js (>=16.10 ships with it)"
  if command -v npm >/dev/null 2>&1; then
    npm i -g corepack || warn "Failed to install corepack globally"
  fi
fi

USE_COREPACK=1
if [[ "${COREPACK_ENABLE:-1}" == "0" ]]; then
  USE_COREPACK=0
fi

ensure_corepack_pnpm() {
  info "Ensuring pnpm is available via corepack..."
  if ! corepack prepare pnpm@latest --activate >/dev/null 2>&1; then
    if ! corepack enable pnpm >/dev/null 2>&1; then
      return 1
    fi
  fi
  return 0
}

if [[ $USE_COREPACK -eq 1 ]]; then
  if command -v corepack >/dev/null 2>&1; then
    if ! ensure_corepack_pnpm; then
      warn "Corepack could not manage pnpm (permission issue?). Falling back to pnpm on PATH."
      USE_COREPACK=0
    fi
  else
    warn "Corepack not available; falling back to pnpm on PATH."
    USE_COREPACK=0
  fi
fi

if [[ $USE_COREPACK -eq 0 ]]; then
  command -v pnpm >/dev/null 2>&1 || error "pnpm is required when Corepack is unavailable"
  info "Using pnpm from PATH"
fi

run_pnpm() {
  if [[ $USE_COREPACK -eq 1 ]]; then
    corepack pnpm "$@"
  else
    pnpm "$@"
  fi
}

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [[ $USE_LOCAL_SOURCE -eq 1 ]]; then
  [[ -d "$LOCAL_DIR" ]] || error "Local CLI directory not found at ${LOCAL_DIR}"
  info "Copying CLI source from ${LOCAL_DIR}..."
  mkdir -p "$TMP_DIR/cli"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a "$LOCAL_DIR/" "$TMP_DIR/cli/"
  else
    cp -a "$LOCAL_DIR/." "$TMP_DIR/cli/"
  fi
  CLI_DIR="${TMP_DIR}/cli"
else
  info "Downloading CLI source from ${ARCHIVE_URL}..."
  curl -fsSL "$ARCHIVE_URL" | tar -xz -C "$TMP_DIR"

  ARCHIVE_FOLDER="$(find "$TMP_DIR" -maxdepth 1 -mindepth 1 -type d | head -n 1)"
  [[ -d "$ARCHIVE_FOLDER" ]] || error "Failed to extract archive"

  CLI_DIR="${ARCHIVE_FOLDER}/cli"
  [[ -d "$CLI_DIR" ]] || error "CLI directory not found in archive"
fi

info "Installing dependencies..."
pushd "$CLI_DIR" >/dev/null
run_pnpm install

info "Building CLI..."
run_pnpm build

info "Pruning dev dependencies..."
CI=1 run_pnpm prune --prod

info "Preparing installation directory at ${INSTALL_DIR}..."
rm -rf "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

if command -v rsync >/dev/null 2>&1; then
  rsync -a bin/ "$INSTALL_DIR/bin/"
  rsync -a dist/ "$INSTALL_DIR/dist/"
  rsync -a package.json "$INSTALL_DIR/"
  rsync -a pnpm-lock.yaml "$INSTALL_DIR/"
else
  cp -a bin "$INSTALL_DIR/"
  cp -a dist "$INSTALL_DIR/"
  cp package.json "$INSTALL_DIR/"
  cp pnpm-lock.yaml "$INSTALL_DIR/"
fi

popd >/dev/null

info "Installing production dependencies at ${INSTALL_DIR}..."
pushd "$INSTALL_DIR" >/dev/null
run_pnpm install --prod --frozen-lockfile
popd >/dev/null

mkdir -p "$BIN_DIR"
ln -sf "$INSTALL_DIR/bin/dsa" "$BIN_DIR/dsa"

if ! command -v dsa >/dev/null 2>&1; then
  warn "dsa command not detected on PATH. Ensure ${BIN_DIR} is in your PATH."
fi

VERSION="$("$BIN_DIR/dsa" --version 2>/dev/null || echo 'unknown')"
info "Installation complete. dsa version: ${VERSION}"
info "Add the following to your shell profile if needed:"
printf '  export PATH="%s:$PATH"\n' "$BIN_DIR"

