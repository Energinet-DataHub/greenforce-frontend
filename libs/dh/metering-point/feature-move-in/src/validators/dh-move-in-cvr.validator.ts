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
import { DhAppEnvironment, dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { inject, Injector, runInInjectionContext } from '@angular/core';

// In prod/preprod only the first test CVR is allowed as a bypass.
// In all other environments (local, dev, test) all three are allowed.
const TEST_CVR_PROD_PREPROD = new Set(['11111111']);
const TEST_CVR_ALL_ENVS = new Set(['11111111', '22222222', '33333333']);

const RESTRICTED_ENVIRONMENTS = new Set<DhAppEnvironment>([
  DhAppEnvironment.prod,
  DhAppEnvironment.preprod,
]);

export function dhMoveInCvrValidator(injector: Injector): ValidatorFn {
  return runInInjectionContext(injector, () => {
    const currentEnv = inject(dhAppEnvironmentToken).current;
    const baseValidator = dhCvrValidator();

    let bypassCvrs = TEST_CVR_ALL_ENVS;
    if (RESTRICTED_ENVIRONMENTS.has(currentEnv)) {
      bypassCvrs = TEST_CVR_PROD_PREPROD;
    }

    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '');
      if (bypassCvrs.has(value)) {
        return null;
      }

      return baseValidator(control);
    };
  });
}
