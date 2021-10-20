import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattExpansionComponent, WattExpansionModule } from './../index';

export default {
  title: 'Components/Expansion Panel',
  decorators: [
    moduleMetadata({
      imports: [WattExpansionModule],
    }),
  ],
  component: WattExpansionComponent,
} as Meta<WattExpansionComponent>;

export const expansionPanel: Story<WattExpansionComponent> = (args) => ({
  props: args,
});
