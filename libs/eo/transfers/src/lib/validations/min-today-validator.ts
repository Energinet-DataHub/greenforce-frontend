import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isBefore } from 'date-fns';

export function minTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValue = control.value;
    console.log('value', controlValue)
    if (!controlValue) {
      // if the control is empty, return no error
      return null;
    }

    const today = new Date();

    // set the time of today to 00:00:00 to compare only the date part
    today.setHours(0, 0, 0, 0);

    if (isBefore(new Date(controlValue), today)) {
      console.log('ERROR!!');
      // if the control date is before today, return an error
      return { minToday: true };
    } else {
      console.log('no error', new Date(controlValue), today);
    }

    // if the control date is today or in the future, return no error
    return null;
  };
}
