import { Meta, StoryObj } from '@storybook/angular';

import { WattSearchComponent } from './watt-search.component';

const meta: Meta<WattSearchComponent> = {
  title: 'Components/Search',
  component: WattSearchComponent,
};

export default meta;

export const Overview: StoryObj<WattSearchComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; justify-content: end">
        <watt-search label="Search" />
      </div>
    `,
  }),
};
