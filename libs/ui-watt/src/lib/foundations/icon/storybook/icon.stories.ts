import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { WattIconModule } from '../icon.module';
import { StorybookIconOverviewComponent } from './storybook-icon-overview.component';

export default {
  title: 'Foundations/Icons',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, WattIconModule],
    }),
  ],
  component: StorybookIconOverviewComponent
} as Meta<StorybookIconOverviewComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<StorybookIconOverviewComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const icons = Template.bind({});