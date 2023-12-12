import { AbstractControl, ValidationErrors } from '@angular/forms';
import { WattRange } from '@energinet-datahub/watt/date';
import { differenceInDays, parseISO, subYears } from 'date-fns';

export const maxOneMonthDateRangeValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;

    if (!range) return null;

    const rangeInDays = differenceInDays(parseISO(range.end), parseISO(range.start));
    if (rangeInDays > 31) {
      return { maxOneMonthDateRange: true };
    }

    return null;
  };

export const startDateCannotBeAfterEndDateValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;

    if (!range) return null;

    const startDate = parseISO(range.start);
    const endDate = parseISO(range.end);

    if (startDate > endDate) {
      return { startDateCannotBeAfterEndDate: true };
    }

    return null;
  };

export const startDateCannotBeOlderThan3YearsValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;
    if (!range) return null;

    const startDate = parseISO(range.start);

    if (startDate < subYears(new Date(), 3)) {
      return { startDateCannotBeOlderThan3Years: true };
    }

    return null;
  };

export const startAndEndDateCannotBeInTheFutureValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;
    if (!range) return null;

    const endDate = parseISO(range.end);
    const startDate = parseISO(range.start);

    if (endDate > new Date() || startDate > new Date()) {
      return { startAndEndDateCannotBeInTheFuture: true };
    }

    return null;
  };
