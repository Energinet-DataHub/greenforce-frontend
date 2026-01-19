import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { dhCvrValidator } from '@energinet-datahub/dh/shared/ui-validators';
import { environment } from '@energinet-datahub/dh/shared/environments';

const MOVE_IN_TEST_CVRS = new Set(['11111111', '22222222']);

export function dhMoveInCvrValidator(): ValidatorFn {
  const baseValidator = dhCvrValidator();

  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    // Allow test CVR numbers in non-production environments,
    // but ONLY for feature-move-in components.
    if (!environment.production && MOVE_IN_TEST_CVRS.has(value)) {
      return null;
    }

    return baseValidator(control);
  };
}
