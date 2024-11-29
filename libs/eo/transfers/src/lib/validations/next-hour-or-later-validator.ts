import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nextHourOrLaterValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Don't validate disabled controls
    if (control.disabled || !control.value) {
      return null;
    }

    const datetime = new Date(control.value);
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

    if (datetime < nextHour) {
      return { nextHourOrLater: { value: control.value } };
    }

    return null;
  };
}
