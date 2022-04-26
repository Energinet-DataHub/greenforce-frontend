import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class WattRangeValidators {
  static required(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value?.start && control.value?.end
        ? null
        : { requiredRange: true };
    };
  }
  static startRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value?.start ? null : { startOfRangeRequired: true };
    };
  }
  static endRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value?.end ? null : { endOfRangeRequired: true };
    };
  }
}
