//#region License
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
//#endregion
/// <reference types='vitest' />
/// <reference types="vitest/config" />
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

/**
 * Walk upward from `startDir` until a directory containing `nx.json` is found.
 * Falls back to `NX_WORKSPACE_ROOT` (set by `nx run`) when present so that
 * the config is correct regardless of the working directory it is evaluated from
 * (e.g. when used via vitest.workspace.ts or run from a product-level directory).
 */
function findWorkspaceRoot(startDir: string): string {
  if (process.env['NX_WORKSPACE_ROOT']) return process.env['NX_WORKSPACE_ROOT'];
  let dir = startDir;
  for (;;) {
    if (existsSync(join(dir, 'nx.json'))) return dir;
    const parent = join(dir, '..');
    if (parent === dir) return startDir; // filesystem root — give up
    dir = parent;
  }
}

/**
 * Shared Vitest config for all implicit `gf` libs.
 *
 * Per-lib variation is communicated via environment variables set by the
 * `implicit-libs` Nx plugin (tools/plugins/implicit-libs.ts):
 *
 *   VITEST_ENVIRONMENT   – "happy-dom" | "node"  (default: "happy-dom")
 *   VITEST_USE_ANGULAR   – "true" | "false"       (default: "true")
 *
 * HOW THIS CONFIG IS INVOKED
 * --------------------------
 * This file must only be used via `nx run <lib>:test`, which sets
 * `process.cwd()` to the individual lib's root directory. The `root`,
 * `include`, and `setupFiles` options are all derived from `process.cwd()`
 * at runtime — they point at the lib being tested, not at this file's
 * location on disk.
 *
 * DO NOT add this file to vitest.workspace.ts (or test.projects).
 * When Vitest loads a workspace entry it sets `process.cwd()` to the
 * workspace root, so `root` would resolve to the workspace root and
 * `include: ['src/**\/*.spec.ts', 'tests/**\/*.spec.ts']` would find 0 tests.
 *
 * To run all gf lib tests use:
 *   nx run-many -t test --projects="tag:gf"
 */
export default defineConfig(() => {
  const libRoot = process.cwd();
  const workspaceRoot = findWorkspaceRoot(libRoot);
  const libRelative = relative(workspaceRoot, libRoot); // e.g. "libs/gf/shared/util-browser"

  const environment = (process.env['VITEST_ENVIRONMENT'] ?? 'happy-dom') as 'happy-dom' | 'node';
  const useAngular = process.env['VITEST_USE_ANGULAR'] !== 'false';

  const setupFile = join(libRoot, 'tests/test-setup.ts');
  const setupFiles = existsSync(setupFile) ? ['tests/test-setup.ts'] : [];

  // Use the shared product-level tsconfig.spec.json for Angular compilation
  const tsconfig = '../../tsconfig.spec.json';

  const angularPlugins = useAngular ? [angular({ tsconfig })] : [];

  return {
    root: libRoot,
    cacheDir: join(workspaceRoot, 'node_modules/.vite', libRelative),
    plugins: [...angularPlugins, nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    test: {
      passWithNoTests: true,
      watch: false,
      globals: true,
      environment,
      include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
      ...(setupFiles.length ? { setupFiles } : {}),
      reporters: ['default'],
      coverage: {
        reportsDirectory: join(workspaceRoot, 'coverage', libRelative),
        provider: 'v8' as const,
      },
      pool: 'forks' as const,
      // One worker so the Vite server's in-memory transform cache warms up
      // after the first file and is reused for all subsequent files — avoids
      // re-compiling Angular fesm2022 packages for every test file.
      maxWorkers: 1,
      // Run test files sequentially (one at a time) to maximise Vite cache reuse.
      fileParallelism: false,
      // Share the module graph across all test files in a single run so that
      // Angular is initialized once rather than once per file.
      isolate: false,
      server: {
        deps: {
          // Inline Angular fesm2022 packages through Vite's transform pipeline so the
          // Angular compiler runs once in the Vite server process (shared across all
          // forks) rather than being re-run in every forked worker process.
          inline: [/fesm2022/],
        },
      },
    },
  };
});
