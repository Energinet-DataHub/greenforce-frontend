//#region License
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
//#endregion
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { dayjs } from '@energinet-datahub/watt/date';

export function dhCprValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '') {
      return null;
    }

    if (/[a-zA-Z]/.test(control.value)) {
      return { containsLetters: true };
    }

    if (/-/.test(control.value)) {
      return { containsDash: true };
    }

    if (!(/^\d{10}$/.test(control.value))) {
      return { invalidCprLength: true };
    }

    if (!(dayjs(control.value.slice(0, 6), 'DDMMYY', true).isValid())) {
      return { invalidDate: true }
    }

    if (control.value === '1111111111') {
      return { allOnes: true };
    }

    return null;
  };
}
