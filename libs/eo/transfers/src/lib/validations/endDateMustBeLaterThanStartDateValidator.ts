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
import { AbstractControl, FormGroup } from '@angular/forms';
import { clearErrors, createTimestamp, setValidationErrors } from './utils';

export function endDateMustBeLaterThanStartDateValidator() {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const { startDate, startDateTime, endDate, endDateTime, hasEndDate } = formGroup.controls;

    const shouldValidate = shouldValidateEndDate(
      hasEndDate,
      startDate,
      startDateTime,
      endDate,
      endDateTime
    );
    const startTimestamp = createTimestamp(startDate.value, parseInt(startDateTime.value));
    const endTimestamp = createTimestamp(endDate.value, parseInt(endDateTime.value));

    if (!shouldValidate || endTimestamp > startTimestamp) {
      clearErrors('endDateMustBeLaterThanStartDate', endDate, endDateTime);
    } else {
      setValidationErrors('endDateMustBeLaterThanStartDate', endDate, endDateTime);
    }

    return null;
  };
}

function shouldValidateEndDate(hasEndDate: AbstractControl, ...fields: AbstractControl[]): boolean {
  return hasEndDate.value && !anyFieldIsMissing(...fields);
}

function anyFieldIsMissing(...fields: AbstractControl[]): boolean {
  return fields.some((field) => !field.value);
}
