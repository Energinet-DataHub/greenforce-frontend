/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
