import { FormControl } from '@angular/forms';

import {
  composeStories,
  createMountableStoryComponent,
} from '@storybook/testing-angular';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import * as reactiveFormstories from './+storybook/date-range-input-reactive-forms.stories';
import { WattDateRange, WattDateRangeInputComponent } from './date-range-input.component';

const { reactiveForms } = composeStories(reactiveFormstories);
const defaultOutput = 'Selected range: { "start": "", "end": "" }';

describe('Date range input - Reactive Forms', () => {
  const completeDate = '22-11-3333';
  const incompleteDate = '22-11';

  async function setup(initialDateRange?: WattDateRange) {
    const { component, ngModule } = createMountableStoryComponent(
      reactiveForms({
        exampleFormControl: initialDateRange ? new FormControl(initialDateRange) : new FormControl(),
      } as Partial<WattDateRangeInputComponent>, {} as never)
    );
    const {fixture} = await render(component, { imports: [ngModule] });

    const startDateInput: HTMLInputElement = screen.getByRole('textbox', { name: /start-date-input/i });
    const endDateInput: HTMLInputElement = screen.getByRole('textbox', { name: /end-date-input/i });

    startDateInput.setSelectionRange(0, 0);
    endDateInput.setSelectionRange(0, 0);

    return {startDateInput, endDateInput, fixture};
  }

  it('should have empty start and end date, if no initial value is provided', async () => {
    await setup();
    expect(
      screen.getByText(defaultOutput)
    ).toBeInTheDocument();
  });

  it('should have initial start and end date, if initial value is provided', async () => {
    const initialDateRange = { start: completeDate, end: completeDate };
    await setup(initialDateRange);

    expect(
      screen.getByText(
        `Selected range: { "start": "${initialDateRange.start}", "end": "${initialDateRange.end}" }`
      )
    ).toBeInTheDocument();
  });

  it('should clear incomplete start date', async () => {
    const { startDateInput } = await setup();

    expect(
      screen.getByText(defaultOutput)
    ).toBeInTheDocument();

    // Type start date
    startDateInput.setSelectionRange(0, 0);
    userEvent.type(startDateInput, incompleteDate);
    fireEvent.blur(startDateInput);

    expect(startDateInput).toHaveValue('');
  });

  it('should clear incomplete end date', async () => {
    const { endDateInput } = await setup();

    expect(
      screen.getByText(defaultOutput)
    ).toBeInTheDocument();

    // Type start date
    endDateInput.setSelectionRange(0, 0);
    userEvent.type(endDateInput, incompleteDate);
    fireEvent.blur(endDateInput);

    expect(endDateInput).toHaveValue('');
  });

  it('should only output valid start date', async () => {
    const { startDateInput } = await setup();
    const expectedDate = completeDate;
    const expectedDateWithoutSeperators = expectedDate.replace(/-/g, '');
    const lastOfExpectedDate = expectedDate.charAt(expectedDate.length - 1);

    startDateInput.setSelectionRange(0, 0);
    expect(
      screen.getByText(defaultOutput)
    ).toBeInTheDocument();

    // Type start date
    userEvent.type(startDateInput, expectedDateWithoutSeperators);

    expect(
      screen.getByText(`Selected range: { "start": "${expectedDate}", "end": "" }`)
    ).toBeInTheDocument();

    // Remove last character
    userEvent.type(startDateInput, '{backspace}');

    expect(
      screen.getByText(defaultOutput)
    ).toBeInTheDocument();

    // Type last character of start date back again
    userEvent.type(startDateInput, lastOfExpectedDate);

    expect(
      screen.getByText(`Selected range: { "start": "${expectedDate}", "end": "" }`)
    ).toBeInTheDocument();
  });

  it('should only output valid end date', async () => {
    const { endDateInput } = await setup();
    const expectedDate = completeDate;
    const expectedDateWithoutSeperators = expectedDate.replace(/-/g, '');
    const lastOfExpectedDate = expectedDate.charAt(expectedDate.length - 1);

    expect(
      screen.getByText(defaultOutput)
    ).toBeInTheDocument();

    // Type start date
    userEvent.type(endDateInput, expectedDateWithoutSeperators);

    expect(
      screen.getByText(`Selected range: { "start": "", "end": "${expectedDate}" }`)
    ).toBeInTheDocument();

    // Remove last character
    userEvent.type(endDateInput, '{backspace}');

    expect(
      screen.getByText(defaultOutput)
    ).toBeInTheDocument();

    // Type last character of start date back again
    userEvent.type(endDateInput, lastOfExpectedDate);

    expect(
      screen.getByText(`Selected range: { "start": "", "end": "${expectedDate}" }`)
    ).toBeInTheDocument();
  });

  it('should be able to paste `yyyy-mm-dd` format into start date', async () => {
    const { startDateInput } = await setup();
    const pastedDate = completeDate.split("").reverse().join("");
    const expectedDate = completeDate;

    const clipboardEvent: ClipboardEventInit = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    clipboardEvent.clipboardData = {
      getData: () => pastedDate,
    } as unknown as DataTransfer;

    userEvent.paste(startDateInput, pastedDate, clipboardEvent, {initialSelectionStart: 0, initialSelectionEnd: 0});

    expect(startDateInput).toHaveValue(expectedDate);
  });

  it('should be able to paste `yyyy-mm-dd` format into end date', async () => {
    const { endDateInput } = await setup();
    const pastedDate = completeDate.split("").reverse().join("");
    const expectedDate = completeDate;

    const clipboardEvent: ClipboardEventInit = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    clipboardEvent.clipboardData = {
      getData: () => pastedDate,
    } as unknown as DataTransfer;

    userEvent.paste(endDateInput, pastedDate, clipboardEvent, {initialSelectionStart: 0, initialSelectionEnd: 0});

    expect(endDateInput).toHaveValue(expectedDate);
  });

  it('should jump to end date, when typing in start date, and start date is complete', async () => {
    const {startDateInput, endDateInput } = await setup();
    const completeDateAndMore = completeDate.replace(/-/g, '') + '4';

    userEvent.type(startDateInput, completeDateAndMore);

    expect(endDateInput).toHaveFocus();
  });
});
