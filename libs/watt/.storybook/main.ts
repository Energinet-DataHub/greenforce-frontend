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
import path from 'path';
import type { UserConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const config = {
  staticDirs: [
    {
      from: './assets',
      to: 'assets/watt',
    },
  ],

  stories: ['../package/**/*.mdx', '../package/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/angular',
    options: {},
  },

  core: {
    disableTelemetry: true,
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: undefined,
      },
    },
  },

  async viteFinal(config: UserConfig) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');
    const { default: angular } = await import('@analogjs/vite-plugin-angular');

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: [
          '@storybook/angular',
          '@storybook/angular/dist/client',
          '@angular/compiler',
          '@storybook/addon-docs/blocks',
          'tslib',
        ],
      },
      define: {
        STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: false }),
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern',
            loadPaths: [path.resolve(__dirname, '../package/core/styles')],
          },
        },
      },
      plugins: [
        angular({
          jit: true,
          tsconfig: './.storybook/tsconfig.json',
        }),
        nxViteTsPaths(),
      ],
    });
  },
};

export default config;
