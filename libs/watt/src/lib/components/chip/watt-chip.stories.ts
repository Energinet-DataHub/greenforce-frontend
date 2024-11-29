import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { WattFilterChipComponent } from './watt-filter-chip.component';
import { WattMenuChipComponent } from './watt-menu-chip.component';
import { WattActionChipComponent } from './watt-action-chip.component';
import { InputSignal } from '@angular/core';
import { WattIcon } from '@energinet-datahub/watt/icon';

const meta: Meta<WattFilterChipComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Chips',
  component: WattFilterChipComponent,
  decorators: [
    moduleMetadata({
      imports: [WattMenuChipComponent, WattActionChipComponent],
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
    icon: 'remove' as unknown as InputSignal<WattIcon>,
  },
};
