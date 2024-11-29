import { AbstractControl, ValidationErrors } from '@angular/forms';

import { WattRange, dayjs } from '@energinet-datahub/watt/date';

export const dhStartDateIsNotBeforeDateValidator =
  (date: Date) =>
  (control: AbstractControl<WattRange<string> | null>): ValidationErrors | null => {
    const range = control.value;

    if (range === null) {
      return null;
    }

    if (dayjs(range.start).isBefore(date)) {
      return { startDateIsBeforeMinDate: true };
    }

    return null;
  };
