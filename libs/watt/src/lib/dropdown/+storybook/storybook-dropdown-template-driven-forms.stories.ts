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
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import { WattDropdownComponent } from '../watt-dropdown.component';
import { WattDropdownOption } from '../watt-dropdown-option';
import { WattFieldHintComponent } from '../../field';

const dropdownOptions: WattDropdownOption[] = [
  { value: 'outlaws', displayValue: 'The Outlaws' },
  { value: 'batman', displayValue: 'Batman' },
  { value: 'titans', displayValue: 'Titans' },
  { value: 'volt', displayValue: 'Volt' },
  { value: 'joules', displayValue: 'Joules' },
];

const meta: Meta<WattDropdownComponent> = {
  title: 'Components/Dropdown/Template-driven Forms',
  component: WattDropdownComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [FormsModule, WattFieldHintComponent],
    }),
  ],
};

export default meta;

const howToUseGuideBasic = `
 How to use

 1. Import ${WattDropdownComponent.name} in a module

 import { ${WattDropdownComponent.name} } from '@energinet-datahub/watt/dropdown';

 2a. Create model in a component for single selection

 singleSelectionModel = '';

 2b. Create model in a component for multi selection

 multiSelectionModel: string[] | null = null;

 3. Define dropdown options by using the WattDropdownOption interface

 options: WattDropdownOption[] = [{ value: 'example', displayValue: 'Example' }]

 4. Assign the model and options to the dropdown component

 <watt-dropdown [(ngModel)]="singleSelectionModel" [options]="options"></watt-dropdown>

  <watt-dropdown [(ngModel)]="singleSelectionModel" [options]="options">
    <watt-field-hint>This is a hint</watt-field-hint>
  </watt-dropdown>`;

export const SingleSelect: StoryFn<WattDropdownComponent> = (
  args: Partial<WattDropdownComponent>
) => ({
  props: {
    singleSelectionModel: '',
    options: args.options,
    placeholder: args.placeholder,
    label: args.label,
  },
  template: `
    <watt-dropdown
      [(ngModel)]="singleSelectionModel"
      [placeholder]="placeholder"
      [options]="options">
        <watt-field-hint>This is a hint</watt-field-hint>
      </watt-dropdown>`,
});
SingleSelect.args = {
  options: dropdownOptions,
  placeholder: 'Select a team',
};
SingleSelect.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const MultiSelect: StoryFn<WattDropdownComponent> = (
  args: Partial<WattDropdownComponent>
) => ({
  props: {
    multiSelectionModel: null,
    options: args.options,
    placeholder: args.placeholder,
    noOptionsFoundLabel: args.noOptionsFoundLabel,
  },
  template: `
    <watt-dropdown
      [multiple]="true"
      [(ngModel)]="multiSelectionModel"
      [placeholder]="placeholder"
      [noOptionsFoundLabel]="noOptionsFoundLabel"
      [options]="options">
        <watt-field-hint>This is a hint</watt-field-hint>
      </watt-dropdown>
`,
});
MultiSelect.args = {
  options: dropdownOptions,
  placeholder: 'Select a team',
  label: 'Team',
  noOptionsFoundLabel: 'No team found.',
};
MultiSelect.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const WithLabel: StoryFn<WattDropdownComponent> = () => ({
  props: {
    singleSelectionModel: '',
    label: 'Team',
  },
  template: `
    <watt-dropdown [label]="label" [(ngModel)]="singleSelectionModel">
      <watt-field-hint>This is a hint</watt-field-hint>
    </watt-dropdown>
`,
});
WithLabel.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

export const WithValidation: StoryFn<WattDropdownComponent> = () => ({
  props: {
    singleSelectionModel: '',
    options: dropdownOptions,
    label: 'Team',
  },
  template: `
    <watt-dropdown
      #singleSelection="ngModel"
      [(ngModel)]="singleSelectionModel"
      [required]="true"
      [label]="label"
      [options]="options">
        <watt-field-hint>This is a hint</watt-field-hint>
    </watt-dropdown>`,
});
WithValidation.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};
