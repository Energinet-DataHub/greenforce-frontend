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
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '..';

const meta: Meta<WattDescriptionListComponent<string>> = {
  title: 'Components/Description List',
  component: WattDescriptionListComponent,
  decorators: [
    moduleMetadata({
      imports: [WattDescriptionListComponent, WattDescriptionListItemComponent],
    }),
  ],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['flow', 'inline-flow', 'stack', 'compact'],
    },
    groupsPerRow: {
      control: { type: 'number', min: 1, max: 6 },
    },
    itemSeparators: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

const items = [
  { label: 'Name', value: 'John Doe' },
  { label: 'Email', value: 'john.doe@example.com' },
  { label: 'Phone', value: '+45 12 34 56 78' },
  { label: 'Address', value: 'Main Street 42' },
  { label: 'City', value: 'Copenhagen' },
  { label: 'Country', value: 'Denmark' },
];

const itemsTemplate = items
  .map((i) => `<watt-description-list-item label="${i.label}" [value]="'${i.value}'"></watt-description-list-item>`)
  .join('\n      ');

const Template: StoryFn<WattDescriptionListComponent<string>> = (args) => ({
  props: args,
  template: `
    <watt-description-list [variant]="variant" [groupsPerRow]="groupsPerRow" [itemSeparators]="itemSeparators">
      ${itemsTemplate}
    </watt-description-list>
  `,
});

// --- Default (interactive) ---

export const Default = Template.bind({});
Default.storyName = 'Default (Interactive)';
Default.args = {
  variant: 'flow',
  groupsPerRow: 3,
  itemSeparators: true,
};

// --- Flow ---

export const Flow: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <watt-description-list variant="flow" [groupsPerRow]="3">
      ${itemsTemplate}
    </watt-description-list>
  `,
});
Flow.storyName = 'Variant: Flow';

// --- Inline Flow ---

export const InlineFlow: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <watt-description-list variant="inline-flow" [groupsPerRow]="3">
      ${itemsTemplate}
    </watt-description-list>
  `,
});
InlineFlow.storyName = 'Variant: Inline Flow';

// --- Stack ---

export const Stack: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <watt-description-list variant="stack" [groupsPerRow]="3">
      ${itemsTemplate}
    </watt-description-list>
  `,
});
Stack.storyName = 'Variant: Stack';

// --- Compact ---

export const Compact: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <watt-description-list variant="compact" [groupsPerRow]="3">
      ${itemsTemplate}
    </watt-description-list>
  `,
});
Compact.storyName = 'Variant: Compact';

// --- Groups Per Row ---

export const GroupsPerRow: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <h4 style="margin-bottom: 8px">2 groups per row</h4>
    <watt-description-list variant="flow" [groupsPerRow]="2">
      ${itemsTemplate}
    </watt-description-list>

    <h4 style="margin: 24px 0 8px">3 groups per row (default)</h4>
    <watt-description-list variant="flow" [groupsPerRow]="3">
      ${itemsTemplate}
    </watt-description-list>

    <h4 style="margin: 24px 0 8px">4 groups per row</h4>
    <watt-description-list variant="flow" [groupsPerRow]="4">
      ${itemsTemplate}
    </watt-description-list>
  `,
});
// --- Without Item Separators ---

export const WithoutItemSeparators: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <watt-description-list variant="flow" [groupsPerRow]="3" [itemSeparators]="false">
      ${itemsTemplate}
    </watt-description-list>
  `,
});
// --- Force New Row ---

export const ForceNewRow: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <watt-description-list variant="flow" [groupsPerRow]="3">
      <watt-description-list-item label="Name" [value]="'John Doe'"></watt-description-list-item>
      <watt-description-list-item label="Email" [value]="'john.doe@example.com'"></watt-description-list-item>
      <watt-description-list-item label="Description" [value]="'This item is forced onto a new row'" [forceNewRow]="true"></watt-description-list-item>
      <watt-description-list-item label="City" [value]="'Copenhagen'"></watt-description-list-item>
      <watt-description-list-item label="Country" [value]="'Denmark'"></watt-description-list-item>
    </watt-description-list>
  `,
});
// --- Content Projection ---

export const ContentProjection: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <watt-description-list variant="flow" [groupsPerRow]="3">
      <watt-description-list-item label="Name">John Doe</watt-description-list-item>
      <watt-description-list-item label="Status">
        <span style="color: green; font-weight: bold;">● Active</span>
      </watt-description-list-item>
      <watt-description-list-item label="Role">
        <em>Administrator</em>
      </watt-description-list-item>
      <watt-description-list-item label="Phone">+45 12 34 56 78</watt-description-list-item>
      <watt-description-list-item label="City">Copenhagen</watt-description-list-item>
      <watt-description-list-item label="Country">Denmark</watt-description-list-item>
    </watt-description-list>
  `,
});
// --- Empty Value ---

export const EmptyValue: StoryFn<WattDescriptionListComponent<string>> = () => ({
  template: `
    <watt-description-list variant="flow" [groupsPerRow]="3">
      <watt-description-list-item label="Name" [value]="'John Doe'"></watt-description-list-item>
      <watt-description-list-item label="Middle Name" [value]="''"></watt-description-list-item>
      <watt-description-list-item label="Phone"></watt-description-list-item>
      <watt-description-list-item label="City" [value]="'Copenhagen'"></watt-description-list-item>
      <watt-description-list-item label="Country" [value]="'Denmark'"></watt-description-list-item>
    </watt-description-list>
  `,
});
