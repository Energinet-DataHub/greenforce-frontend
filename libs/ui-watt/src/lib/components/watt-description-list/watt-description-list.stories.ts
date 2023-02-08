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

import { WattDescriptionListComponent } from './watt-description-list.component';

export default {
  title: 'Components/WattDescriptionList',
  decorators: [
    moduleMetadata({
      imports: [WattDescriptionListComponent],
    }),
  ],
} as Meta;

export const Overview: Story<WattDescriptionListComponent> = (args) => ({
  props: args,
  template: `
    <watt-description-list [groups]="groups" [groupsPerRow]="groupsPerRow"></watt-description-list>
  `,
});

Overview.args = {
  groups: [
    { term: 'Term 1', description: 'Description 1' },
    { term: 'Term 2', description: 'Description 2' },
    { term: 'Term 3', description: 'Description 3', forceNewRow: true },
    { term: 'Term 4', description: 'Description 4' },
    { term: 'Term 5', description: 'Description 5' },
  ],
  groupsPerRow: 3,
};

Overview.argTypes = {
  groups: {
    description: '`WattDescriptionListGroups`',
    table: {
      defaultValue: { summary: '[]' },
    },
  },
  groupsPerRow: {
    table: {
      defaultValue: { summary: 3 },
    },
    description: 'Number of groups per row',
  },
};
