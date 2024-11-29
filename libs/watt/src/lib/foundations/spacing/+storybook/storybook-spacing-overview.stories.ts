import { StoryFn, Meta } from '@storybook/angular';

import { StorybookSpacingOverviewComponent } from './storybook-spacing-overview.component';

const meta: Meta<StorybookSpacingOverviewComponent> = {
  title: 'Foundations/Spacing',
  component: StorybookSpacingOverviewComponent,
};

export default meta;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<StorybookSpacingOverviewComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Spacing = Template.bind({});
