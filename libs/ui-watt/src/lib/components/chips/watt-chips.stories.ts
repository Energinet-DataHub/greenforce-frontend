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

import { WattChipsComponent } from './watt-chips.component';
import { WattChipsModule } from './watt-chips.module';

export default {
  title: 'Components/Chips',
  component: WattChipsComponent,
  decorators: [
    moduleMetadata({
      imports: [WattChipsModule],
    }),
  ],
} as Meta<WattChipsComponent>;

export const Overview: Story<WattChipsComponent> = (args) => ({
  props: args,
});

Overview.args = {
  selection: 'day',
  options: [
    { label: 'Dag', value: 'day' },
    { label: 'Uge', value: 'week' },
    { label: 'Måned', value: 'month' },
    { label: 'Kvartal', value: 'quarter' },
    { label: 'Year', value: 'year' },
    { label: 'Brugerdefineret', value: 'custom' },
  ],
};
