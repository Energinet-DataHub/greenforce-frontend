module.exports = {
  core: { builder: 'webpack5' },
  // Ideally, the `to` property should be set to 'assets/ui-watt'
  // so the assets don't have to be placed in a nested "ui-watt" folder.
  // But due to a path issue on Windows
  // this is not working properly in Storybook v6.4.x
  // See https://github.com/storybookjs/storybook/issues/17271
  //
  // The bug is fixed in Storybook v6.5.x.
  // TODO: Refactor once we upgrade to v6.5.x
  // Remember to adjust "app-dh/project.json" file.
  staticDirs: [{ from: '../src/assets', to: 'assets' }],
  stories: [
    '../src/lib/intro.stories.mdx',
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
};
