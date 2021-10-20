import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattSpinnerComponent, WattSpinnerModule } from './../index';

export default {
  title: 'Components/Spinner',
  decorators: [
    moduleMetadata({
      imports: [WattSpinnerModule],
    }),
  ],
  component: WattSpinnerComponent,
} as Meta<WattSpinnerComponent>;

export const Spinner: Story<WattSpinnerComponent> = (args) => ({
  props: args,
});
