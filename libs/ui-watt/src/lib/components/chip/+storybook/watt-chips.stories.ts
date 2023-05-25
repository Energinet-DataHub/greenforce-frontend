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
import { StoryFn, Meta } from '@storybook/angular';

import { WattFilterChipComponent } from '../watt-filter-chip.component';

const meta: Meta<WattFilterChipComponent> = {
  title: 'Components/Chips/Choice',
  component: WattFilterChipComponent,
};

export default meta;

export const Overview: StoryFn<WattFilterChipComponent> = (args) => ({
  props: args,
  template: `
    <watt-filter-chip choice [selected]="true" name="period" value="d">Day</watt-filter-chip>
    <watt-filter-chip choice name="period" value="w">Week</watt-filter-chip>
    <watt-filter-chip choice name="period" value="m">Month</watt-filter-chip>
    <watt-filter-chip choice name="period" value="q">Quarter</watt-filter-chip>
    <watt-filter-chip choice name="period" value="y">Year</watt-filter-chip>
    <watt-filter-chip choice name="period" value="c">Custom</watt-filter-chip>
  `,
});

export const ChipLabel: StoryFn = () => ({
  template: `<span class="watt-chip-label">54</span>`,
});
