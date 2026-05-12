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
import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';

import { WattExpandableComponent } from './watt-expandable.component';
import { WATT_EXPANDABLE } from './index';

const meta: Meta<WattExpandableComponent> = {
  title: 'Components/Expandable',
  component: WattExpandableComponent,
  decorators: [
    moduleMetadata({
      imports: [WATT_EXPANDABLE],
    }),
  ],
  args: {
    labelExpanded: 'Skjul mulige handlinger',
    labelCollapsed: 'Vis mulige handlinger',
  },
  render: (args) => ({
    props: args,
    template: `
      <watt-expandable
        [(expanded)]="expanded"
        [labelExpanded]="labelExpanded"
        [labelCollapsed]="labelCollapsed"
      >
        <p>Her er en kort beskrivelse af de mulige handlinger.</p>
      </watt-expandable>
    `,
  }),
};

export default meta;

type Story = StoryObj<WattExpandableComponent>;

export const Collapsed: Story = {
  args: {
    expanded: false,
  },
};

export const Expanded: Story = {
  args: {
    expanded: true,
  },
};
