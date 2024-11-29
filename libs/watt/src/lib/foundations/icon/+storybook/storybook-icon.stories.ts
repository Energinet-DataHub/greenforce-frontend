import { HttpClientModule } from '@angular/common/http';
import { applicationConfig, Meta, StoryFn } from '@storybook/angular';

import { WattIconComponent } from '../icon.component';
import { WattIconSize } from '../watt-icon-size';
import { importProvidersFrom } from '@angular/core';
import { StorybookIconOverviewComponent } from './storybook-icon-overview.component';

const defaultIconSize: WattIconSize = 'm';

const meta: Meta<StorybookIconOverviewComponent> = {
  title: 'Foundations/Icons',
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(HttpClientModule)],
    }),
  ],
  component: StorybookIconOverviewComponent,
};

export default meta;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<WattIconComponent> = (args) => ({
  props: args,
  template: `<storybook-icon-overview></storybook-icon-overview>`,
});

//👇 Each story then reuses that template
export const Icons = Template.bind({});
Icons.parameters = {
  controls: { hideNoControlsWarning: true },
  docs: {
    source: {
      code: `1. Import WattIconComponent in a component
import { WattIconComponent } from '@energinet-datahub/watt/icon';

2. Use <watt-icon name="<name>" label="<description>" size="<size>"><watt-icon> in the component's HTML template`,
    },
  },
};
Icons.argTypes = {
  label: {
    description: 'Description of the icon used for `aria-label`',
    control: false,
  },
  name: {
    description: 'Name of the icon',
    control: false,
  },
  size: {
    description: 'Size of the icon `WattIconSize`',
    defaultValue: defaultIconSize,
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: defaultIconSize },
    },
  },
};
