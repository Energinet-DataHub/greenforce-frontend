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
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WattBadgeModule } from '../badge';
import {
  WattExpandableCardComponent,
  WATT_EXPANDABLE_CARD_COMPONENTS,
} from './watt-expandable-card.component';

export default {
  title: 'Components/Expandable Card',
  component: WattExpandableCardComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        WattBadgeModule,
        WATT_EXPANDABLE_CARD_COMPONENTS,
      ],
    }),
  ],
} as Meta;

export const Overview: Story<WattExpandableCardComponent> = (args) => ({
  props: args,
  template: `
    <watt-expandable-card [expanded]="expanded">
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
};
