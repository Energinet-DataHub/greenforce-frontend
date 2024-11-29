import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function compareValidator(compareValue: string, validationName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValue = control.value;
    if (controlValue === compareValue) {
      return { [validationName]: true };
    }
    return null;
  };
}
