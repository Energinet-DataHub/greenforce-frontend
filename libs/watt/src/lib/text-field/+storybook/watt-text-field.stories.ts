/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTextFieldComponent } from '../watt-text-field.component';
import { WattFieldComponent, WattFieldErrorComponent, WattFieldHintComponent } from '../../field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  StorybookAutocompleteComponent,
  wattAutoCompleteTemplate,
} from './storybook-autocomplete.component';

const meta: Meta<WattTextFieldComponent> = {
  title: 'Components/Text Field',
  component: WattTextFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattTextFieldComponent,
        WattIconComponent,
        WattFieldComponent,
        WattButtonComponent,
        WattFieldErrorComponent,
        WattFieldHintComponent,
        StorybookAutocompleteComponent,
      ],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
};

export default meta;

const template = `<watt-text-field [label]="label" [required]="required" [type]="type" [placeholder]="placeholder" [formControl]="exampleFormControl" />
                  <p>Value: {{exampleFormControl.value}}</p>`;

const howToUseGuideBasic = `
How to use

1. Import ${WattTextFieldComponent.name} in a component

import { ${WattTextFieldComponent.name} } from '@energinet-datahub/watt/text-field';

2. Create FormControl in a component

exampleFormControl = new FormControl('');

3. Assign the FormControl to the input component

${template}`;

export const Input: StoryFn<WattTextFieldComponent> = () => ({
  props: {
    label: 'Input',
    exampleFormControl: new FormControl(null),
  },
  template,
});

Input.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const WithAutocomplete: StoryFn<WattTextFieldComponent> = () => ({
  template: `<watt-storybook-autocomplete />`,
});

WithAutocomplete.parameters = {
  docs: {
    source: {
      code: wattAutoCompleteTemplate,
    },
  },
};

export const WithDisabled: StoryFn<WattTextFieldComponent> = () => ({
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

export const WithValue: StoryFn<WattTextFieldComponent> = () => ({
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

export const WithPlaceholder: StoryFn<WattTextFieldComponent> = () => ({
  props: {
    label: 'withPlaceholder',
    exampleFormControl: new FormControl(null),
    placeholder: "I'm a placeholder",
  },
  template,
});

export const WithNumber: StoryFn<WattTextFieldComponent> = () => ({
  props: {
    label: 'number',
    exampleFormControl: new FormControl(null),
    type: 'number',
  },
  template,
});

export const WithRequired: StoryFn<WattTextFieldComponent> = () => ({
  props: {
    label: 'required',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-text-field [required]="true" [label]="label" [type]="type" [placeholder]="placeholder" [formControl]="exampleFormControl" />`,
});

export const WithPrefix: StoryFn<WattTextFieldComponent> = () => ({
  props: {
    label: 'Prefix',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-text-field prefix="search" [label]="label" [required]="required" [type]="type" [placeholder]="placeholder" [formControl]="exampleFormControl" />`,
});

export const WithSuffix: StoryFn<WattTextFieldComponent> = () => ({
  props: {
    label: 'Suffix',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-text-field [label]="label" [required]="required" [type]="type" [placeholder]="placeholder" [formControl]="exampleFormControl">
              <watt-button variant="icon" icon="search" />
             </watt-text-field>`,
});

export const WithHint: StoryFn<WattTextFieldComponent> = () => ({
  props: {
    label: 'hint',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-text-field [required]="true" [label]="label" [type]="type" [placeholder]="placeholder" [formControl]="exampleFormControl">
              <watt-field-error>This field is required</watt-field-error>
              <watt-field-hint>This is a hint</watt-field-hint>
            </watt-text-field>`,
});
