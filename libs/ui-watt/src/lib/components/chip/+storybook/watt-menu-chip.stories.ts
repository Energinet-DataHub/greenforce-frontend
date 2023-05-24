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

import { WattMenuChipComponent } from '../watt-menu-chip.component';

const meta: Meta<WattMenuChipComponent> = {
  title: 'Components/Chips/Menu',
  component: WattMenuChipComponent,
};

export default meta;

export const Overview: StoryFn<WattMenuChipComponent> = (args) => ({
  props: args,
  template: `<watt-menu-chip (toggle)="opened = !opened" [opened]="opened" [selected]="selected">Chip label</watt-menu-chip>`,
});

Overview.args = {
  opened: false,
  selected: false,
};
