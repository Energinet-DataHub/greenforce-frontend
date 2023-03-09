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
import { composeStory, createMountableStoryComponent } from '@storybook/testing-angular';
import { fireEvent, render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { formatInTimeZone } from 'date-fns-tz';

import { patchUserEventKeyCode } from '@energinet-datahub/gf/test-util-staging';

import Meta, {
  initialValueSingle,
  initialValueRangeStart,
  initialValueRangeEnd_EndOfDay,
  withFormControl as WithFormControl,
  withInitialValue as WithInitialValue,
  withValidations as WithValidations,
  withFormControlDisabled as WithFormControlDisabled,
  WattDatepickerStoryConfig,
} from './+storybook/watt-datepicker-reactive-forms.stories';
import { danishTimeZoneIdentifier } from './watt-datepicker.component';

const withFormControl = composeStory(WithFormControl, Meta);
const withInitialValue = composeStory(WithInitialValue, Meta);
const withValidations = composeStory(WithValidations, Meta);
const withFormControlDisabled = composeStory(WithFormControlDisabled, Meta);

const defaultOutputSingle = '""';
const defaultOutputRange = '{ "start": "", "end": "" }';
const backspace = '{backspace}';

function formatDateAs(value: string, format: string): string {
  return formatInTimeZone(value, danishTimeZoneIdentifier, format);
}

describe('Datepicker', () => {
  const incompleteDateWithoutSeperatorsAs_ddMM = formatDateAs(initialValueSingle, 'ddMM');
  const displayDateFormat = 'dd-MM-yyyy';
  const pasteDateFormat = 'yyyy-MM-dd';

  async function setup(story: Story<Partial<WattDatepickerStoryConfig>>) {
    const { component, ngModule } = createMountableStoryComponent(
      story({ disableAnimations: true, ...story }, {} as never)
    );
    const { fixture } = await render(component, { imports: [ngModule] });

    const dateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /^date-input/i,
    });
    const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });
    const endDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /end-date-input/i,
    });

    dateInput.setSelectionRange(0, 0);
    startDateInput.setSelectionRange(0, 0);
    endDateInput.setSelectionRange(0, 0);

    return { dateInput, startDateInput, endDateInput, fixture };
  }

  describe('With Form Control', () => {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    describe('and single date', () => {
      it('should have empty value, if no initial value is provided', async () => {
        await setup(withFormControl);
        expect(screen.getByText(defaultOutputSingle)).toBeInTheDocument();
      });

      it('should clear incomplete date', async () => {
        const { dateInput } = await setup(withFormControl);
        expect(screen.getByText(defaultOutputSingle)).toBeInTheDocument();

        // Type start date
        userEvent.type(dateInput, incompleteDateWithoutSeperatorsAs_ddMM, {
          initialSelectionStart: 0,
        });
        fireEvent.blur(dateInput);

        expect(screen.getByText(defaultOutputSingle)).toBeInTheDocument();
        expect(dateInput).toHaveValue('');
      });

      it('should only output valid date', async () => {
        patchUserEventKeyCode({ capture: true });

        const { dateInput } = await setup(withFormControl);
        const expectedDate = initialValueSingle;
        const expectedDateWithoutSeperators = formatDateAs(expectedDate, 'ddMMyyyy');
        const lastOfExpectedDate = expectedDateWithoutSeperators.at(-1);

        expect(screen.getByText(defaultOutputSingle)).toBeInTheDocument();

        // Type start date
        userEvent.type(dateInput, expectedDateWithoutSeperators, { initialSelectionStart: 0 });

        expect(screen.getByText(`"${expectedDate}"`)).toBeInTheDocument();

        // Remove last character
        userEvent.type(dateInput, backspace);

        expect(screen.getByText(defaultOutputSingle)).toBeInTheDocument();

        // Type last character of start date back again
        userEvent.type(dateInput, lastOfExpectedDate ?? '');

        expect(screen.getByText(`"${expectedDate}"`)).toBeInTheDocument();
      });

      it('should be able to paste "yyyy-MM-dd" format into date input', async () => {
        const { dateInput } = await setup(withFormControl);

        const dateToPaste = formatDateAs(initialValueSingle, pasteDateFormat);
        const expectedDate = formatDateAs(initialValueSingle, displayDateFormat);

        const clipboardEvent: ClipboardEventInit = new Event('paste', {
          bubbles: true,
          cancelable: true,
          composed: true,
        });

        clipboardEvent.clipboardData = {
          getData: () => dateToPaste,
        } as unknown as DataTransfer;

        userEvent.paste(dateInput, dateToPaste, clipboardEvent, {
          initialSelectionStart: 0,
          initialSelectionEnd: 0,
        });

        expect(dateInput).toHaveValue(expectedDate);
      });
    });

    describe('and range', () => {
      it('should have empty start and end date, if no initial value is provided', async () => {
        await setup(withFormControl);
        expect(screen.getByText(defaultOutputRange)).toBeInTheDocument();
      });

      it('should clear incomplete start date', async () => {
        patchUserEventKeyCode({ capture: false });

        const { startDateInput } = await setup(withFormControl);
        expect(screen.getByText(defaultOutputRange)).toBeInTheDocument();

        // Type start date
        userEvent.type(startDateInput, incompleteDateWithoutSeperatorsAs_ddMM, {
          initialSelectionStart: 0,
        });
        fireEvent.blur(startDateInput);

        expect(screen.getByText(defaultOutputRange)).toBeInTheDocument();
        expect(startDateInput).toHaveValue('');
      });

      it('should clear incomplete end date', async () => {
        const { endDateInput } = await setup(withFormControl);

        expect(screen.getByText(defaultOutputRange)).toBeInTheDocument();

        // Type start date
        userEvent.type(endDateInput, incompleteDateWithoutSeperatorsAs_ddMM, {
          initialSelectionStart: 0,
        });
        fireEvent.blur(endDateInput);

        expect(endDateInput).toHaveValue('');
      });

      it('should only output valid start date', async () => {
        patchUserEventKeyCode({ capture: true });

        const { startDateInput } = await setup(withFormControl);
        const expectedDate = initialValueRangeStart;
        const expectedDateWithoutSeperators = formatDateAs(expectedDate, 'ddMMyyyy');
        const lastOfExpectedDate = expectedDateWithoutSeperators.at(-1);

        expect(screen.getByText(defaultOutputRange)).toBeInTheDocument();

        // Type start date
        userEvent.type(startDateInput, expectedDateWithoutSeperators, { initialSelectionStart: 0 });

        expect(screen.getByText(`{ "start": "${expectedDate}", "end": "" }`)).toBeInTheDocument();

        // Remove last character
        userEvent.type(startDateInput, backspace);

        expect(screen.getByText(defaultOutputRange)).toBeInTheDocument();

        // Type last character of start date back again
        userEvent.type(startDateInput, lastOfExpectedDate ?? '');

        expect(screen.getByText(`{ "start": "${expectedDate}", "end": "" }`)).toBeInTheDocument();
      });

      it('should only output valid end date', async () => {
        const { endDateInput } = await setup(withFormControl);
        const expectedDate = initialValueRangeEnd_EndOfDay;
        const expectedDateWithoutSeperators = formatDateAs(expectedDate, 'ddMMyyyy');
        const lastOfExpectedDate = expectedDateWithoutSeperators.at(-1);

        expect(screen.getByText(defaultOutputRange)).toBeInTheDocument();

        // Type start date
        userEvent.type(endDateInput, expectedDateWithoutSeperators, { initialSelectionStart: 0 });

        expect(screen.getByText(`{ "start": "", "end": "${expectedDate}" }`)).toBeInTheDocument();

        // Remove last character
        userEvent.type(endDateInput, backspace);

        expect(screen.getByText(defaultOutputRange)).toBeInTheDocument();

        // Type last character of start date back again
        userEvent.type(endDateInput, lastOfExpectedDate ?? '');

        expect(screen.getByText(`{ "start": "", "end": "${expectedDate}" }`)).toBeInTheDocument();
      });

      it('should be able to paste "yyyy-MM-dd" format into start date', async () => {
        const { startDateInput } = await setup(withFormControl);

        const dateToPaste = formatDateAs(initialValueRangeStart, pasteDateFormat);
        const expectedDate = formatDateAs(initialValueRangeStart, displayDateFormat);

        const clipboardEvent: ClipboardEventInit = new Event('paste', {
          bubbles: true,
          cancelable: true,
          composed: true,
        });

        clipboardEvent.clipboardData = {
          getData: () => dateToPaste,
        } as unknown as DataTransfer;

        userEvent.paste(startDateInput, dateToPaste, clipboardEvent, {
          initialSelectionStart: 0,
          initialSelectionEnd: 0,
        });

        expect(startDateInput).toHaveValue(expectedDate);
      });

      it('should be able to paste "yyyy-MM-dd" format into end date', async () => {
        const { endDateInput } = await setup(withFormControl);

        const dateToPaste = formatDateAs(initialValueRangeEnd_EndOfDay, pasteDateFormat);
        const expectedDate = formatDateAs(initialValueRangeEnd_EndOfDay, displayDateFormat);

        const clipboardEvent: ClipboardEventInit = new Event('paste', {
          bubbles: true,
          cancelable: true,
          composed: true,
        });

        clipboardEvent.clipboardData = {
          getData: () => dateToPaste,
        } as unknown as DataTransfer;

        userEvent.paste(endDateInput, dateToPaste, clipboardEvent, {
          initialSelectionStart: 0,
          initialSelectionEnd: 0,
        });

        expect(endDateInput).toHaveValue(expectedDate);
      });

      it('should jump to end date, when typing in start date, and start date is complete', async () => {
        const { startDateInput, endDateInput } = await setup(withFormControl);
        const startDateWithoutSeperators = formatDateAs(initialValueRangeStart, 'ddMMyyyy');

        userEvent.type(startDateInput, startDateWithoutSeperators + '04');

        expect(endDateInput).toHaveFocus();
      });
    });
  });

  describe('With Initial Value', () => {
    describe('and single date', () => {
      it('should have initial date, if initial value is provided', async () => {
        await setup(withInitialValue);

        expect(screen.getByText(`"${initialValueSingle}"`)).toBeInTheDocument();
      });
    });

    describe('and range', () => {
      it('should have initial start and end date, if initial value is provided', async () => {
        await setup(withInitialValue);

        expect(
          screen.getByText(
            `{ "start": "${initialValueRangeStart}", "end": "${initialValueRangeEnd_EndOfDay}" }`
          )
        ).toBeInTheDocument();
      });

      it('should update control value when only end date has changed', async () => {
        await setup(withInitialValue);

        const [, range] = await screen.findAllByRole('button', {
          name: 'calendar_today',
        });

        userEvent.click(range);

        const datepickerDialog = await screen.findByRole('dialog');
        expect(datepickerDialog).toBeInTheDocument();

        const currentMonth = within(datepickerDialog).getByText('SEP. 2022');
        expect(currentMonth).toBeInTheDocument();

        const dayButtonStart = within(datepickerDialog).getByRole('button', {
          name: /^3\./,
        });
        userEvent.click(dayButtonStart);

        const dayButtonEnd = within(datepickerDialog).getByRole('button', {
          name: /^28\./,
        });
        userEvent.click(dayButtonEnd);

        expect(screen.getByTestId('rangeValue')).toHaveTextContent(
          `{ "start": "${initialValueRangeStart}", "end": "2022-09-28T21:59:59.999Z" }`
        );
      });
    });
  });

  describe('With Validations', () => {
    describe('and single date', () => {
      it('should not show error, before it has been touched', async () => {
        await setup(withValidations);

        expect(screen.queryByText(/Date is required/i)).not.toBeInTheDocument();
      });

      it('should show error on lost focus', async () => {
        const { dateInput } = await setup(withValidations);
        fireEvent.focusOut(dateInput);

        expect(screen.queryByText(/Date is required/i)).toBeInTheDocument();
      });
    });

    describe('and range', () => {
      it('should not show error, before it has been touched', async () => {
        await setup(withValidations);

        expect(screen.queryByText(/Date range is required/i)).not.toBeInTheDocument();
      });

      it('should show error on lost focus', async () => {
        const { startDateInput } = await setup(withValidations);
        fireEvent.focusOut(startDateInput);

        expect(screen.queryByText(/Date range is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('With Form Control Disabled', () => {
    describe('and single date', () => {
      it('should be disabled', async () => {
        const { dateInput } = await setup(withFormControlDisabled);
        expect(dateInput).toBeDisabled();
      });
    });

    describe('and range', () => {
      it('should be disabled', async () => {
        const { startDateInput, endDateInput } = await setup(withFormControlDisabled);
        expect(startDateInput).toBeDisabled();
        expect(endDateInput).toBeDisabled();
      });
    });
  });
});
