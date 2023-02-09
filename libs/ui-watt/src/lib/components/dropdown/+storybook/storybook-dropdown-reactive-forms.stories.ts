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
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WattFormFieldModule } from '../../form-field/form-field.module';
import { WattDropdownModule } from '../watt-dropdown.module';
import { WattDropdownComponent } from '../watt-dropdown.component';
import { WattDropdownOption } from '../watt-dropdown-option';

const dropdownOptions: WattDropdownOption[] = [
  { value: 'outlaws', displayValue: 'The Outlaws' },
  { value: 'batman', displayValue: 'Batman' },
  { value: 'titans', displayValue: 'Titans' },
  { value: 'volt', displayValue: 'Volt' },
  { value: 'joules', displayValue: 'Joules' },
];

export default {
  title: 'Components/Dropdown/Reactive Forms',
  component: WattDropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        WattDropdownModule,
        WattFormFieldModule,
      ],
    }),
  ],
} as Meta<WattDropdownComponent>;

const howToUseGuideBasic = `
 How to use

 1. Import ${WattDropdownModule.name} in a module

 import { ${WattDropdownModule.name} } from '@energinet-datahub/watt/dropdown';

 2a. Create FormControl in a component and define dropdown options.

 exampleFormControl = new FormControl(null);

 2b. Define dropdown options by using the WattDropdownOption interface

 options: WattDropdownOption[] = [{ value: 'example', displayValue: 'Example' }]

 3. Assign the FormControl and options to the dropdown component

 <watt-dropdown [formControl]="exampleFormControl" [options]="options"></watt-dropdown>

 4. Wrap the dropdown component in a "watt-form-field"

 <watt-form-field>
  <watt-dropdown [formControl]="exampleFormControl" [options]="options"></watt-dropdown>
 </watt-form-field>`;

export const singleSelect: Story<WattDropdownComponent> = (
  args: Partial<WattDropdownComponent>
) => ({
  props: {
    exampleFormControl: new FormControl(null),
    options: args.options,
    placeholder: args.placeholder,
  },
  template: `<watt-form-field>
    <watt-dropdown
      [formControl]="exampleFormControl"
      [placeholder]="placeholder"
      [options]="options"></watt-dropdown>
  </watt-form-field>`,
});
singleSelect.args = {
  options: dropdownOptions,
  placeholder: 'Select a team',
};
singleSelect.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const multiSelect: Story<WattDropdownComponent> = (
  args: Partial<WattDropdownComponent>
) => ({
  props: {
    exampleFormControl: new FormControl(null),
    options: args.options,
    placeholder: args.placeholder,
    noOptionsFoundLabel: args.noOptionsFoundLabel,
  },
  template: `<watt-form-field>
    <watt-dropdown
      [multiple]="true"
      [formControl]="exampleFormControl"
      [placeholder]="placeholder"
      [noOptionsFoundLabel]="noOptionsFoundLabel"
      [options]="options"></watt-dropdown>
  </watt-form-field>`,
});
multiSelect.args = {
  options: dropdownOptions,
  placeholder: 'Select a team',
  noOptionsFoundLabel: 'No team found.',
};
multiSelect.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const withLabel: Story<WattDropdownComponent> = () => ({
  props: {
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-form-field>
    <watt-label>Label</watt-label>
    <watt-dropdown [formControl]="exampleFormControl"></watt-dropdown>
  </watt-form-field>`,
});
withLabel.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const withValidation: Story<WattDropdownComponent> = () => ({
  props: {
    exampleFormControl: new FormControl(null, Validators.required),
    options: dropdownOptions,
  },
  template: `<watt-form-field>
    <watt-label>Label</watt-label>

    <watt-dropdown [formControl]="exampleFormControl" [options]="options"></watt-dropdown>

    <watt-error *ngIf="exampleFormControl.errors?.required">
      Field is required
    </watt-error>
  </watt-form-field>`,
});
withValidation.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};
