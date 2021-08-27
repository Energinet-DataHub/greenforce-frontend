import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { TypographyComponent } from './typography.component';

export default {
  title: 'Foundations/Typography',
  component: TypographyComponent,
  decorators: [
    moduleMetadata({
      imports: [MatTableModule, MatCardModule],
    })
  ],
} as Meta<TypographyComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<TypographyComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Typography = Template.bind({});