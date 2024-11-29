import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { WattRadioComponent } from './watt-radio.component';
import { WattButtonComponent } from '../button';

const meta: Meta<WattRadioComponent> = {
  title: 'Components/Radio Button',
  component: WattRadioComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, WattRadioComponent, WattButtonComponent],
    }),
  ],
};

export default meta;

const template = `<div style="display: flex; gap: var(--watt-space-m); flex-direction: column; margin-bottom: var(--watt-space-m);">
  <watt-radio group="fav_framework" [formControl]="exampleFormControl" value="angular">Angular</watt-radio>
  <watt-radio group="fav_framework" [formControl]="exampleFormControl" value="react">React</watt-radio>
  <watt-radio group="fav_framework" [formControl]="exampleFormControl" value="svelte">Svelte</watt-radio>
</div><p>Value: {{exampleFormControl.value}}</p>`;

const howToUseGuideBasic = `
How to use

1. Import ${WattRadioComponent.name} in a module or component

import { ${WattRadioComponent.name} } from '@energinet-datahub/watt/radio';

2. Create FormControl in a component

exampleFormControl = new FormControl(true);

3. Assign the FormControl to the radio component

${template}`;

export const WithFormControl: StoryFn<WattRadioComponent> = () => ({
  props: {
    exampleFormControl: new FormControl(null),
  },
  template,
});
WithFormControl.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const Disabled: StoryFn<WattRadioComponent> = () => ({
  props: {
    exampleFormControl: new FormControl({ value: null, disabled: true }),
  },
  template,
});
Disabled.parameters = {
  docs: {
    source: {
      code: `new FormControl({ value: null, disabled: true })`,
    },
  },
};
