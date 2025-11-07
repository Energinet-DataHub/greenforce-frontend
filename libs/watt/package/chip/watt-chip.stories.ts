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
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { WattFilterChipComponent } from './watt-filter-chip.component';
import { WattMenuChipComponent } from './watt-menu-chip.component';
import { WattActionChipComponent } from './watt-action-chip.component';
import { WattChipComponent } from './watt-chip.component';

const meta: Meta = {
  title: 'Components/Chips',
  decorators: [
    moduleMetadata({
      imports: [
        WattChipComponent,
        WattMenuChipComponent,
        WattActionChipComponent,
        WattFilterChipComponent,
      ],
    }),
  ],
};

export default meta;

export const Filter: StoryObj<WattFilterChipComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: var(--watt-space-s)">
        <watt-filter-chip>Pending</watt-filter-chip>
        <watt-filter-chip>Executing</watt-filter-chip>
        <watt-filter-chip>Completed</watt-filter-chip>
        <watt-filter-chip>Failed</watt-filter-chip>
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
        <watt-filter-chip choice [selected]="true" name="period" value="d">Day</watt-filter-chip>
        <watt-filter-chip choice name="period" value="w">Week</watt-filter-chip>
        <watt-filter-chip choice name="period" value="m">Month</watt-filter-chip>
        <watt-filter-chip choice name="period" value="q">Quarter</watt-filter-chip>
        <watt-filter-chip choice name="period" value="y">Year</watt-filter-chip>
        <watt-filter-chip choice name="period" value="c">Custom</watt-filter-chip>
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
        <watt-menu-chip>Type</watt-menu-chip>
        <watt-menu-chip>Grid Area</watt-menu-chip>
        <watt-menu-chip>Period</watt-menu-chip>
      </div>
    `,
  }),
  args: {},
};

export const Action: StoryObj<WattActionChipComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: var(--watt-space-s)">
        <watt-action-chip [icon]="icon">data.dk</watt-action-chip>
        <watt-action-chip [icon]="icon">todo.dk</watt-action-chip>
        <watt-action-chip [icon]="icon">funny.dk</watt-action-chip>
        <watt-action-chip [icon]="icon">domain.dk</watt-action-chip>
      </div>
    `,
  }),
  args: {
    icon: 'remove',
  },
};

export const Disabled: StoryObj<WattChipComponent> = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--watt-space-s)">
        <watt-chip [disabled]="true">data.dk</watt-chip>
        <watt-chip [disabled]="true">todo.dk</watt-chip>
        <watt-chip [disabled]="true">funny.dk</watt-chip>
        <watt-chip [disabled]="true">domain.dk</watt-chip>
      </div>
    `,
  }),
};

export const Readonly: StoryObj<WattChipComponent> = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--watt-space-s)">
        <watt-chip [readonly]="true">data.dk</watt-chip>
        <watt-chip [readonly]="true">todo.dk</watt-chip>
        <watt-chip [readonly]="true">funny.dk</watt-chip>
        <watt-chip [readonly]="true">domain.dk</watt-chip>
      </div>
    `,
  }),
};

export const Enabled: StoryObj<WattChipComponent> = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--watt-space-s)">
        <watt-chip>data.dk</watt-chip>
        <watt-chip>todo.dk</watt-chip>
        <watt-chip>funny.dk</watt-chip>
        <watt-chip>domain.dk</watt-chip>
      </div>
    `,
  }),
};
