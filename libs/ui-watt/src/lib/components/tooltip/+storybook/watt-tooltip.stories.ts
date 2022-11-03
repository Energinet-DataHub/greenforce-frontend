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
import { moduleMetadata, Story } from '@storybook/angular';

import { WattButtonModule } from '../../button';

import { WattTooltipComponent } from '../watt-tooltip.component';
import { WattTooltipDirective } from '../watt-tooltip.directive';

export default {
  title: 'Components/Tooltip',
  decorators: [
    moduleMetadata({
      imports: [WattButtonModule, WattTooltipDirective, WattTooltipComponent],
    }),
  ],
};

export const Overview: Story = (args) => ({
  props: args,
  template: `
    <h1>Example</h1>
    <watt-button
      wattTooltip="Click me"
      wattTooltipPosition="right"
      #button
    >Button</watt-button>

    <h2>Positions</h2>

    <section style="margin-top: 3rem; display: flex; justify-content: center;">
    <div #positions style="padding: 3rem 10rem; border: 1px dotted var(--watt-color-neutral-grey-600);"></div>
    </section>

    <watt-tooltip text="top-start" position="top-start" style="opacity: 1;" [target]="positions"></watt-tooltip>
    <watt-tooltip text="top" position="top" style="opacity: 1;" [target]="positions"></watt-tooltip>
    <watt-tooltip text="top-end" position="top-end" style="opacity: 1;" [target]="positions"></watt-tooltip>

    <watt-tooltip text="bottom-start" position="bottom-start" style="opacity: 1;" [target]="positions"></watt-tooltip>
    <watt-tooltip text="bottom" position="bottom" style="opacity: 1;" [target]="positions"></watt-tooltip>
    <watt-tooltip text="bottom-end" position="bottom-end" style="opacity: 1;" [target]="positions"></watt-tooltip>

    <watt-tooltip text="right" position="right" style="opacity: 1;" [target]="positions"></watt-tooltip>
    <watt-tooltip text="left" position="left" style="opacity: 1;" [target]="positions"></watt-tooltip>
  `,
});
