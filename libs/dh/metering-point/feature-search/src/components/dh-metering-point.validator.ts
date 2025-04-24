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

import { dhContainsLetters, dhIsValidMeteringPointId } from './dh-metering-point-utils';

export function dhMeteringPointIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '') {
      return null;
    }

    if (dhContainsLetters(control.value)) {
      return { containsLetters: true };
    }

    return dhIsValidMeteringPointId(control.value) ? null : { meteringPointIdLength: true };
  };
}
