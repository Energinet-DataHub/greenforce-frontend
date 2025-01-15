import path from 'path';
import type { UserConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  core: {
    disableTelementry: true,
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
          '@storybook/blocks',
          'tslib',
        ],
      },
      resolve: {
        alias: [
          {
            find: /^@energinet-datahub\/watt/,
            replacement: path.join(
              __dirname,
              '../src/lib/styles/@energinet-datahub/watt/_index.scss'
            ),
          },
          {
            find: /^@energinet-datahub\/watt\/utils/,
            replacement: path.join(
              __dirname,
              '../src/lib/styles/@energinet-datahub/watt/_utils.scss'
            ),
          },
        ],
      },
      // css: {
      //   preprocessorOptions: {
      //     scss: {
      //       loadPaths: [
      //         'libs/watt/src/lib/styles/_index.scss',
      //         'libs/watt/src/lib/styles/_utils.scss',
      //       ],
      //     },
      //   },
      // },
      plugins: [
        angular({
          jit: true,
          tsconfig: './.storybook/tsconfig.json',
        }),
        nxViteTsPaths(),
      ],
    });
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
