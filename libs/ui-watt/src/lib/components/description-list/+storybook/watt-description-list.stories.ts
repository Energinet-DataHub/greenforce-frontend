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
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '../watt-description-list.component';

export default {
  title: 'Components/Description List',
  decorators: [
    moduleMetadata({
      imports: [WattDescriptionListComponent, WattDescriptionListItemComponent],
    }),
  ],
} as Meta;

const Template: Story = (args) => ({
  props: args,
  template: `
    <watt-description-list [variant]=variant [groupsPerRow]=groupsPerRow>
      <watt-description-list-item label="Label 1" value="Value 1"></watt-description-list-item>
      <watt-description-list-item label="Label 2" value="Value 2" [forceNewRow]=forceNewRow></watt-description-list-item>
      <watt-description-list-item label="Label 3" value="Value 3"></watt-description-list-item>
      <watt-description-list-item label="Label 4" value="Value 4"></watt-description-list-item>
    </watt-description-list>
  `,
});

export const Default = Template.bind({});

Default.argTypes = {
  variant: {
    control: {
      type: 'radio',
      options: ['flow', 'stack'],
    },
  },
};

Default.args = {
  groupsPerRow: 3,
  variant: 'flow',
};

export const ForceNewRow = Template.bind({});

ForceNewRow.args = {
  forceNewRow: true,
  groupsPerRow: 3,
  variant: 'flow',
};
