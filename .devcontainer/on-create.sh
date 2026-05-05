#!/usr/bin/env bash
set -euo pipefail

# ── Git ──────────────────────────────────────────────────────────────────────
# Mark the workspace as safe so git stops warning about Windows paths
# inherited from the host .gitconfig.
git config --global --add safe.directory /workspaces/greenforce-frontend

# Fix ownership of .NET build cache files that may have been created as root
# by a previous container build, preventing dotnet watch from writing to them.
sudo chown -R node:node /workspaces/greenforce-frontend/apps/dh/api-dh/source/DataHub.WebApi/obj 2>/dev/null || true

# ── Bun ──────────────────────────────────────────────────────────────────────
# Install the exact Bun version pinned in mise.toml / package.json.
BUN_VERSION="1.3.10"
echo "Installing Bun ${BUN_VERSION}..."
curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}"

# Make bun available on PATH for subsequent lifecycle commands and terminals.
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
if ! grep -q 'BUN_INSTALL' ~/.bashrc 2>/dev/null; then
  echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
  echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
fi

echo "Bun $(bun --version) installed successfully."

