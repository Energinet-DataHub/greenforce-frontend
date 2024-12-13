import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
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

  tags: ['autodocs']
};

export default preview;
