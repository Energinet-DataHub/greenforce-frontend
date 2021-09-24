import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteModule } from './autocomplete.module';

export default {
  title: 'Components/Autocomplete',
  component: AutocompleteComponent,
  decorators: [
    moduleMetadata({
      imports: [AutocompleteModule],
    }),
  ],
} as Meta<AutocompleteComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<AutocompleteComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Autocomplete = Template.bind({});

Autocomplete.args = {
  label: 'Numbers',
  placeholder: 'Pick a number',
  options: ['1', '2', '3'],
};
