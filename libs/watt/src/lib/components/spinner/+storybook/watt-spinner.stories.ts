import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { WattSpinnerComponent } from '../index';

const meta: Meta<WattSpinnerComponent> = {
  title: 'Components/Spinner',
  decorators: [
    moduleMetadata({
      imports: [WattSpinnerComponent],
    }),
  ],
  component: WattSpinnerComponent,
};

export default meta;

export const Spinner: StoryFn<WattSpinnerComponent> = (args) => ({
  props: args,
});
