import { AbstractControl } from "@angular/forms";

export function clearErrors(...fields: AbstractControl[]): void {
  fields.forEach(field => field.setErrors(null));
}

export function createTimestamp(dateValue: Date | string, timeValue: number): number {
  return new Date(dateValue).setHours(timeValue, 0, 0, 0);
}

export function setValidationErrors(errorKey: string, ...fields: AbstractControl[]): void {
  const error = { [errorKey]: true };
  fields.forEach(field => field.setErrors(error));
}
