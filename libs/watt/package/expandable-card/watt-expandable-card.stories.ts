//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { WattBadgeComponent } from '../badge';
import { WattExpandableCardComponent } from './watt-expandable-card.component';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from './index';

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
  argTypes: {
    variant: {
      options: ['elevation', 'solid'],
      control: { type: 'radio' },
    },
    togglePosition: {
      options: ['before', 'after'],
      control: { type: 'radio' },
    },
  },
} as Meta;

export const Overview: StoryFn<WattExpandableCardComponent> = (args) => ({
  props: args,
  template: `
    <watt-expandable-card [expanded]="expanded" [variant]="variant" [togglePosition]="togglePosition">
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
  togglePosition: 'after',
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
  togglePosition: 'after',
};
