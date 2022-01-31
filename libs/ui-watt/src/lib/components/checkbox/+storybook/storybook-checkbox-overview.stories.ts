import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  StorybookCheckboxWrapperComponent,
  StorybookCheckboxWrapperScam,
} from './storybook-checkbox-wrapper.component';
import { WattCheckboxModule } from '../watt-checkbox.module';

export default {
  title: 'Components/Checkbox',
  component: StorybookCheckboxWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookCheckboxWrapperScam],
    }),
  ],
} as Meta<StorybookCheckboxWrapperComponent>;

const howToUseGuide = `
How to use with ReactiveForms

1. Import ${WattCheckboxModule.name}

import { ${WattCheckboxModule.name} } from '@energinet-datahub/watt';

2. Create new FormControl in a component

exampleFormControl = new FormControl({
  value: true,
  disabled: false,
});

3. Assign the FormControl to the checkbox component

<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`;

export const Checkbox: Story<StorybookCheckboxWrapperComponent> = (args) => ({
  props: args,
});
Checkbox.parameters = {
  docs: {
    source: {
      code: howToUseGuide,
    },
  },
};
