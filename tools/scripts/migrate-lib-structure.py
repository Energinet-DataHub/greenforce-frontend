# Copyright 2020 Energinet DataHub A/S
#
# Licensed under the Apache License, Version 2.0 (the "License2");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#!/usr/bin/env python3
"""
Migrate all libraries under libs/dh and libs/gf to the canonical structure
matching libs/dh/developer/feature-examples.

Canonical structure:
  <lib>/
    index.ts               <- public API at ROOT
    src/                   <- implementation only
    tests/
      test-setup.ts
      *.spec.ts
    tsconfig.json
    tsconfig.lib.json
    tsconfig.spec.json
    vite.config.mts
    .eslintrc.json
    project.json
"""
import os
import re
import shutil
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
LIBS = ROOT / "libs"

LICENSE_HEADER = """//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion"""

TEST_SETUP_CONTENT_DH = """{license}
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';

import '@testing-library/jest-dom/vitest';

import {{ setUpTestbed }} from '@energinet-datahub/gf/test-util-staging';

setUpTestbed();
""".format(license=LICENSE_HEADER)

# gf/util-browser cannot use setUpTestbed (circular dep) - handled separately
TEST_SETUP_CONTENT_GF = """{license}
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';

import '@testing-library/jest-dom/vitest';

import {{ setUpTestbed }} from '@energinet-datahub/gf/test-util-staging';

setUpTestbed();
""".format(license=LICENSE_HEADER)

# Libraries to skip entirely
SKIP_LIBS = {
    "libs/watt",
    "libs/dh/shared/domain",
    "libs/dh/shared/feature-graphql-codegen",
    "libs/dh/admin/data-access-graphql",
    "libs/dh/core/data-access-graphql",
    "libs/dh/esett/data-access-graphql",
    "libs/dh/message-archive/data-access-graphql",
    "libs/dh/profile/data-access-graphql",
    "libs/dh/wholesale/data-access-graphql",
    "libs/dh/shared/assets",
    "libs/dh/globalization/assets-localization",
    "libs/dh/shared/feature-highlight",   # web worker lib, no vite
    "libs/dh/shared/navigation",          # no tests, no vite
    "libs/dh/core/routing",               # no TS source / no vite
    "libs/dh/market-participant/domain",  # has tsconfig.json but no references
    "libs/dh/admin/shared",               # bare stub
    "libs/gf/msw/e2e-util-msw",          # cypress lib
    "libs/gf/msw/util-msw",              # no tsconfig
    "libs/dh/developer/feature-examples", # already canonical
    "libs/dh/developer/feature-operation", # already canonical
}

# Libraries that already have a canonical tests/ setup and root index.ts
ALREADY_CANONICAL = {
    "libs/dh/developer/feature-examples",
    "libs/dh/developer/feature-operation",
}

def rel_path_to_base(lib_path: Path) -> str:
    """Get the relative path prefix to workspace root (e.g. '../../../../')"""
    parts = lib_path.relative_to(ROOT).parts  # e.g. ('libs', 'dh', 'admin', 'shell')
    return "../" * len(parts)

def get_outdir_prefix(lib_path: Path) -> str:
    parts = lib_path.relative_to(ROOT).parts
    return "../" * len(parts) + "dist/out-tsc"

def get_base_extends(lib_path: Path) -> str:
    parts = lib_path.relative_to(ROOT).parts
    return "../" * len(parts) + "tsconfig.base.json"

def get_eslint_extends(lib_path: Path) -> str:
    parts = lib_path.relative_to(ROOT).parts
    return "../" * len(parts) + ".eslintrc.json"

def get_vite_cache_dir(lib_path: Path) -> str:
    rel = lib_path.relative_to(ROOT)  # e.g. libs/dh/admin/shell
    parts = rel.parts
    prefix = "../" * len(parts) + "node_modules/.vite/"
    return prefix + str(rel).replace("\\", "/")

def get_vite_coverage_dir(lib_path: Path) -> str:
    rel = lib_path.relative_to(ROOT)
    parts = rel.parts
    prefix = "../" * len(parts) + "coverage/"
    return prefix + str(rel).replace("\\", "/")

def is_gf_lib(lib_path: Path) -> bool:
    return lib_path.relative_to(ROOT).parts[1] == "gf"

