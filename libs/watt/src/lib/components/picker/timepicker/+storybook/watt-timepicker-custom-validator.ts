import { AbstractControl, ValidationErrors } from '@angular/forms';
import { dayjs } from '@energinet-datahub/watt/date';

export const startTimeCannotBeLaterThan3HoursValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const startTime = dayjs(value, 'HH:mm').toDate();

    if (startTime < dayjs().subtract(3, 'hours').toDate()) {
      return { startTimeCannotBeLaterThan3Hours: true };
    }

    return null;
  };
