//#region License
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
//#endregion
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattDropdownOptions } from './watt-dropdown-option';
import { WattDropdownComponent } from './watt-dropdown.component';

const placeholder = 'Select a team';
const dropdownOptions: WattDropdownOptions = [
  { value: 'outlaws', displayValue: 'The Outlaws' },
  { value: 'batman', displayValue: 'Batman' },
  { value: 'titans', displayValue: 'Titans' },
  { value: 'volt', displayValue: 'Volt' },
  { value: 'joules', displayValue: 'Joules' },
];

/**
 * Opens the dropdown and waits for it to be visible
 */
async function openDropdown() {
  const selectElement = screen.getByRole('combobox');
  userEvent.click(selectElement);
  await waitFor(() => expect(document.querySelector('.mat-mdc-select-panel')).not.toBeNull());
}

describe(WattDropdownComponent, () => {
  async function setup({
    initialState = null,
    multiple = false,
    noOptionsFoundLabel = '',
    showResetOption = true,
    sortDirection = undefined,
  }: {
    initialState?: string | string[] | null;
    multiple?: boolean;
    noOptionsFoundLabel?: string;
    showResetOption?: boolean;
    sortDirection?: 'asc' | 'desc';
  } = {}) {
    @Component({
      imports: [WattDropdownComponent, ReactiveFormsModule],
      template: `<watt-dropdown
        [placeholder]="placeholder"
        [formControl]="control"
        [options]="options"
        [multiple]="multiple"
        [showResetOption]="showResetOption"
        [noOptionsFoundLabel]="noOptionsFoundLabel"
        [sortDirection]="sortDirection"
      />`,
    })
    class TestComponent {
      control = new FormControl(initialState);
      options: WattDropdownOptions = dropdownOptions;
      placeholder = placeholder;
      multiple = multiple;
      noOptionsFoundLabel = noOptionsFoundLabel;
      showResetOption = showResetOption;
      sortDirection = sortDirection;
    }

    const { fixture } = await render(TestComponent, { providers: [FormGroupDirective] });
    return fixture.componentInstance;
  }

  it('can select an option from the dropdown', async () => {
    const component = await setup();
    await openDropdown();

    const [firstOption] = dropdownOptions;
    const option = screen.getByRole('option', { name: firstOption.displayValue });

    userEvent.click(option);

    expect(component.control.value).toBe(firstOption.value);
  });

  describe('single selection', () => {
    it('shows a reset option by default', async () => {
      await setup();
      await openDropdown();

      const resetOption = screen.getByRole('option', { name: '—' });
      expect(resetOption).toBeInTheDocument();
    });

    it('can hide the reset option', async () => {
      await setup({ showResetOption: false });
      await openDropdown();

      const resetOption = screen.queryByRole('option', { name: '—' });
      expect(resetOption).not.toBeInTheDocument();
    });

    it('can reset the dropdown', async () => {
      const [firstOption] = dropdownOptions;
      const component = await setup({ initialState: firstOption.value });
      await openDropdown();

      const resetOption = screen.getByRole('option', { name: '—' });
      userEvent.click(resetOption);

      expect(component.control.value).toBeNull();
    });

    it('cannot reset the dropdown if showResetOption is false', async () => {
      const [firstOption] = dropdownOptions;
      const component = await setup({
        initialState: firstOption.value,
        showResetOption: false,
      });

      await openDropdown();

      // for each option, click the option and verify selected is not null
      for (const option of screen.getAllByRole('option')) {
        userEvent.click(option);
        expect(component.control.value).not.toBe(null);
      }
    });

    it('can filter the available options', async () => {
      await setup();
      await openDropdown();

      const filterInput = screen.getByRole('textbox', { name: 'dropdown search' });
      userEvent.type(filterInput, 'Bat');

      const options = screen.getAllByRole('option').map((option) => option.textContent?.trim());
      expect(options).toContain('Batman');
      expect(options).toHaveLength(2);
    });
  });

  describe('multi selection', () => {
    it('can reset the dropdown', async () => {
      const [firstOption, secondOption] = dropdownOptions;
      const component = await setup({
        initialState: [firstOption.value, secondOption.value],
        multiple: true,
      });

      await openDropdown();
      expect(component.control.value).toEqual([firstOption.value, secondOption.value]);

      screen.getAllByRole('option', { selected: true }).forEach((o) => userEvent.click(o));
      expect(component.control.value).toBeNull();
    });

    it('can select/unselect all options via a toggle all checkbox', async () => {
      const component = await setup({ multiple: true });
      await openDropdown();

      expect(component.control.value).toBeNull();

      const checkbox = screen.getByRole('checkbox');

      userEvent.click(checkbox);
      expect(component.control.value).toStrictEqual(dropdownOptions.map((o) => o.value));

      userEvent.click(checkbox);
      expect(component.control.value).toBeNull();
    });

    it('shows a label when no options can be found after filtering', async () => {
      const noOptionsFoundLabel = 'No options found.';
      await setup({ multiple: true, noOptionsFoundLabel });
      await openDropdown();

      const filterInput = screen.getByRole('textbox', { name: 'dropdown search' });
      userEvent.type(filterInput, 'non-existent option');

      const options = screen.queryAllByRole('option');
      expect(options).toHaveLength(0);

      const label = screen.getByText(noOptionsFoundLabel);
      expect(label).toBeVisible();
    });

    it('emits a value after filter + selection', async () => {
      const [firstOption, secondOption] = dropdownOptions;
      const component = await setup({
        multiple: true,
        initialState: [secondOption.value],
      });

      const observer = vi.fn();
      component.control.valueChanges.subscribe((value) =>
        observer(JSON.parse(JSON.stringify(value)))
      );

      await openDropdown();

      const filterInput = screen.getByRole('textbox', { name: 'dropdown search' });
      userEvent.type(filterInput, 'outlaws');

      const options = screen.getAllByRole('option');
      userEvent.click(options[0]);

      expect(observer).toHaveBeenNthCalledWith(1, [firstOption.value]);
      expect(observer).toHaveBeenNthCalledWith(2, [firstOption.value, secondOption.value]);
    });
  });

  describe('sorting', () => {
    it('does not apply sorting when not set', async () => {
      await setup({ showResetOption: false });
      await openDropdown();

      const optionTexts = screen.getAllByRole('option').map((o) => o.textContent?.trim());
      expect(optionTexts).toStrictEqual(dropdownOptions.map((o) => o.displayValue));
    });

    it('sorts options in ascending order', async () => {
      await setup({ showResetOption: false, sortDirection: 'asc' });
      await openDropdown();

      const optionTexts = screen.getAllByRole('option').map((o) => o.textContent?.trim());
      const sortedOptionTexts = [...dropdownOptions]
        .sort((a, b) => a.displayValue.localeCompare(b.displayValue))
        .map((option) => option.displayValue);

      expect(optionTexts).toStrictEqual(sortedOptionTexts);
    });

    it('sorts options in descending order', async () => {
      await setup({ showResetOption: false, sortDirection: 'desc' });
      await openDropdown();

      const optionTexts = screen.getAllByRole('option').map((o) => o.textContent?.trim());
      const sortedOptionTexts = [...dropdownOptions]
        .sort((a, b) => b.displayValue.localeCompare(a.displayValue))
        .map((option) => option.displayValue);

      expect(optionTexts).toEqual(sortedOptionTexts);
    });
  });
});