def is_non_angular_lib(lib_path: Path) -> bool:
    """Libraries that don't use Angular components (no @nx/angular eslint plugin needed)."""
    non_angular = {
        "libs/gf/globalization/configuration-danish-locale",
        "libs/gf/globalization/data-access-localization",
        "libs/gf/globalization/domain",
        "libs/gf/test-util",
        "libs/gf/test-util-matchers",
        "libs/gf/test-util-staging",
        "libs/gf/test-util-vitest",
        "libs/gf/msw/test-util-msw",
        "libs/dh/message-archive/domain",
        "libs/dh/wholesale/domain",
        "libs/dh/shared/environments",
        "libs/dh/shared/util-assert",
        "libs/dh/shared/util-operators",
        "libs/dh/shared/util-text",
        "libs/dh/shared/util-reports",
        "libs/dh/globalization/configuration-localization",
        "libs/dh/globalization/configuration-watt-translation",
    }
    return str(lib_path.relative_to(ROOT)) in non_angular

def write_tsconfig_json(lib_path: Path):
    base = get_base_extends(lib_path)
    outdir = get_outdir_prefix(lib_path)
    content = {
        "extends": base,
        "compilerOptions": {
            "target": "es2022",
            "useDefineForClassFields": False,
            "forceConsistentCasingInFileNames": True,
            "strict": True,
            "noImplicitOverride": True,
            "noPropertyAccessFromIndexSignature": False,
            "noImplicitReturns": True,
            "noFallthroughCasesInSwitch": True
        },
        "files": [],
        "include": [],
        "references": [
            {"path": "./tsconfig.lib.json"},
            {"path": "./tsconfig.spec.json"}
        ],
        "angularCompilerOptions": {
            "enableI18nLegacyMessageIdFormat": False,
            "strictInjectionParameters": True,
            "strictInputAccessModifiers": True,
            "strictTemplates": True
        }
    }
    write_json(lib_path / "tsconfig.json", content)

def write_tsconfig_lib_json(lib_path: Path):
    outdir = get_outdir_prefix(lib_path)
    content = {
        "extends": "./tsconfig.json",
        "compilerOptions": {
            "outDir": outdir,
            "declaration": True,
            "declarationMap": True,
            "inlineSources": True,
            "types": []
        },
        "exclude": ["tests/**/*.spec.ts", "tests/test-setup.ts", "vite.config.mts", "tests/**/*.test.ts"],
        "include": ["src/**/*.ts"]
    }
    write_json(lib_path / "tsconfig.lib.json", content)

def write_tsconfig_spec_json(lib_path: Path):
    outdir = get_outdir_prefix(lib_path)
    content = {
        "extends": "./tsconfig.json",
        "compilerOptions": {
            "outDir": outdir,
            "module": "ESNext",
            "target": "es2020",
            "types": ["vitest/globals", "node"]
        },
        "files": ["tests/test-setup.ts"],
        "include": ["vite.config.mts", "tests/**/*.test.ts", "tests/**/*.spec.ts"]
    }
    write_json(lib_path / "tsconfig.spec.json", content)

def write_vite_config(lib_path: Path):
    cache_dir = get_vite_cache_dir(lib_path)
    coverage_dir = get_vite_coverage_dir(lib_path)
    content = f"""{LICENSE_HEADER}
/// <reference types='vitest' />
/// <reference types="vitest/config" />
import {{ defineConfig }} from 'vite';
import angular from '@analogjs/vite-plugin-angular';

import {{ nxViteTsPaths }} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import {{ nxCopyAssetsPlugin }} from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({{
  root: __dirname,
  cacheDir: '{cache_dir}',
  plugins: [
    angular({{ tsconfig: './tsconfig.json' }}),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
  test: {{
    passWithNoTests: true,
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: [
      'src/**/*.{{test,spec}}.{{js,mjs,cjs,ts,mts,cts,jsx,tsx}}',
      'tests/**/*.{{test,spec}}.{{js,mjs,cjs,ts,mts,cts,jsx,tsx}}',
    ],
    setupFiles: ['tests/test-setup.ts'],
    reporters: ['default'],
    coverage: {{
      reportsDirectory: '{coverage_dir}',
      provider: 'v8' as const,
    }},
    pool: 'forks',
    isolate: false,
    maxWorkers: 1,
    server: {{
      deps: {{
        inline: [/fesm2022/],
      }},
    }},
  }},
}}));
"""
    (lib_path / "vite.config.mts").write_text(content)
    print(f"  wrote vite.config.mts")

