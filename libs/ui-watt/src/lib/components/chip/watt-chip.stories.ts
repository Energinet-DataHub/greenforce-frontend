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
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { WattFilterChipComponent } from './watt-filter-chip.component';
import { WattMenuChipComponent } from './watt-menu-chip.component';

const meta: Meta<WattFilterChipComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Chips',
  component: WattFilterChipComponent,
  decorators: [
    moduleMetadata({
      imports: [WattMenuChipComponent],
    }),
  ],
};

export default meta;

export const Filter: StoryObj<WattFilterChipComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: var(--watt-space-s)">
        <watt-filter-chip label="Pending" />
        <watt-filter-chip label="Executing" />
        <watt-filter-chip label="Completed" />
        <watt-filter-chip label="Failed" />
      </div>
    `,
  }),
  args: {},
};

export const Choice: StoryObj<WattFilterChipComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: var(--watt-space-s)">
        <watt-filter-chip choice [selected]="true" label="Day" name="period" value="d" />
        <watt-filter-chip choice label="Week" name="period" value="w" />
        <watt-filter-chip choice label="Month" name="period" value="m" />
        <watt-filter-chip choice label="Quarter" name="period" value="q" />
        <watt-filter-chip choice label="Year" name="period" value="y" />
        <watt-filter-chip choice label="Custom" name="period" value="c" />
      </div>
    `,
  }),
  args: {},
};

export const Menu: StoryObj<WattMenuChipComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: var(--watt-space-s)">
        <watt-menu-chip label="Type" />
        <watt-menu-chip label="Grid Area" />
        <watt-menu-chip label="Period" />
      </div>
    `,
  }),
  args: {},
};
