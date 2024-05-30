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
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isBefore } from 'date-fns';

export function minTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValue = control.value;
    if (!controlValue) {
      // if the control is empty, return no error
      return null;
    }

    const today = new Date();

    // set the time of today to 00:00:00 to compare only the date part
    today.setHours(0, 0, 0, 0);

    if (isBefore(new Date(controlValue), today)) {
      // if the control date is before today, return an error
      return { minToday: true };
    }
    // if the control date is today or in the future, return no error
    return null;
  };
}
