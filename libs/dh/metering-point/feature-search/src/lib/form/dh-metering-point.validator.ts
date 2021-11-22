import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isValidMeteringPointId } from '@energinet-datahub/dh/metering-point/domain';

export function meteringPointIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return !isValidMeteringPointId(control.value)
      ? { invalidMeteringPointId: { value: control.value } }
      : null;
  };
}
