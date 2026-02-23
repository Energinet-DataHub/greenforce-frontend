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
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, '../../../../');

// This library needs its own vite config because:
// 1. It uses vitest fixtures with `test.extend()` pattern (see tests/with-apollo.ts)
// 2. The @analogjs/vite-plugin-angular plugin interferes with vitest's ability
//    to detect tests when fixtures are used - tests show as "0 tests" even though
//    the test files contain valid describe/it blocks
// 3. Since this library only tests pure TypeScript Apollo functions (no Angular
//    components or templates), we don't need the Angular plugin at all

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: resolve(workspaceRoot, 'node_modules/.vite/libs/dh/shared/util-apollo'),

  plugins: [
    viteTsConfigPaths({
      root: workspaceRoot,
    }),
  ],

  test: {
    passWithNoTests: true,
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: [resolve(__dirname, 'tests/test-setup.ts')],
    reporters: ['default'],
    coverage: {
      reportsDirectory: resolve(workspaceRoot, 'coverage/libs/dh/shared/util-apollo'),
      provider: 'v8' as const,
    },
    pool: 'forks',
  },
}));
