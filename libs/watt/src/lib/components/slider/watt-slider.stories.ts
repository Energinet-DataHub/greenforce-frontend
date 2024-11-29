import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';

import { WattSliderComponent } from './watt-slider.component';

const meta: Meta<WattSliderComponent> = {
  title: 'Components/Slider',
  component: WattSliderComponent,
  decorators: [
    moduleMetadata({
      imports: [WattSliderComponent],
    }),
  ],
};

export default meta;

export const Overview: StoryFn<WattSliderComponent> = (args) => ({
  props: args,
});

Overview.args = {
  value: { min: 0, max: 100 },
};
