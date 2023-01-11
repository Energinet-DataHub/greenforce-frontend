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
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WattFormFieldModule } from '../../form-field/form-field.module';
import { WattDropdownModule } from '../watt-dropdown.module';
import { WattDropdownComponent } from '../watt-dropdown.component';
import { WattDropdownOption } from '../watt-dropdown-option';

const dropdownOptions: WattDropdownOption[] = [
  { value: 'mightyDucks', displayValue: 'Mighty Ducks' },
  { value: 'batman', displayValue: 'Batman' },
  { value: 'titans', displayValue: 'Titans' },
  { value: 'volt', displayValue: 'Volt' },
  { value: 'joules', displayValue: 'Joules' },
];

export default {
  title: 'Components/Dropdown/Template-driven Forms',
  component: WattDropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
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

 2a. Create model in a component for single selection

 singleSelectionModel = '';

 2b. Create model in a component for multi selection

 multiSelectionModel: string[] | null = null;

 3. Define dropdown options by using the WattDropdownOption interface

 options: WattDropdownOption[] = [{ value: 'example', displayValue: 'Example' }]

 4. Assign the model and options to the dropdown component

 <watt-dropdown [(ngModel)]="singleSelectionModel" [options]="options"></watt-dropdown>

 5. Wrap the dropdown component in a "watt-form-field"

 <watt-form-field>
  <watt-dropdown [(ngModel)]="singleSelectionModel" [options]="options"></watt-dropdown>
 </watt-form-field>`;

export const singleSelect: Story<WattDropdownComponent> = (
  args: Partial<WattDropdownComponent>
) => ({
  props: {
    singleSelectionModel: '',
    options: args.options,
    placeholder: args.placeholder,
  },
  template: `<watt-form-field>
    <watt-dropdown
      [(ngModel)]="singleSelectionModel"
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
    multiSelectionModel: null,
    options: args.options,
    placeholder: args.placeholder,
    noOptionsFoundLabel: args.noOptionsFoundLabel,
  },
  template: `<watt-form-field>
    <watt-dropdown
      [multiple]="true"
      [(ngModel)]="multiSelectionModel"
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
    singleSelectionModel: '',
  },
  template: `<watt-form-field>
    <watt-label>Label</watt-label>
    <watt-dropdown [(ngModel)]="singleSelectionModel"></watt-dropdown>
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
    singleSelectionModel: '',
    options: dropdownOptions,
  },
  template: `<watt-form-field>
    <watt-label>Label</watt-label>

    <watt-dropdown
      #singleSelection="ngModel"
      [(ngModel)]="singleSelectionModel"
      required
      [options]="options"></watt-dropdown>

    <watt-error *ngIf="singleSelection.errors?.required">
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

export const disabled: Story<WattDropdownComponent> = () => ({
  props: {
    singleSelectionModel: '',
    options: dropdownOptions,
    disabled: true,
    placeholder: `I'm disabled`,
  },
  template: `<watt-form-field>
    <watt-label>Label</watt-label>
    <watt-dropdown
      #singleSelection="ngModel"
      [(ngModel)]="singleSelectionModel"
      [disabled]="disabled"
      [placeholder]="placeholder"
      [options]="options"></watt-dropdown>
  </watt-form-field>`,
});
withValidation.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};
