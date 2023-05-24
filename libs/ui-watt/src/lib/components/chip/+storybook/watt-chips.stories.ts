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

import { WattChoiceChipComponent } from '../watt-choice-chip.component';

const meta: Meta<WattChoiceChipComponent> = {
  title: 'Components/Chips/Choice',
  component: WattChoiceChipComponent,
};

export default meta;

export const Overview: StoryFn<WattChoiceChipComponent> = (args) => ({
  props: args,
  template: `
    <watt-choice-chip [selected]="true" name="period" value="d">Day</watt-choice-chip>
    <watt-choice-chip name="period" value="w">Week</watt-choice-chip>
    <watt-choice-chip name="period" value="m">Month</watt-choice-chip>
    <watt-choice-chip name="period" value="q">Quarter</watt-choice-chip>
    <watt-choice-chip name="period" value="y">Year</watt-choice-chip>
    <watt-choice-chip name="period" value="c">Custom</watt-choice-chip>
  `,
});

export const ChipLabel: StoryFn = () => ({
  template: `<span class="watt-chip-label">54</span>`,
});
