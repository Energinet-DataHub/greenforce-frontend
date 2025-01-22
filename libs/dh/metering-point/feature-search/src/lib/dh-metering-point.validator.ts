import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isValidMeteringPointId } from './dh-is-valid-metering-point-id';

export function dhMeteringPointIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '') {
      return null;
    }

    return isValidMeteringPointId(control.value) ? null : { invalidMeteringPointId: true };
  };
}
