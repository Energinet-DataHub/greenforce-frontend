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
/* eslint-disable sonarjs/no-duplicate-string */
import { Component, DebugElement } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { parallel } from '@angular/cdk/testing';

import { WattDropdownOptions } from './watt-dropdown-option';
import { WattDropdownComponent } from './watt-dropdown.component';

const dropdownOptions: WattDropdownOptions = [
  { value: 'outlaws', displayValue: 'The Outlaws' },
  { value: 'batman', displayValue: 'Batman' },
  { value: 'titans', displayValue: 'Titans' },
  { value: 'volt', displayValue: 'Volt' },
  { value: 'joules', displayValue: 'Joules' },
];

const matOptionClass = '.mat-mdc-option';

describe(WattDropdownComponent, () => {
  function getFilterInput(): HTMLInputElement {
    const inputs: HTMLInputElement[] = screen.getAllByRole('textbox', {
      // We search for "hidden" input elements because as of `ngx-mat-select-search` v5.0.0
      // when the `ngx-mat-select-search` component is inside a `mat-option`,
      // the `mat-option` element has a `aria-hidden="true"` applied to it.
      // See https://github.com/bithost-gmbh/ngx-mat-select-search/pull/392
      hidden: true,
    });

    const [visibleInput] = inputs.filter(
      (input) =>
        input.classList.contains('mat-select-search-input') &&
        input.classList.contains('mat-select-search-hidden') === false
    );

    return visibleInput;
  }

  function getSelectAllCheckbox(): HTMLInputElement {
    return screen.getByRole('checkbox', {
      // We search for a "hidden" checkbox element because as of `ngx-mat-select-search` v5.0.0
      // when the `ngx-mat-select-search` component is inside a `mat-option`,
      // the `mat-option` element has a `aria-hidden="true"` applied to it.
      // See https://github.com/bithost-gmbh/ngx-mat-select-search/pull/392
      hidden: true,
    });
  }

  const placeholder = 'Select a team';

  // eslint-disable-next-line sonarjs/cognitive-complexity
  describe('with reactive forms', () => {
    async function setup({
      initialState = null,
      multiple = false,
      noOptionsFoundLabel = '',
      showResetOption = true,
    }: {
      initialState?: string | string[] | null;
      multiple?: boolean;
      noOptionsFoundLabel?: string;
      showResetOption?: boolean;
    } = {}) {
      @Component({
        template: `<watt-dropdown
          [placeholder]="placeholder"
          [formControl]="dropdownControl"
          [options]="options"
          [multiple]="multiple"
          [showResetOption]="showResetOption"
          [noOptionsFoundLabel]="noOptionsFoundLabel"
        ></watt-dropdown>`,
      })
      class TestComponent {
        dropdownControl = new FormControl(initialState);
        options: WattDropdownOptions = dropdownOptions;
        placeholder = placeholder;
        multiple = multiple;
        noOptionsFoundLabel = noOptionsFoundLabel;
        showResetOption = showResetOption;
      }

      const { fixture } = await render(TestComponent, {
        providers: [FormGroupDirective],
        imports: [WattDropdownComponent, ReactiveFormsModule],
      });

      const loader = TestbedHarnessEnvironment.loader(fixture);
      const matSelect = await loader.getHarness(MatSelectHarness);

      return {
        fixture,
        matSelect,
      };
    }

    it('can select an option from the dropdown', async () => {
      const { fixture, matSelect } = await setup();

      await matSelect.open();

      const [firstDropdownOption] = dropdownOptions;
      const option = screen.queryByText(firstDropdownOption.displayValue);

      if (option) {
        userEvent.click(option);
      }

      expect(fixture.componentInstance.dropdownControl.value).toBe(firstDropdownOption.value);
    });

    describe('single selection', () => {
      it('shows a reset option by default', async () => {
        const { matSelect } = await setup({
          showResetOption: true,
        });

        await matSelect.open();

        // Number of options is `dropdownOptions` + 2:
        // Option 1. Filter input
        // Option 2. Reset option
        // Option 2 + n. Actual options
        const expectedOptions = dropdownOptions.length + 2;
        const actualOptions = await matSelect.getOptions();

        expect(actualOptions.length).toBe(expectedOptions);
      });

      it('can hide the reset option', async () => {
        const { matSelect } = await setup({
          showResetOption: false,
        });

        await matSelect.open();

        // Number of options is `dropdownOptions` + 1:
        // Option 1. Filter input
        // Option 1 + n. Actual options
        const expectedOptions = dropdownOptions.length + 1;
        const actualOptions = await matSelect.getOptions();

        expect(actualOptions.length).toBe(expectedOptions);
      });

      // eslint-disable-next-line sonarjs/no-duplicate-string
      it('can reset the dropdown', async () => {
        const [firstDropdownOption] = dropdownOptions;

        const { fixture, matSelect } = await setup({
          initialState: firstDropdownOption.value,
        });

        await matSelect.open();

        const matOptions: DebugElement[] = fixture.debugElement.queryAll(By.css(matOptionClass));

        // The first option is skipped because it holds the filter input
        const [, resetOptionDe] = matOptions;

        if (resetOptionDe) {
          resetOptionDe.nativeElement.click();
        }

        expect(fixture.componentInstance.dropdownControl.value).toBeNull();
      });

      it('cannot reset the dropdown if showResetOption is disabled', async () => {
        const [firstDropdownOption] = dropdownOptions;

        const { fixture, matSelect } = await setup({
          initialState: firstDropdownOption.value,
          showResetOption: false,
        });

        await matSelect.open();

        const matOptions: DebugElement[] = fixture.debugElement.queryAll(By.css(matOptionClass));

        // for each option, click the option and verify selected is not null
        matOptions.forEach((x) => {
          x.nativeElement.click();
          expect(fixture.componentInstance.dropdownControl.value).not.toBeNull();
        });
      });

      it('can filter the available options', async () => {
        const { matSelect } = await setup();

        await matSelect.open();

        const filterInput = getFilterInput();

        userEvent.type(filterInput, 'outlaws');

        // Number of options is 3:
        // Option 1. Filter input
        // Option 2. Reset option
        // Option 3. Actual option containing the desired text
        const expectedOptions = 3;
        const actualOptions = await matSelect.getOptions();

        expect(actualOptions.length).toBe(expectedOptions);
      });
    });

    describe('multi selection', () => {
      it('can reset the dropdown', async () => {
        const [firstDropdownOption] = dropdownOptions;

        const { fixture, matSelect } = await setup({
          initialState: [firstDropdownOption.value],
          multiple: true,
        });

        await matSelect.open();

        const matOptions: DebugElement[] = fixture.debugElement.queryAll(
          By.css('.mat-pseudo-checkbox')
        );

        // The first option is skipped because it holds the filter input
        const [, secondOptionDe] = matOptions;

        if (secondOptionDe) {
          secondOptionDe.nativeElement.click();
        }

        await matSelect.close();

        expect(fixture.componentInstance.dropdownControl.value).toBeNull();
      });

      it('can select/unselect all options via a toggle all checkbox', async () => {
        const { fixture, matSelect } = await setup({
          multiple: true,
        });

        await matSelect.open();

        let checkbox = getSelectAllCheckbox();
        userEvent.click(checkbox);
        await matSelect.close();

        expect(fixture.componentInstance.dropdownControl.value?.length).toBe(
          dropdownOptions.length
        );

        await matSelect.open();

        checkbox = getSelectAllCheckbox();
        userEvent.click(checkbox);
        await matSelect.close();

        expect(fixture.componentInstance.dropdownControl.value).toBeNull();
      });

      it('shows a label when no options can be found after filtering', async () => {
        const noOptionsFoundLabel = 'No options found.';
        const { fixture, matSelect } = await setup({
          multiple: true,
          noOptionsFoundLabel,
        });

        await matSelect.open();

        const filterInput = getFilterInput();
        userEvent.type(filterInput, 'non-existent option');

        // Number of options is 1:
        // Option 1. Filter input containing the 'No options found.' label
        const expectedOptions = 1;
        const actualOptions = await matSelect.getOptions();

        expect(actualOptions.length).toBe(expectedOptions);

        const noOptionsFoundDe: DebugElement = fixture.debugElement.query(
          By.css('.mat-mdc-option .mat-select-search-no-entries-found')
        );

        const actualLabel = noOptionsFoundDe.nativeElement.textContent.trim();

        expect(actualLabel).toBe(noOptionsFoundLabel);
      });

      it('emits a value after filter + selection', async () => {
        const [firstDropdownOption, secondDropdownOption] = dropdownOptions;

        const { matSelect, fixture } = await setup({
          initialState: [secondDropdownOption.value],
          multiple: true,
        });

        const observer = jest.fn();
        const observerJSON = jest.fn();
        fixture.componentInstance.dropdownControl.valueChanges.subscribe((value) => {
          observer(value);
          observerJSON(JSON.stringify(value));
        });

        await matSelect.open();

        const filterInput = getFilterInput();
        userEvent.type(filterInput, 'outlaws');

        // Skip the first option as it holds the filter input
        const [, secondOption] = await matSelect.getOptions();
        await secondOption.click();

        // The assertion below shows that the `observer` is called twice with the same values
        // but in reality it's been called with two different values (the `observerJSON` shows that)
        // The first call is with the option selected after filtering
        // The second call is with the final component value (filtered option + previously selected option)
        // However, different behavior is observed because the component's output is an array.
        // In JavaScript, arrays are sent by reference, so when the component outputs its final value (the second time),
        // the first output is also affected because it's the same array
        expect(observer).toHaveBeenNthCalledWith(1, [
          firstDropdownOption.value,
          secondDropdownOption.value,
        ]);
        expect(observer).toHaveBeenNthCalledWith(2, [
          firstDropdownOption.value,
          secondDropdownOption.value,
        ]);

        expect(observerJSON).toHaveBeenNthCalledWith(
          1,
          JSON.stringify([firstDropdownOption.value])
        );
        expect(observerJSON).toHaveBeenNthCalledWith(
          2,
          JSON.stringify([firstDropdownOption.value, secondDropdownOption.value])
        );
      });
    });
  });

  describe('with template-driven forms', () => {
    async function setup({
      initialState = null,
      multiple = false,
      noOptionsFoundLabel = '',
      sortDirection = undefined,
    }: {
      initialState?: string | string[] | null;
      multiple?: boolean;
      noOptionsFoundLabel?: string;
      sortDirection?: 'asc' | 'desc';
    } = {}) {
      @Component({
        template: `<watt-dropdown
          [placeholder]="placeholder"
          [(ngModel)]="dropdownModel"
          [sortDirection]="sortDirection"
          [options]="options"
          [multiple]="multiple"
          [noOptionsFoundLabel]="noOptionsFoundLabel"
        ></watt-dropdown>`,
      })
      class TestComponent {
        dropdownModel = initialState;
        options: WattDropdownOptions = dropdownOptions;
        placeholder = placeholder;
        multiple = multiple;
        noOptionsFoundLabel = noOptionsFoundLabel;
        sortDirection = sortDirection;
      }

      const { fixture } = await render(TestComponent, {
        providers: [FormGroupDirective],
        imports: [WattDropdownComponent, FormsModule],
      });

      const loader = TestbedHarnessEnvironment.loader(fixture);
      const matSelect = await loader.getHarness(MatSelectHarness);

      return {
        fixture,
        matSelect,
      };
    }

    it('can select an option from the dropdown', async () => {
      const { fixture, matSelect } = await setup();

      await matSelect.open();

      const [firstDropdownOption] = dropdownOptions;
      const option = screen.queryByText(firstDropdownOption.displayValue);

      if (option) {
        userEvent.click(option);
      }

      expect(fixture.componentInstance.dropdownModel).toBe(firstDropdownOption.value);
    });

    describe('single selection', () => {
      it('can reset the dropdown', async () => {
        const [firstDropdownOption] = dropdownOptions;

        const { fixture, matSelect } = await setup({
          initialState: firstDropdownOption.value,
        });

        await matSelect.open();

        const matOptions: DebugElement[] = fixture.debugElement.queryAll(By.css(matOptionClass));

        // The first option is skipped because it holds the filter input
        const [, resetOptionDe] = matOptions;

        if (resetOptionDe) {
          resetOptionDe.nativeElement.click();
        }

        expect(fixture.componentInstance.dropdownModel).toBeNull();
      });

      // eslint-disable-next-line sonarjs/no-identical-functions
      it('can filter the available options', async () => {
        const { matSelect } = await setup();

        await matSelect.open();

        const filterInput = getFilterInput();
        userEvent.type(filterInput, 'outlaws');

        // Number of options is 3:
        // Option 1. Filter input
        // Option 2. Reset option
        // Option 3. Actual option containing the desired text
        const expectedOptions = 3;
        const actualOptions = await matSelect.getOptions();

        expect(actualOptions.length).toBe(expectedOptions);
      });
    });

    describe('multi selection', () => {
      it('can reset the dropdown', async () => {
        const [firstDropdownOption] = dropdownOptions;

        const { fixture, matSelect } = await setup({
          initialState: [firstDropdownOption.value],
          multiple: true,
        });

        await matSelect.open();

        const matOptions: DebugElement[] = fixture.debugElement.queryAll(
          By.css('.mat-pseudo-checkbox')
        );

        // The first option is skipped because it holds the filter input
        const [, secondOptionDe] = matOptions;

        if (secondOptionDe) {
          secondOptionDe.nativeElement.click();
        }

        await matSelect.close();

        expect(fixture.componentInstance.dropdownModel).toBeNull();
      });

      // eslint-disable-next-line sonarjs/no-identical-functions
      it('shows a label when no options can be found after filtering', async () => {
        const noOptionsFoundLabel = 'No options found.';
        const { fixture, matSelect } = await setup({
          multiple: true,
          noOptionsFoundLabel,
        });

        await matSelect.open();

        const filterInput = getFilterInput();
        userEvent.type(filterInput, 'non-existent option');

        // Number of options is 1:
        // Option 1. Filter input containing the 'No options found.' label
        const expectedOptions = 1;
        const actualOptions = await matSelect.getOptions();

        expect(actualOptions.length).toBe(expectedOptions);

        const noOptionsFoundDe: DebugElement = fixture.debugElement.query(
          By.css('.mat-mdc-option .mat-select-search-no-entries-found')
        );

        const actualLabel = noOptionsFoundDe.nativeElement.textContent.trim();

        expect(actualLabel).toBe(noOptionsFoundLabel);
      });
    });

    describe('sorting', () => {
      async function getOptionTexts(matSelect: MatSelectHarness): Promise<string[]> {
        const options = await matSelect.getOptions();
        return await parallel(() => options.map((option) => option.getText()));
      }

      it('do not apply sorting when not set', async () => {
        const { matSelect } = await setup();

        await matSelect.open();

        const expectedTexts = dropdownOptions.map((option) => option.displayValue);

        expect(await getOptionTexts(matSelect)).toEqual(['', '—', ...expectedTexts]);
      });

      it('sorts options in ascending order', async () => {
        const { matSelect } = await setup({
          sortDirection: 'asc',
        });

        await matSelect.open();

        const expectedTexts = ['', '—', 'Batman', 'Joules', 'The Outlaws', 'Titans', 'Volt'];

        expect(await getOptionTexts(matSelect)).toEqual(expectedTexts);
      });

      it('sorts options in descending order', async () => {
        const { matSelect } = await setup({
          sortDirection: 'desc',
        });

        await matSelect.open();

        const expectedTexts = ['', '—', 'Volt', 'Titans', 'The Outlaws', 'Joules', 'Batman'];

        expect(await getOptionTexts(matSelect)).toEqual(expectedTexts);
      });
    });
  });
});
