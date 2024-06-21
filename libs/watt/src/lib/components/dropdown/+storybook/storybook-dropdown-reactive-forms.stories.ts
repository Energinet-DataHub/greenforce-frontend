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
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { fireEvent, within } from '@storybook/testing-library';

import { WattFieldHintComponent } from '../../field';
import { WattDropdownComponent } from '../watt-dropdown.component';
import { WattDropdownOption } from '../watt-dropdown-option';

const meta: Meta<WattDropdownComponent> = {
  title: 'Components/Dropdown/Reactive Forms',
  component: WattDropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, WattFieldHintComponent],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
};

const dropdownOptions: WattDropdownOption[] = [
  { value: 'outlaws', displayValue: 'The Outlaws' },
  { value: 'batman', displayValue: 'Batman' },
  { value: 'titans', displayValue: 'Titans' },
  { value: 'volt', displayValue: 'Volt' },
  { value: 'joules', displayValue: 'Joules' },
];
const placeholder = 'Select a team';

const template = `
  <watt-dropdown [label]="label"
    [chipMode]="chipMode"
    [multiple]="multiple"
    [formControl]="exampleFormControl"
    [placeholder]="placeholder"
    [noOptionsFoundLabel]="noOptionsFoundLabel"
    [options]="options">
      <watt-field-hint>This is a hint</watt-field-hint>
    </watt-dropdown>
`;

const noOptionsFoundLabel = 'No team found.';

const DefaultTemplate: Story = {
  render: (args) => ({
    props: {
      ...args,
      label: 'Team',
      noOptionsFoundLabel,
      exampleFormControl: new FormControl({ value: null, disabled: false }),
    },
    template,
  }),
};

const DisabledTemplate: Story = {
  render: (args) => ({
    props: {
      ...args,
      label: 'Team',
      noOptionsFoundLabel,
      exampleFormControl: new FormControl({ value: null, disabled: true }),
    },
    template,
  }),
};

const ValidationTemplate: Story = {
  render: (args) => ({
    props: {
      ...args,
      label: 'Team',
      noOptionsFoundLabel,
      exampleFormControl: new FormControl(null, Validators.required),
    },
    template,
  }),
};

export default meta;
type Story = StoryObj<WattDropdownComponent>;

export const SingleSelect: Story = {
  ...DefaultTemplate,
  args: {
    options: dropdownOptions,
    placeholder,
  },
};

export const SingleSelectChipMode: Story = {
  ...DefaultTemplate,
  args: {
    ...SingleSelect.args,
    chipMode: true,
  },
};

export const MultiSelect: Story = {
  ...DefaultTemplate,
  args: {
    options: dropdownOptions,
    placeholder,
    multiple: true,
  },
};

export const MultiSelectChipMode: Story = {
  ...DefaultTemplate,
  args: {
    ...MultiSelect.args,
    chipMode: true,
  },
};

export const WithFormControlDisabled: Story = {
  ...DisabledTemplate,
  args: {
    ...SingleSelect.args,
  },
};

export const WithFormControlDisabledChipMode: Story = {
  ...DisabledTemplate,
  args: {
    ...SingleSelectChipMode.args,
  },
};

export const WithValidation: Story = {
  ...ValidationTemplate,
  args: {
    ...SingleSelect.args,
  },
};
WithValidation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentElement as HTMLElement);
  const dropdown = canvas.getByRole('combobox');
  fireEvent.click(dropdown);

  const emptyOption = canvas.getByRole('option', {
    name: '—',
  });
  fireEvent.click(emptyOption);
};

export const WithValidationChipMode: Story = {
  ...ValidationTemplate,
  args: {
    ...SingleSelectChipMode.args,
  },
};

WithValidationChipMode.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentElement as HTMLElement);

  const menuChip = canvas.getByRole('button');
  fireEvent.click(menuChip);

  const emptyOption = canvas.getByRole('option', {
    name: '—',
  });
  fireEvent.click(emptyOption);
};
