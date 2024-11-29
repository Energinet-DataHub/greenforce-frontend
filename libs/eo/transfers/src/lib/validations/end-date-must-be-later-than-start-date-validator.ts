import { AbstractControl, FormGroup } from '@angular/forms';
import { clearErrors, setValidationErrors } from './utils';

export function endDateMustBeLaterThanStartDateValidator() {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const { startDate, endDate } = formGroup.controls;

    if (!endDate?.value || !startDate?.value) {
      return null;
    }

    if (endDate.value > startDate.value) {
      clearErrors('endDateMustBeLaterThanStartDate', endDate);
    } else if (!endDate.errors) {
      setValidationErrors('endDateMustBeLaterThanStartDate', endDate);
      endDate.markAsTouched();
      endDate.markAsDirty();
    }

    return null;
  };
}