def write_eslintrc(lib_path: Path):
    extends_path = get_eslint_extends(lib_path)
    # Check if lib already has a custom .eslintrc.json with extra rules we should preserve
    eslint_path = lib_path / ".eslintrc.json"
    if eslint_path.exists():
        try:
            existing = json.loads(eslint_path.read_text())
            # Check for custom rules beyond the standard template
            for override in existing.get("overrides", []):
                rules = override.get("rules", {})
                std_keys = {
                    "@angular-eslint/directive-selector",
                    "@angular-eslint/component-selector"
                }
                extra_keys = set(rules.keys()) - std_keys
                if extra_keys:
                    print(f"  SKIP .eslintrc.json (has custom rules: {extra_keys})")
                    # Just update the extends path
                    existing["extends"] = [extends_path]
                    write_json(eslint_path, existing)
                    return
            # Check for custom ignorePatterns
            if len(existing.get("ignorePatterns", ["!**/*"])) > 1:
                print(f"  SKIP .eslintrc.json (has custom ignorePatterns)")
                existing["extends"] = [extends_path]
                write_json(eslint_path, existing)
                return
        except Exception as e:
            print(f"  WARN: could not parse .eslintrc.json: {e}")
            return

    prefix = "gf" if is_gf_lib(lib_path) else "dh"
    content = {
        "extends": [extends_path],
        "ignorePatterns": ["!**/*"],
        "overrides": [
            {
                "files": ["*.ts"],
                "extends": [
                    "plugin:@nx/angular",
                    "plugin:@angular-eslint/template/process-inline-templates"
                ],
                "rules": {
                    "@angular-eslint/directive-selector": [
                        "error",
                        {"type": "attribute", "prefix": prefix, "style": "camelCase"}
                    ],
                    "@angular-eslint/component-selector": [
                        "error",
                        {"type": "element", "prefix": prefix, "style": "kebab-case"}
                    ]
                }
            },
            {
                "files": ["*.html"],
                "extends": ["plugin:@nx/angular-template"],
                "rules": {}
            }
        ]
    }
    write_json(eslint_path, content)
    print(f"  wrote .eslintrc.json")

def write_json(path: Path, content: dict):
    path.write_text(json.dumps(content, indent=2) + "\n")
    print(f"  wrote {path.name}")

def ensure_tests_dir_with_setup(lib_path: Path):
    """Ensure tests/ directory exists with test-setup.ts."""
    tests_dir = lib_path / "tests"
    tests_dir.mkdir(exist_ok=True)
    setup_file = tests_dir / "test-setup.ts"
    if setup_file.exists():
        print(f"  tests/test-setup.ts already exists")
        return

    # Check if src/test-setup.ts exists — move it
    src_setup = lib_path / "src" / "test-setup.ts"
    if src_setup.exists():
        content = src_setup.read_text()
        setup_file.write_text(content)
        src_setup.unlink()
        print(f"  moved src/test-setup.ts -> tests/test-setup.ts")
    else:
        # Check for non-standard name
        for name in ["test-setup-vitest.ts"]:
            alt = lib_path / "src" / name
            if alt.exists():
                content = alt.read_text()
                setup_file.write_text(content)
                alt.unlink()
                print(f"  moved src/{name} -> tests/test-setup.ts")
                return
        # Create a new test-setup.ts
        if is_gf_lib(lib_path):
            # Check if it's util-browser (circular dep case)
            rel = str(lib_path.relative_to(ROOT))
            if "util-browser" in rel:
                setup_content = f"""{LICENSE_HEADER}
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';

import '@testing-library/jest-dom/vitest';

import {{ getTestBed }} from '@angular/core/testing';
import {{ BrowserTestingModule, platformBrowserTesting }} from '@angular/platform-browser/testing';

// Note: Cannot use setUpTestbed from gf/test-util-staging as it would create a circular dependency
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
"""
            else:
                setup_content = TEST_SETUP_CONTENT_GF
        else:
            setup_content = TEST_SETUP_CONTENT_DH
        setup_file.write_text(setup_content)
        print(f"  created tests/test-setup.ts")

