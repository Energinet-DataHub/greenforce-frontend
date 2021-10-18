/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattIconComponent } from './../icon.component';

import { StorybookIconOverviewModule } from './storybook-icon-overview.module';

export default {
  title: 'Foundations/Icons',
  decorators: [
    moduleMetadata({
      imports: [StorybookIconOverviewModule],
    }),
  ],
  component: WattIconComponent
} as Meta<WattIconComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<WattIconComponent> = (args) => ({
  props: args,
  template: `<storybook-icon-overview></storybook-icon-overview>` 
});

//👇 Each story then reuses that template
export const icons = Template.bind({});
icons.parameters = {
  controls: { hideNoControlsWarning: true },
  docs: {
    source: {
      code: `1. Import WattIconModule in a module
import { WattIconModule } from '@energinet-datahub/watt';
      
2. Use <watt-icon name="ICON NAME" label="ICON DESCRIPTION" size="ICON SIZE"><watt-icon> in the component's HTML template`,
    },
  }
}
icons.argTypes = {
  label: {
    description: 'Description of the icon used for `aria-label`',
    control: false
  },
  name: {
    description: 'Name of the icon',
    control: false
  },
  size: {
    description: 'Size of the icon `WattIconSize`',
    defaultValue: 'Medium',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'Medium' },
    }
  }
}