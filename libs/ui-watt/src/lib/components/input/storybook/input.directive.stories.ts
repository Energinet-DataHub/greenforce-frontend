import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormFieldModule } from '../../form-field/form-field.module';

import { InputModule } from '../input.module';
import { InputComponent } from './input.component';

export default {
  title: 'Components/Input',
  component: InputComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, MatFormFieldModule, MatInputModule, InputModule, FormFieldModule],
    }),
  ],
} as Meta<InputComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<InputComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Input = Template.bind({});

Input.args = {};
