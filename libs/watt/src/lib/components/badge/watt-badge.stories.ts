import { Meta, StoryFn } from '@storybook/angular';

import { WattBadgeComponent, WattBadgeSize } from './watt-badge.component';
import { InputSignal } from '@angular/core';

const meta: Meta<WattBadgeComponent> = {
  title: 'Components/Badge',
  component: WattBadgeComponent,
};

export default meta;

const Template: StoryFn<WattBadgeComponent> = (args) => ({
  props: args,
  template: `
    <div style="display: flex; gap: var(--watt-space-m);">
      <watt-badge type="neutral" [size]="size">Neutral</watt-badge>
      <watt-badge type="info" [size]="size">Info</watt-badge>
      <watt-badge type="success" [size]="size">Success</watt-badge>
      <watt-badge type="warning" [size]="size">Warning</watt-badge>
      <watt-badge type="danger" [size]="size">Danger</watt-badge>
      <watt-badge type="version" [size]="size">Version</watt-badge>
    </div>
  `,
});

export const Normal = Template.bind({});
Normal.args = { size: 'normal' as unknown as InputSignal<WattBadgeSize> };

export const Large = Template.bind({});
Large.args = { size: 'large' as unknown as InputSignal<WattBadgeSize> };
