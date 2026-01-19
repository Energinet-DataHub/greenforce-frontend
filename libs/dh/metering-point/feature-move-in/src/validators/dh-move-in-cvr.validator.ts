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
