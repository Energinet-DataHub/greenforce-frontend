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
import { WattStorybookExpandableShowcaseComponent } from './+storybook/storybook-expandable-showcase.component';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
  'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

const meta: Meta<WattExpandableComponent> = {
  title: 'Components/Accordion link',
  component: WattExpandableComponent,
  decorators: [
    moduleMetadata({
      imports: [WattExpandableComponent, WattStorybookExpandableShowcaseComponent],
    }),
  ],
  args: {
    labelExpanded: 'Skjul indhold',
    labelCollapsed: 'Vis indhold',
  },
  // The content slot is laid out as a flex row with a watt-space-sm gap. A
  // single block child (paragraph, column container) renders fine; for
  // multiple inline children (buttons, chips) the flex-row gap kicks in.
  render: (args) => ({
    props: { ...args, lorem: LOREM },
    template: `
      <watt-expandable
        [(expanded)]="expanded"
        [labelExpanded]="labelExpanded"
        [labelCollapsed]="labelCollapsed"
      >
        <p>{{ lorem }}</p>
      </watt-expandable>
    `,
  }),
};

export default meta;

type Story = StoryObj<WattExpandableComponent>;

export const Overview: Story = {
  render: () => ({
    template: `<watt-storybook-expandable-showcase />`,
  }),
};

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
