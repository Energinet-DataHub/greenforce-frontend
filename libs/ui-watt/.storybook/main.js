module.exports = {
  core: { builder: 'webpack5' },

  stories: [
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', {
    name: '@storybook/addon-storysource',
    options: {
      loaderOptions: {
        injectStoryParameters: false,
      },
    },
  }]
};
