import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';

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

const Template: StoryFn = (args) => ({
  props: args,
  template: `
    <watt-description-list [variant]=variant [groupsPerRow]=groupsPerRow>
      <watt-description-list-item label="Label 1" value="Value 1"></watt-description-list-item>
      <watt-description-list-item label="Label 2" value="Value 2" [forceNewRow]=forceNewRow></watt-description-list-item>
      <watt-description-list-item label="Label 3" value="Value 3"></watt-description-list-item>
      <watt-description-list-item label="Label 4" value="Value 4"></watt-description-list-item>
      <watt-description-list-item label="Label 5" value="Value 5"></watt-description-list-item>
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
