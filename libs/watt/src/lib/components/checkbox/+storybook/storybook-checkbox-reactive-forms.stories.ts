import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { WattCheckboxComponent } from '../watt-checkbox.component';
import { StoryBookCheckboxRequiredComponent } from './storybook-checkbox-required.component';

const meta: Meta<WattCheckboxComponent> = {
  title: 'Components/Checkbox/Reactive Forms',
  component: WattCheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, WattCheckboxComponent, StoryBookCheckboxRequiredComponent],
    }),
  ],
};

export default meta;

const howToUseGuideBasic = `
How to use

1. Import ${WattCheckboxComponent.name} in a module

import { ${WattCheckboxComponent.name} } from '@energinet-datahub/watt/checkbox';

2. Create FormControl in a component

exampleFormControl = new FormControl(true);

3. Assign the FormControl to the checkbox component

<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`;

export const WithFormControl: StoryFn<WattCheckboxComponent> = () => ({
  props: {
    exampleFormControl: new FormControl(true),
  },
  template: `<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`,
});
WithFormControl.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

const howToUseGuideDisabled = `
How to use

1. Import ${WattCheckboxComponent.name} in a module

import { ${WattCheckboxComponent.name} } from '@energinet-datahub/watt/checkbox';

2. Create FormControl in a component

exampleFormControl = new FormControl({ value: true, disabled: true }),

3. Assign the FormControl to the checkbox component

<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`;

export const Disabled: StoryFn<WattCheckboxComponent> = () => ({
  props: {
    exampleFormControl: new FormControl({ value: true, disabled: true }),
  },
  template: `<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`,
});
Disabled.parameters = {
  docs: {
    source: {
      code: howToUseGuideDisabled,
    },
  },
};

export const Required: StoryFn<WattCheckboxComponent> = () => ({
  template: `<watt-storybook-checkbox-required /> `,
});

export const Indeterminate: StoryFn<WattCheckboxComponent> = () => ({
  props: {
    exampleFormControl: new FormControl({ value: null, disabled: false }),
  },
  template: `<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`,
});
