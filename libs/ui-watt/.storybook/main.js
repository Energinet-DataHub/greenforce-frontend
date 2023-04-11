module.exports = {
  staticDirs: [{
    from: '../src/assets',
    to: 'assets/ui-watt'
  }],
  stories: ['../src/lib/intro.stories.mdx', '../src/lib/**/*.stories.mdx', '../src/lib/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-essentials', '@storybook/addon-interactions', 'storybook-addon-pseudo-states', "@storybook/addon-mdx-gfm"],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  docs: {
    autodocs: true
  }
};