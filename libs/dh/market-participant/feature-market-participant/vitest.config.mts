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
import { existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

/**
 * Walk upward from `startDir` until a directory containing `nx.json` is found.
 * Falls back to `NX_WORKSPACE_ROOT` (set by `nx run`) when present so that
 * the config is correct regardless of the working directory it is evaluated from.
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
 * Per-lib Vitest config for feature-market-participant.
 *
 * This lib uses MSW in tests and requires two extra settings not present in
 * the shared product-level config (`libs/dh/vite.config.mts`):
 *
 *   1. resolve.conditions: ['development', 'browser']
 *      — resolves MSW's browser entry (needed by transitive MSW imports)
 *
 *   2. execArgv: ['--require', mswPolyfillPath]
 *      — polyfills TransformStream / ReadableStream / WritableStream in each
 *        Node worker process before any test code runs
 */
const mswPolyfillPath = resolve(
  import.meta.dirname,
  '../../../../libs/gf/shared/test-util-vitest/src/msw-global-polyfill.js'
);

export default defineConfig(() => {
  const libRoot = process.cwd();
  const workspaceRoot = findWorkspaceRoot(libRoot);
  const libRelative = relative(workspaceRoot, libRoot);

  const setupFile = join(libRoot, 'tests/test-setup.ts');
  const setupFiles = existsSync(setupFile) ? ['tests/test-setup.ts'] : [];

  const tsconfig = existsSync(join(libRoot, 'tsconfig.spec.json'))
    ? './tsconfig.spec.json'
    : './tsconfig.json';

  return {
    root: libRoot,
    cacheDir: join(workspaceRoot, 'node_modules/.vite', libRelative),
    plugins: [angular({ tsconfig }), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    resolve: {
      conditions: ['development', 'browser'],
    },
    test: {
      passWithNoTests: true,
      watch: false,
      globals: true,
      environment: 'happy-dom',
      include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
      ...(setupFiles.length ? { setupFiles } : {}),
      reporters: ['default'],
      coverage: {
        reportsDirectory: join(workspaceRoot, 'coverage', libRelative),
        provider: 'v8' as const,
      },
      pool: 'forks' as const,
      execArgv: ['--require', mswPolyfillPath],
    },
  };
});
