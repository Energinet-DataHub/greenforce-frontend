import { AbstractControl, ValidatorFn } from '@angular/forms';
import { WattRange, dayjs } from '@energinet-datahub/watt/date';

type rangeControl = AbstractControl<WattRange<string>>;

export const max31DaysDateRangeValidator: ValidatorFn = ({ value }: rangeControl) => {
  if (!value?.end || !value?.start) return null;
  // Since the date range does not include the last millisecond (ends at 23:59:59.999),
  // this condition checks for 30 days, not 31 days (as the diff is in whole days only).
  return dayjs(value.end).diff(value.start, 'days') > 30 ? { max31DaysDateRange: true } : null;
};
