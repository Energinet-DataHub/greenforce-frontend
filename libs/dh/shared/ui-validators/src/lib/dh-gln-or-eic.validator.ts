import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const glnOrEicRegExp = /(^\d{13}$)|(^[a-zA-Z0-9-]{16}$)/;

export function dhGlnOrEicValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '') {
      return null;
    }

    return glnOrEicRegExp.test(control.value) ? null : { invalidGlnOrEic: true };
  };
}
