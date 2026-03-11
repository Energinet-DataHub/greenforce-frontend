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
 * Shared Vitest config for all implicit `gf` libs.
 *
 * Per-lib variation is communicated via environment variables set by the
 * `implicit-libs` Nx plugin (tools/plugins/implicit-libs.ts):
 *
 *   VITEST_ENVIRONMENT   – "happy-dom" | "node"  (default: "happy-dom")
 *   VITEST_USE_ANGULAR   – "true" | "false"       (default: "true")
 *
 * Vitest runs each lib with `cwd` set to the lib's project root, so
 * `process.cwd()` here always equals the lib's root directory.
 */
export default defineConfig(() => {
  const libRoot = process.cwd();
  const workspaceRoot = join(libRoot, '../../../..');
  const libRelative = relative(workspaceRoot, libRoot); // e.g. "libs/gf/shared/util-browser"

  const environment = (process.env['VITEST_ENVIRONMENT'] ?? 'happy-dom') as 'happy-dom' | 'node';
  const useAngular = process.env['VITEST_USE_ANGULAR'] !== 'false';

  const setupFile = join(libRoot, 'tests/test-setup.ts');
  const setupFiles = existsSync(setupFile) ? ['tests/test-setup.ts'] : [];

  const angularPlugins = useAngular ? [angular({ tsconfig: './tsconfig.json' })] : [];

  // Angular libs need forks pool + Zone.js-safe settings
  const angularTestOptions = useAngular
    ? {
        pool: 'forks' as const,
        isolate: false,
        maxWorkers: 1,
        server: { deps: { inline: [/fesm2022/] } },
      }
    : {};

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
      ...angularTestOptions,
    },
  };
});
