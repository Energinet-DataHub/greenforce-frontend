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
import { FormControl } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { WattRange } from '@energinet/watt/core/date';
import { WattDateRangeChipComponent } from './watt-date-range-chip.component';
import { WattDatepickerIntlService } from '@energinet/watt/picker/datepicker';
import { provideAnimations } from '@angular/platform-browser/animations';

describe(WattDateRangeChipComponent.name, () => {
  const START_DATE = new Date('2024-01-01');
  const END_DATE = new Date('2024-01-31');

  /**
   * Setup helper for rendering the WattDateRangeChipComponent in tests.
   *
   * Note on value vs formControl:
   * - `value`: Used for display purposes - shows the selected date range in the chip
   * - `formControl`: Used for form integration - manages the form state
   *
   * For tests that need to display a pre-selected date range, both should be provided
   * with the same initial value to ensure the component displays correctly.
   */
  const setup = async (componentInputs: Partial<{
    formControl: FormControl<WattRange<Date> | null>;
    disabled: boolean;
    label: string;
    placeholder: boolean;
    showActions: boolean;
    value: WattRange<Date>;
    customSelectionStrategy: (date: Date | null) => DateRange<Date>;
  }> = {}) => {
    const defaultFormControl = new FormControl<WattRange<Date> | null>(null);
    const selectionChangeSpy = jest.fn();

    const { fixture } = await render(WattDateRangeChipComponent, {
      imports: [MatNativeDateModule],
      providers: [WattDatepickerIntlService, provideAnimations()],
      inputs: {
        formControl: defaultFormControl,
        ...componentInputs,
      },
      on: {
        selectionChange: selectionChangeSpy,
      },
    });

    return {
      fixture,
      selectionChangeSpy,
      formControl: componentInputs.formControl || defaultFormControl,
    };
  };

  it('should render with label content', async () => {
    // Test using template syntax to verify ng-content projection
    await render(`
      <watt-date-range-chip [formControl]="formControl">
        Select Period
      </watt-date-range-chip>
    `, {
      imports: [WattDateRangeChipComponent, MatNativeDateModule],
      providers: [WattDatepickerIntlService, provideAnimations()],
      componentProperties: {
        formControl: new FormControl(null),
      },
    });

    expect(screen.getByText('Select Period')).toBeInTheDocument();
  });

  it('should display selected date range', async () => {
    const dateRange: WattRange<Date> = {
      start: START_DATE,
      end: END_DATE,
    };

    await setup({
      value: dateRange,
      formControl: new FormControl(dateRange),
    });

    expect(screen.getByText('01-01-2024 ― 31-01-2024')).toBeInTheDocument();
  });

  it('should open date picker when clicked', async () => {
    await setup();

    const chip = screen.getByRole('button', { pressed: false });
    userEvent.click(chip);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should be disabled when disabled prop is true', async () => {
    await setup({ disabled: true });

    const chip = screen.getByRole('button');
    expect(chip).toBeDisabled();
  });

  describe('placeholder prop', () => {
    const PLACEHOLDER_CLASS = 'has-placeholder';

    it('should add has-placeholder class when placeholder is true', async () => {
      const { fixture } = await setup({ placeholder: true });
      
      const component = fixture.debugElement.nativeElement;
      expect(component).toHaveClass(PLACEHOLDER_CLASS);
    });

    it('should not add has-placeholder class when placeholder is false', async () => {
      const { fixture } = await setup({ placeholder: false });
      
      const component = fixture.debugElement.nativeElement;
      expect(component).not.toHaveClass(PLACEHOLDER_CLASS);
    });

    it('should have has-placeholder class by default', async () => {
      // placeholder defaults to true in the component
      const { fixture } = await setup();
      
      const component = fixture.debugElement.nativeElement;
      expect(component).toHaveClass(PLACEHOLDER_CLASS);
    });
  });

  it('should emit selectionChange only when both dates are selected or when clearing', async () => {
    const { fixture, selectionChangeSpy } = await setup();
    const component = fixture.componentInstance;

    // Call with null - should emit (for clearing)
    component.onSelectionChange(null);
    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
    expect(selectionChangeSpy).toHaveBeenCalledWith(null);

    // Call with only start date - should not emit
    selectionChangeSpy.mockClear();
    const partialRange: WattRange<Date> = { start: new Date(), end: null };
    component.onSelectionChange(partialRange);
    expect(selectionChangeSpy).not.toHaveBeenCalled();

    // Call with both dates - should emit
    const completeRange: WattRange<Date> = { start: new Date(), end: new Date() };
    component.onSelectionChange(completeRange);
    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
    expect(selectionChangeSpy).toHaveBeenCalledWith(completeRange);
  });

  it('should show clear and select buttons when showActions is true', async () => {
    await setup({ showActions: true });

    const chip = screen.getByRole('button');
    userEvent.click(chip);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
    });
  });

  it('should clear selection when clear button is clicked', async () => {
    const dateRange: WattRange<Date> = {
      start: START_DATE,
      end: END_DATE,
    };

    const { selectionChangeSpy } = await setup({
      value: dateRange,
      formControl: new FormControl(dateRange),
      showActions: true,
    });

    const chip = screen.getByRole('button');
    userEvent.click(chip);

    await waitFor(() => {
      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeInTheDocument();
    });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    userEvent.click(clearButton);

    expect(selectionChangeSpy).toHaveBeenCalledWith(null);
  });

  it('should display date range from form control value', async () => {
    const dateRange: WattRange<Date> = {
      start: START_DATE,
      end: END_DATE,
    };
    const formControl = new FormControl<WattRange<Date> | null>(dateRange);

    await setup({
      formControl,
      value: dateRange,
      showActions: false
    });

    // The form control should maintain its value
    expect(formControl.value).toEqual(dateRange);

    // And the component should display the date range
    expect(screen.getByText('01-01-2024 ― 31-01-2024')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', async () => {
    await setup();

    const chip = screen.getByRole('button');
    expect(chip).toHaveAttribute('aria-haspopup', 'dialog');
    expect(chip).toHaveAttribute('aria-expanded', 'false');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('should show selected state when value exists', async () => {
    const dateRange: WattRange<Date> = {
      start: START_DATE,
      end: END_DATE,
    };

    await setup({
      value: dateRange,
      formControl: new FormControl(dateRange),
    });

    const chip = screen.getByRole('button');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  describe('Selection Strategy', () => {
    it('should handle custom selection strategy', async () => {
      const customStrategy = jest.fn().mockReturnValue({
        start: START_DATE,
        end: new Date('2024-01-07'),
      });

      const { fixture } = await setup({ customSelectionStrategy: customStrategy });
      const component = fixture.componentInstance;
      const strategy = component.selectionStrategy();
      strategy.setCustomSelectionStrategy(customStrategy);

      // Test that custom strategy is used
      const dateRange = new DateRange<Date>(null, null);
      const result = strategy.selectionFinished(new Date(), dateRange);
      expect(customStrategy).toHaveBeenCalled();
      expect(result.start).toEqual(START_DATE);
      expect(result.end).toBeTruthy();
      // End date should be adjusted to end of day
      expect(result.end?.getHours()).toBe(23);
      expect(result.end?.getMinutes()).toBe(59);
      expect(result.end?.getSeconds()).toBe(59);
    });

    it('should adjust end date to end of day', async () => {
      const { fixture } = await setup();
      const component = fixture.componentInstance;
      const strategy = component.selectionStrategy();

      const startDate = new Date('2024-01-01T10:00:00');
      const endDate = new Date('2024-01-02T10:00:00');

      const dateRange = new DateRange<Date>(startDate, null);
      const result = strategy.selectionFinished(endDate, dateRange);

      expect(result.start).toEqual(startDate);
      expect(result.end).toBeTruthy();

      // Check that end date is at end of day (23:59:59)
      if (result.end) {
        expect(result.end.getHours()).toBe(23);
        expect(result.end.getMinutes()).toBe(59);
        expect(result.end.getSeconds()).toBe(59);
      }
    });
  });
});
