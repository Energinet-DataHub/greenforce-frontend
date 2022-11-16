import { setCompodocJson } from '@storybook/addon-docs/angular';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import wattTheme from './theme';

import docJson from '../documentation.json';
setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: wattTheme,
    inlineStories: true,
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  chromatic: { disableSnapshot: true },
  options: {
    storySort: {
      order: [
        'Foundations',
        [
          'Colors',
          'Typography',
          'Icons',
          'Spacing',
          'Grids',
          'Accessibility',
          'Formats',
        ],
        'Components',
        'Utils',
      ],
    },
  },
};
