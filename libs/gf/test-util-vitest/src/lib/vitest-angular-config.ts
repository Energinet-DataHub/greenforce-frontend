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
import { getMswGlobalPolyfillPath } from './msw-global-polyfill-path';

interface VitestAngularConfigOptions {
  /**
   * The root directory of the library
   */
  root: string;
  /**
   * The path to the coverage output directory relative to workspace root
   */
  coveragePath: string;
  /**
   * Additional setup files to run before tests
   * @default ['src/test-setup.ts']
   */
  setupFiles?: string[];
  /**
   * Whether to enable MSW support with jsdom polyfills
   * @default false
   */
  enableMsw?: boolean;
}

/**
 * Creates a standard Vitest configuration for Angular libraries
 *
 * @example
 * ```typescript
 * import { defineConfig } from 'vite';
 * import analog from '@analogjs/vite-plugin-angular';
 * import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
 * import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
 * import { vitestAngularConfig } from '@energinet-datahub/gf/test-util-vitest';
 *
 * export default defineConfig(() => ({
 *   ...vitestAngularConfig({
 *     root: __dirname,
 *     coveragePath: 'coverage/libs/dh/my-lib',
 *     enableMsw: true,
 *   }),
 *   plugins: [
 *     analog(),
 *     nxViteTsPaths(),
 *     nxCopyAssetsPlugin(['*.md']),
 *   ],
 * }));
 * ```
 */
interface VitestConfig {
  root: string;
  cacheDir: string;
  resolve: {
    conditions: string[];
  };
  test: {
    watch: boolean;
    globals: boolean;
    environment: string;
    include: string[];
    setupFiles: string[];
    passWithNoTests: boolean;
    reporters: string[];
    coverage: {
      reportsDirectory: string;
      provider: 'v8';
    };
    pool?: string;
    execArgv?: string[];
    isolate?: boolean;
    maxWorkers?: number;
    server: {
      deps: {
        inline: RegExp[];
      };
    };
  };
}

export function vitestAngularConfig(options: VitestAngularConfigOptions): VitestConfig {
  const { root, coveragePath, setupFiles = ['src/test-setup.ts'], enableMsw = false } = options;

  const baseConfig: VitestConfig = {
    root,
    cacheDir: `${root}/../../../../node_modules/.vite/${coveragePath.replace('coverage/', '')}`,
    resolve: {
      conditions: ['development', 'browser'],
    },
    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      setupFiles,
      passWithNoTests: true,
      reporters: ['default'],
      coverage: {
        reportsDirectory: `${root}/../../../../${coveragePath}`,
        provider: 'v8' as const,
      },
      server: {
        deps: {
          inline: [/fesm2022/],
        },
      },
    },
  };

  // Add MSW support if enabled
  if (enableMsw) {
    baseConfig.test = {
      ...baseConfig.test,
      pool: 'forks',
      execArgv: ['--require', getMswGlobalPolyfillPath()],
      isolate: false,
      maxWorkers: 1,
    };
  }

  return baseConfig;
}
