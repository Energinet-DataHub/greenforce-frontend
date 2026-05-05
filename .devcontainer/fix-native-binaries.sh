#!/usr/bin/env bash
set -euo pipefail

# Bun sometimes truncates optional platform-specific native binaries during
# install (a known bug with optionalDependencies). This script detects and
# re-downloads any corrupted .node files so that tooling (Vite, Rollup, etc.)
# works correctly inside the dev container.

WSROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${WSROOT}"

fix_native_package() {
  local pkg_dir="$1"
  local pkg_name="$2"

  local node_file
  node_file="$(find "${pkg_dir}" -name '*.node' -maxdepth 1 2>/dev/null | head -1)"
  [[ -z "${node_file}" ]] && return 0

  local version
  version="$(node -p "require('./${pkg_dir}/package.json').version" 2>/dev/null || echo "")"
  [[ -z "${version}" ]] && return 0

  local expected_size
  expected_size="$(npm view "${pkg_name}@${version}" dist.unpackedSize 2>/dev/null || echo "")"
  [[ -z "${expected_size}" ]] && return 0

  local actual_size
  actual_size="$(stat -c%s "${node_file}" 2>/dev/null || echo "0")"

  # If the binary is less than half the expected size, it's likely truncated.
  if (( actual_size * 2 < expected_size )); then
    echo "Fixing truncated native binary: ${pkg_name}@${version} (${actual_size} vs ${expected_size} bytes)"

    local tgz
    tgz="$(npm pack "${pkg_name}@${version}" 2>/dev/null | tail -1)"
    if [[ -f "${tgz}" ]]; then
      tar xzf "${tgz}"
      cp package/*.node "${pkg_dir}/"
      rm -rf package "${tgz}"
      echo "  Fixed: $(stat -c%s "${node_file}") bytes"
    fi
  fi
}

# Check platform-specific packages that bun is known to truncate.
for pkg_dir in node_modules/@rollup/rollup-linux-x64-gnu; do
  if [[ -d "${pkg_dir}" ]]; then
    pkg_name="$(node -p "require('./${pkg_dir}/package.json').name" 2>/dev/null || true)"
    [[ -n "${pkg_name}" ]] && fix_native_package "${pkg_dir}" "${pkg_name}"
  fi
done

echo "Native binary check complete."
