import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { WattModule } from '../../ui-watt.module';
import { AutocompleteComponent } from './autocomplete.component';

export default {
  title: 'Components/Autocomplete',
  component: AutocompleteComponent,
  decorators: [
    moduleMetadata({
      imports: [WattModule],
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
