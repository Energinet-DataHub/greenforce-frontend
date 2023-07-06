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

export function nextHourOrLaterValidator() {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const { startDate, startDateTime } = formGroup.controls;
    const nextHour = new Date().getHours() + 1;

    const validTimestamp = createTimestamp(new Date(), nextHour);
    const startTimestamp = createTimestamp(
      new Date(startDate.value),
      parseInt(startDateTime.value)
    );

    if (startDate.errors || !startDate.value || startTimestamp < validTimestamp) {
      setValidationErrors('nextHourOrLater', startDate, startDateTime);
    } else {
      clearErrors('nextHourOrLater', startDate, startDateTime);
    }

    return null;
  };
}