def move_spec_files_to_tests(lib_path: Path):
    """Move all *.spec.ts and *.test.ts from src/ to tests/ preserving relative paths."""
    src_dir = lib_path / "src"
    tests_dir = lib_path / "tests"
    if not src_dir.exists():
        return

    moved = []
    for spec_file in sorted(src_dir.rglob("*.spec.ts")) + sorted(src_dir.rglob("*.test.ts")):
        # Compute relative path from src/
        rel = spec_file.relative_to(src_dir)
        dest = tests_dir / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(spec_file), str(dest))
        moved.append(str(rel))

    if moved:
        print(f"  moved {len(moved)} spec file(s) from src/ to tests/: {moved}")

def ensure_root_index(lib_path: Path):
    """Move src/index.ts to root index.ts if needed."""
    root_index = lib_path / "index.ts"
    src_index = lib_path / "src" / "index.ts"

    if root_index.exists():
        print(f"  index.ts already at root")
        return

    if src_index.exists():
        content = src_index.read_text()
        root_index.write_text(content)
        src_index.unlink()
        print(f"  moved src/index.ts -> index.ts")
    else:
        print(f"  WARN: no index.ts found in src/ or root")

def update_tsconfig_base_paths(lib_path: Path):
    """Update tsconfig.base.json to remove /src from paths for this lib."""
    tsconfig_base = ROOT / "tsconfig.base.json"
    content = tsconfig_base.read_text()
    rel = str(lib_path.relative_to(ROOT)).replace("\\", "/")
    # Replace `libs/dh/.../src/index.ts` with `libs/dh/.../index.ts`
    pattern = f'"{rel}/src/index.ts"'
    replacement = f'"{rel}/index.ts"'
    if pattern in content:
        content = content.replace(pattern, replacement)
        tsconfig_base.write_text(content)
        print(f"  updated tsconfig.base.json path for {rel}")
    else:
        # Check if already updated
        if f'"{rel}/index.ts"' in content:
            print(f"  tsconfig.base.json path already updated for {rel}")
        else:
            print(f"  WARN: could not find tsconfig.base.json path for {rel}")

def find_all_libs():
    """Find all library directories that have a project.json under libs/dh and libs/gf."""
    libs = []
    for product in ["dh", "gf"]:
        product_dir = LIBS / product
        if not product_dir.exists():
            continue
        for project_json in sorted(product_dir.rglob("project.json")):
            lib_dir = project_json.parent
            rel = str(lib_dir.relative_to(ROOT))
            if rel in SKIP_LIBS:
                continue
            libs.append(lib_dir)
    return libs

def migrate_lib(lib_path: Path):
    rel = str(lib_path.relative_to(ROOT))
    print(f"\n=== Migrating: {rel} ===")

    # 1. Ensure root index.ts
    ensure_root_index(lib_path)

    # 2. Ensure tests/ dir with test-setup.ts
    ensure_tests_dir_with_setup(lib_path)

    # 3. Move spec files from src/ to tests/
    move_spec_files_to_tests(lib_path)

    # 4. Write canonical tsconfig.json (only if it exists — some libs may not have one)
    if (lib_path / "tsconfig.json").exists():
        write_tsconfig_json(lib_path)

    # 5. Write canonical tsconfig.lib.json
    if (lib_path / "tsconfig.lib.json").exists():
        write_tsconfig_lib_json(lib_path)

    # 6. Write canonical tsconfig.spec.json
    if (lib_path / "tsconfig.spec.json").exists():
        write_tsconfig_spec_json(lib_path)
    else:
        # Create tsconfig.spec.json (needed for canonical structure)
        write_tsconfig_spec_json(lib_path)
        # Also add reference to tsconfig.json if it exists
        tsconfig_path = lib_path / "tsconfig.json"
        if tsconfig_path.exists():
            data = json.loads(tsconfig_path.read_text())
            refs = data.get("references", [])
            spec_ref = {"path": "./tsconfig.spec.json"}
            if spec_ref not in refs:
                refs.append(spec_ref)
                data["references"] = refs
                write_json(tsconfig_path, data)

    # 7. Write canonical vite.config.mts
    write_vite_config(lib_path)

    # 8. Update .eslintrc.json extends path
    if (lib_path / ".eslintrc.json").exists():
        write_eslintrc(lib_path)

    # 9. Update tsconfig.base.json path
    update_tsconfig_base_paths(lib_path)


def main():
    libs = find_all_libs()
    print(f"Found {len(libs)} libraries to migrate")
    for lib in libs:
        migrate_lib(lib)

    print("\n\nDone! Please verify with: nx run-many -t lint,test")

if __name__ == "__main__":
    main()
