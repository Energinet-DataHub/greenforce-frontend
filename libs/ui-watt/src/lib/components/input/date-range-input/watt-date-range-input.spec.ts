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
import { Story } from '@storybook/angular';

import {
  composeStories,
  createMountableStoryComponent,
} from '@storybook/testing-angular';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import * as reactiveFormstories from './+storybook/date-range-input-reactive-forms.stories';
import { WattDateRangeInputComponent } from './watt-date-range-input.component';

const { withFormControl, withInitialValue, withValidations, withFormControlDisabled } =
  composeStories(reactiveFormstories);
const defaultOutput = '{ "start": "", "end": "" }';

describe('Date range input - Reactive Forms', () => {
  const completeDate = '22-11-3333';
  const incompleteDate = '22-11';

  async function setup(story: Story<Partial<WattDateRangeInputComponent>>) {
    const { component, ngModule } = createMountableStoryComponent(
      story({}, {} as never)
    );
    const { fixture } = await render(component, { imports: [ngModule] });

    const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });
    const endDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /end-date-input/i,
    });

    startDateInput.setSelectionRange(0, 0);
    endDateInput.setSelectionRange(0, 0);

    return { startDateInput, endDateInput, fixture };
  }

  describe(withFormControl.name, () => {
    it('should have empty start and end date, if no initial value is provided', async () => {
      await setup(withFormControl);
      expect(screen.getByText(defaultOutput)).toBeInTheDocument();
    });

    it('should have empty start and end date, if no initial value is provided', async () => {
      await setup(withFormControl);
      expect(screen.getByText(defaultOutput)).toBeInTheDocument();
    });

    it('should clear incomplete start date', async () => {
      const { startDateInput } = await setup(withFormControl);
      expect(screen.getByText(defaultOutput)).toBeInTheDocument();

      // Type start date
      startDateInput.setSelectionRange(0, 0);
      userEvent.type(startDateInput, incompleteDate);
      fireEvent.blur(startDateInput);

      expect(startDateInput).toHaveValue('');
    });

    it('should clear incomplete end date', async () => {
      const { endDateInput } = await setup(withFormControl);

      expect(screen.getByText(defaultOutput)).toBeInTheDocument();

      // Type start date
      endDateInput.setSelectionRange(0, 0);
      userEvent.type(endDateInput, incompleteDate);
      fireEvent.blur(endDateInput);

      expect(endDateInput).toHaveValue('');
    });

    it('should only output valid start date', async () => {
      const { startDateInput } = await setup(withFormControl);
      const expectedDate = completeDate;
      const expectedDateWithoutSeperators = expectedDate.replace(/-/g, '');
      const lastOfExpectedDate = expectedDate.charAt(expectedDate.length - 1);

      startDateInput.setSelectionRange(0, 0);
      expect(screen.getByText(defaultOutput)).toBeInTheDocument();

      // Type start date
      userEvent.type(startDateInput, expectedDateWithoutSeperators);

      expect(
        screen.getByText(`{ "start": "${expectedDate}", "end": "" }`)
      ).toBeInTheDocument();

      // Remove last character
      userEvent.type(startDateInput, '{backspace}');

      expect(screen.getByText(defaultOutput)).toBeInTheDocument();

      // Type last character of start date back again
      userEvent.type(startDateInput, lastOfExpectedDate);

      expect(
        screen.getByText(`{ "start": "${expectedDate}", "end": "" }`)
      ).toBeInTheDocument();
    });

    it('should only output valid end date', async () => {
      const { endDateInput } = await setup(withFormControl);
      const expectedDate = completeDate;
      const expectedDateWithoutSeperators = expectedDate.replace(/-/g, '');
      const lastOfExpectedDate = expectedDate.charAt(expectedDate.length - 1);

      expect(screen.getByText(defaultOutput)).toBeInTheDocument();

      // Type start date
      userEvent.type(endDateInput, expectedDateWithoutSeperators);

      expect(
        screen.getByText(`{ "start": "", "end": "${expectedDate}" }`)
      ).toBeInTheDocument();

      // Remove last character
      userEvent.type(endDateInput, '{backspace}');

      expect(screen.getByText(defaultOutput)).toBeInTheDocument();

      // Type last character of start date back again
      userEvent.type(endDateInput, lastOfExpectedDate);

      expect(
        screen.getByText(`{ "start": "", "end": "${expectedDate}" }`)
      ).toBeInTheDocument();
    });

    it('should be able to paste `yyyy-mm-dd` format into start date', async () => {
      const { startDateInput } = await setup(withFormControl);
      const pastedDate = completeDate.split('').reverse().join('');
      const expectedDate = completeDate;

      const clipboardEvent: ClipboardEventInit = new Event('paste', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });

      clipboardEvent.clipboardData = {
        getData: () => pastedDate,
      } as unknown as DataTransfer;

      userEvent.paste(startDateInput, pastedDate, clipboardEvent, {
        initialSelectionStart: 0,
        initialSelectionEnd: 0,
      });

      expect(startDateInput).toHaveValue(expectedDate);
    });

    it('should be able to paste `yyyy-mm-dd` format into end date', async () => {
      const { endDateInput } = await setup(withFormControl);
      const pastedDate = completeDate.split('').reverse().join('');
      const expectedDate = completeDate;

      const clipboardEvent: ClipboardEventInit = new Event('paste', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });

      clipboardEvent.clipboardData = {
        getData: () => pastedDate,
      } as unknown as DataTransfer;

      userEvent.paste(endDateInput, pastedDate, clipboardEvent, {
        initialSelectionStart: 0,
        initialSelectionEnd: 0,
      });

      expect(endDateInput).toHaveValue(expectedDate);
    });

    it('should jump to end date, when typing in start date, and start date is complete', async () => {
      const { startDateInput, endDateInput } = await setup(withFormControl);
      const completeDateAndMore = completeDate.replace(/-/g, '') + '4';

      userEvent.type(startDateInput, completeDateAndMore);

      expect(endDateInput).toHaveFocus();
    });
  });

  describe(withInitialValue.name, () => {
    it('should have initial start and end date, if initial value is provided', async () => {
      await setup(withInitialValue);
      const initialDateRange = { start: completeDate, end: completeDate };

      expect(
        screen.getByText(
          `{ "start": "${initialDateRange.start}", "end": "${initialDateRange.end}" }`
        )
      ).toBeInTheDocument();
    });
  });

  describe(withValidations.name, () => {
    it('should not show error, before it has been touched', async () => {
      await setup(withValidations);

      expect(screen.queryByText(/Field is required/i)).not.toBeInTheDocument();
    });

    it('should show error on lost focus', async () => {
      const { startDateInput } = await setup(withValidations);
      fireEvent.focusOut(startDateInput);

      expect(screen.queryByText(/Field is required/i)).toBeInTheDocument();
    });
  });

  describe(withFormControlDisabled.name, () => {
    it('should be disabled', async () => {
      const {startDateInput, endDateInput} = await setup(withFormControlDisabled);
      expect(startDateInput).toBeDisabled();
      expect(endDateInput).toBeDisabled();
    })
  });
});
