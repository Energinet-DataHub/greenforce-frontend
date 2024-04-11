import { AbstractControl, ValidationErrors } from '@angular/forms';
import { dayjs } from '@energinet-datahub/watt/date';

export const startDateCannotBeOlderThan3DaysValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const startDate = dayjs(value).toDate();

    if (startDate < dayjs().subtract(3, 'days').toDate()) {
      return { startDateCannotBeOlderThan3Days: true };
    }

    return null;
  };
