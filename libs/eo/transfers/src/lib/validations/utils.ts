import { AbstractControl } from '@angular/forms';

export function clearErrors(errorKey: string, ...fields: AbstractControl[]): void {
  fields.forEach((field) => {
    if (field && field.errors && field.errors[errorKey]) {
      // Copy the errors object
      const errors = { ...field.errors };
      // Remove the specific error
      delete errors[errorKey];
      // If there are no more errors, set the errors object to null, otherwise set it to the updated errors object
      field.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
  });
}

export function createTimestamp(dateValue: Date | string, timeValue: number): number {
  return new Date(dateValue).setHours(timeValue, 0, 0, 0);
}

export function setValidationErrors(errorKey: string, ...fields: AbstractControl[]): void {
  const error = { [errorKey]: true };
  fields.forEach((field) => field.setErrors(error));
}

export function setValidationErrorsWithData(
  errorKey: string,
  errorData: unknown,
  ...fields: AbstractControl[]
): void {
  const error = { [errorKey]: errorData };
  fields.forEach((field) => field.setErrors(error));
}
