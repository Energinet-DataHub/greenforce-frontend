#!/usr/bin/env bash
set -euo pipefail

# Pre-warm the Node.js V8 compile cache to prevent the Nx extension from timing out.
#
# readable-stream v4 (a transitive dependency of nx via tar-stream → bl) takes 2+ seconds
# to parse and JIT-compile on the first load. Combined with its dependents, the full
# nx native module takes 4–6 seconds — exceeding the Nx language server's init timeout,
# which causes the "WorkspaceContext is not a constructor" error in VS Code.
#
# NODE_COMPILE_CACHE (Node.js 22.1+) persists V8 bytecode to disk so that subsequent
# loads complete in milliseconds. We pre-warm it here using VS Code's own bundled
# Node.js so the cache matches the binary the Nx extension host actually uses.

CACHE_DIR="${HOME}/.cache/node-compile-cache"
mkdir -p "${CACHE_DIR}"

WSROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NX_NATIVE="${WSROOT}/node_modules/nx/src/native/index.js"

if [[ ! -f "${NX_NATIVE}" ]]; then
  echo "Skipping Nx module cache warm-up (node_modules not yet installed)."
  exit 0
fi

# Warm the cache using VS Code's bundled Node.js — this is the binary that
# the nrwl.angular-console extension host (and nxls process) use.
VSCODE_NODE=""
for search_root in /vscode /home/node/.vscode-server; do
  VSCODE_NODE="$(find "${search_root}" -maxdepth 6 -name "node" -type f -executable 2>/dev/null | head -1 || true)"
  [[ -n "${VSCODE_NODE}" ]] && break
done
if [[ -n "${VSCODE_NODE}" ]]; then
  echo "Warming Nx module cache with VS Code Node.js ($(${VSCODE_NODE} --version))..."
  NODE_COMPILE_CACHE="${CACHE_DIR}" "${VSCODE_NODE}" -e "require('${NX_NATIVE}')" 2>/dev/null || true
fi

# Also warm using system Node.js so that CLI commands in the terminal are fast.
echo "Warming Nx module cache with system Node.js ($(node --version))..."
NODE_COMPILE_CACHE="${CACHE_DIR}" node -e "require('${NX_NATIVE}')" 2>/dev/null || true

echo "Nx module cache warm-up complete."
