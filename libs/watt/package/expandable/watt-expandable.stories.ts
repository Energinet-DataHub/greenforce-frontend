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

import { WattButtonComponent } from '@energinet/watt/button';

import { WattExpandableComponent } from './watt-expandable.component';

const meta: Meta<WattExpandableComponent> = {
  title: 'Components/Expandable',
  component: WattExpandableComponent,
  decorators: [
    moduleMetadata({
      imports: [WattExpandableComponent, WattButtonComponent],
    }),
  ],
  args: {
    labelExpanded: 'Skjul mulige handlinger',
    labelCollapsed: 'Vis mulige handlinger',
  },
  // The content slot is laid out as a flex row with a watt-space-sm gap.
  // For paragraph or full-width content, override the inner layout at the
  // call site (e.g. wrap children in a column container) so text does not
  // wrap unexpectedly.
  render: (args) => ({
    props: args,
    template: `
      <watt-expandable
        [(expanded)]="expanded"
        [labelExpanded]="labelExpanded"
        [labelCollapsed]="labelCollapsed"
      >
        <watt-button variant="secondary">Anmod om leveranceophør</watt-button>
        <watt-button variant="secondary">Annuller</watt-button>
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
