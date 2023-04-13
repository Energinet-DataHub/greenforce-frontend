import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import docJson from '../documentation.json';
setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      story: {
        inline: true,
      },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    chromatic: { disableSnapshot: true },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Colors', 'Typography', 'Icons', 'Spacing', 'Grids', 'Accessibility', 'Formats'],
          'Components',
          'Utils',
        ],
      },
    },
  },
};

export default preview;
