import { AbstractControl, ValidationErrors } from '@angular/forms';

import { dayjs } from '@energinet-datahub/watt/date';

export const dhDateCannotBeOlderThanTodayValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const controlStart = control.value as string;
    if (!controlStart) return null;

    const now = dayjs();
    const startDate = dayjs(controlStart);

    if (startDate.isBefore(now, 'day')) {
      return { dateCannotBeOlderThanTodayValidator: true };
    }

    return null;
  };
