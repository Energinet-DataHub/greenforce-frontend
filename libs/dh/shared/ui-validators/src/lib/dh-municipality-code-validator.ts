import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dhMunicipalityCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '' || control.value === null) {
      return null;
    }

    if (/[a-zA-Z]/.test(control.value)) {
      return { containsLetters: true };
    }

    if (/^0/.test(control.value)) {
      return { startsWithZero: true };
    }

    if (/^\d{3}$/.test(control.value)) {
      return null;
    }

    return { invalidMunicipalityCodeLength: true };
  };
}
