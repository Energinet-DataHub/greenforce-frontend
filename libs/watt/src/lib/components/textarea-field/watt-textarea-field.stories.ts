import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { WattIconComponent } from '../../foundations/icon/icon.component';
import { WattTextAreaFieldComponent } from './watt-textarea-field.component';
import { WattFieldComponent, WattFieldErrorComponent, WattFieldHintComponent } from '../field';
import { WattButtonComponent } from '../button';

const meta: Meta<WattTextAreaFieldComponent> = {
  title: 'Components/TextArea Field',
  component: WattTextAreaFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattTextAreaFieldComponent,
        WattIconComponent,
        WattFieldComponent,
        WattButtonComponent,
        WattFieldErrorComponent,
        WattFieldHintComponent,
      ],
    }),
  ],
};

export default meta;

const template = `<watt-textarea-field [label]="label" [required]="required" [placeholder]="placeholder" [formControl]="exampleFormControl" />
                  <p>Value: {{exampleFormControl.value}}</p>`;

const howToUseGuideBasic = `
How to use

1. Import ${WattTextAreaFieldComponent.name} in a component

import { ${WattTextAreaFieldComponent.name} } from '@energinet-datahub/watt/textarea-field';

2. Create FormControl in a component

exampleFormControl = new FormControl('');

3. Assign the FormControl to the input component

${template}`;

export const TextArea: StoryFn<WattTextAreaFieldComponent> = () => ({
  props: {
    label: 'TextArea',
    exampleFormControl: new FormControl(null),
  },
  template,
});

TextArea.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const WithDisabled: StoryFn<WattTextAreaFieldComponent> = () => ({
  props: {
    label: 'disabled',
    exampleFormControl: new FormControl({ value: null, disabled: true }),
  },
  template,
});

WithDisabled.parameters = {
  docs: {
    source: {
      code: `new FormControl({ value: null, disabled: true })`,
    },
  },
};

export const WithValue: StoryFn<WattTextAreaFieldComponent> = () => ({
  props: {
    label: 'withValue',
    exampleFormControl: new FormControl({ value: 'this is a value', disabled: false }),
  },
  template,
});

WithValue.parameters = {
  docs: {
    source: {
      code: `new FormControl({ value: 'this is a value', disabled: false })`,
    },
  },
};

export const WithPlaceholder: StoryFn<WattTextAreaFieldComponent> = () => ({
  props: {
    label: 'withPlaceholder',
    exampleFormControl: new FormControl(null),
    placeholder: "I'm a placeholder",
  },
  template,
});

export const WithRequired: StoryFn<WattTextAreaFieldComponent> = () => ({
  props: {
    label: 'required',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-textarea-field [required]="true" [label]="label" [placeholder]="placeholder" [formControl]="exampleFormControl" />`,
});

export const WithHint: StoryFn<WattTextAreaFieldComponent> = () => ({
  props: {
    label: 'hint',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-textarea-field [required]="true" [label]="label" [placeholder]="placeholder" [formControl]="exampleFormControl">
              <watt-field-error>This field is required</watt-field-error>
              <watt-field-hint>This is a hint</watt-field-hint>
            </watt-textarea-field>`,
});
