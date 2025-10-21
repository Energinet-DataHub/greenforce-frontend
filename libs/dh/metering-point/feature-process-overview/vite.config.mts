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
import { defineConfig } from 'vite';
import analog from '@analogjs/vite-plugin-angular';
import { resolve } from 'path';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

// Use the shared MSW polyfill path
const mswPolyfillPath = resolve(
  process.cwd(),
  'libs/gf/test-util-vitest/src/lib/msw-global-polyfill.js'
);

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/libs/dh/metering-point/feature-process-overview',
  plugins: [analog(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  resolve: {
    conditions: ['development', 'browser'],
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['tests/test-setup.ts'],
    passWithNoTests: true,
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/dh/metering-point/feature-process-overview',
      provider: 'v8' as const,
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        execArgv: ['--require', mswPolyfillPath],
      },
    },
    server: {
      deps: {
        inline: [/fesm2022/],
      },
    },
  },
}));
