import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { WattBadgeComponent } from '../badge';
import {
  WattExpandableCardComponent,
  WATT_EXPANDABLE_CARD_COMPONENTS,
} from './watt-expandable-card.component';

export default {
  title: 'Components/Expandable Card',
  component: WattExpandableCardComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [WattBadgeComponent, WATT_EXPANDABLE_CARD_COMPONENTS],
    }),
  ],
} as Meta;

export const Overview: StoryFn<WattExpandableCardComponent> = (args) => ({
  props: args,
  template: `
    <watt-expandable-card [expanded]="expanded" [variant]="variant">
      <watt-badge size="large">02</watt-badge>
      <watt-expandable-card-title>The Cosmos Awaits</watt-expandable-card-title>
      <p>
        The sky calls to us preserve and cherish that pale blue dot citizens of
        distant epochs rich in heavy atoms the only home we've ever known cosmic
        fugue. Vanquish the impossible a mote of dust suspended in a sunbeam
        Sea of Tranquility Rig Veda invent the universe another world.
      </p>
    </watt-expandable-card>
  `,
});

Overview.args = {
  expanded: false,
  variant: 'elevation',
};

export const WithNestedCards: StoryFn<WattExpandableCardComponent> = (args) => ({
  props: args,
  template: `
    <watt-expandable-card [expanded]="expanded" [variant]="variant">
      <watt-expandable-card-title>Parent</watt-expandable-card-title>

      <watt-expandable-card [variant]="variant">
        <watt-expandable-card-title>Child 1</watt-expandable-card-title>

        <p>Child content 1</p>
      </watt-expandable-card>

      <watt-expandable-card [variant]="variant">
        <watt-expandable-card-title>Child 2</watt-expandable-card-title>

        <p>Child content 2</p>
      </watt-expandable-card>
    </watt-expandable-card>
  `,
});

WithNestedCards.args = {
  expanded: true,
  variant: 'solid',
};
