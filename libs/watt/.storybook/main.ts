import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  staticDirs: [
    {
      from: '../src/assets',
      to: 'assets/watt',
    },
  ],
  stories: ['../**/*.mdx', '../**/*.stories.@(js|ts)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-pseudo-states',
    '@storybook/addon-mdx-gfm',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

export default config;
