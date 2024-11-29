import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';

import { WATT_CARD, WATT_CARD_VARIANT, WattCardComponent } from './watt-card.component';
import { InputSignal } from '@angular/core';

const meta: Meta<WattCardComponent> = {
  title: 'Components/Card',
  component: WattCardComponent,
  decorators: [
    moduleMetadata({
      imports: [WATT_CARD],
    }),
  ],
};

export default meta;

export const WithTitle: StoryFn<WattCardComponent> = (args) => ({
  props: args,
  template: `
  <watt-card>
    <watt-card-title>
      <h3>Title</h3>
    </watt-card-title>

    Content
  </watt-card>
  `,
});

WithTitle.args = {};

export const WithoutTitle: StoryFn<WattCardComponent> = (args) => ({
  props: args,
  template: `
  <watt-card>
    Content
  </watt-card>
  `,
});

WithoutTitle.args = {};

export const CardWithVariant: StoryFn<WattCardComponent> = (args) => ({
  props: args,
  template: `
  <watt-card variant="${args.variant}">
    <watt-card-title>
      <h3>Title</h3>
    </watt-card-title>

    Content
  </watt-card>
  `,
});

CardWithVariant.args = {
  variant: 'solid' as unknown as InputSignal<WATT_CARD_VARIANT>,
};
