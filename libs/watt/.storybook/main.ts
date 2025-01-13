import type { UserConfig } from 'vite';

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
    },
  },
  async viteFinal(config: UserConfig) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');
    const { default: angular } = await import('@analogjs/vite-plugin-angular');

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['@storybook/blocks', 'tslib'],
      },
      plugins: [
        angular({
          jit: true,
          tsconfig: '.storybook/tsconfig.json',
        }),
      ],
    });
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
