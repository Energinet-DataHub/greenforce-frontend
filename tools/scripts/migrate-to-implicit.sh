#!/bin/bash
# Migration script for converting explicit libraries to implicit libraries
# This script flattens the library structure and removes redundant config files

set -e

migrate_library() {
  local lib_path="$1"
  
  if [ ! -d "$lib_path" ]; then
    echo "Error: Library path $lib_path does not exist"
    return 1
  fi
  
  if [ ! -d "$lib_path/src" ]; then
    echo "Skipping $lib_path - no src/ directory (may already be migrated)"
    return 0
  fi
  
  echo "Migrating: $lib_path"
  
  # 1. Move contents from src/ to root
  # Move index.ts
  if [ -f "$lib_path/src/index.ts" ]; then
    mv "$lib_path/src/index.ts" "$lib_path/index.ts"
  fi
  
  # Move lib/ directory contents
  if [ -d "$lib_path/src/lib" ]; then
    mv "$lib_path/src/lib/"* "$lib_path/" 2>/dev/null || true
    rmdir "$lib_path/src/lib" 2>/dev/null || true
  fi
  
  # Move test-setup.ts (will be handled by shared config, but keep for reference)
  if [ -f "$lib_path/src/test-setup.ts" ]; then
    rm "$lib_path/src/test-setup.ts"
  fi
  
  # Move any remaining files from src/
  for file in "$lib_path/src/"*; do
    if [ -f "$file" ]; then
      mv "$file" "$lib_path/" 2>/dev/null || true
    fi
  done
  
  # Remove empty src/ directory
  rmdir "$lib_path/src" 2>/dev/null || true
  
  # 2. Remove configuration files (now handled by shared configs)
  rm -f "$lib_path/project.json"
  rm -f "$lib_path/tsconfig.json"
  rm -f "$lib_path/tsconfig.lib.json"
  rm -f "$lib_path/tsconfig.spec.json"
  rm -f "$lib_path/vite.config.mts"
  rm -f "$lib_path/.eslintrc.json"
  
  echo "  ✓ Migrated $lib_path"
}

# Process arguments
if [ $# -eq 0 ]; then
  echo "Usage: $0 <library-path> [library-path...]"
  echo "Example: $0 libs/dh/admin/feature-user-management"
  exit 1
fi

for lib in "$@"; do
  migrate_library "$lib"
done

echo ""
echo "Migration complete!"
echo ""
echo "Next steps:"
echo "1. Update tsconfig.base.json paths (remove /src from paths)"
echo "2. Run 'nx reset' to clear cache"
echo "3. Run 'nx show project <project-name>' to verify"
echo "4. Run tests with 'nx test <project-name>'"
