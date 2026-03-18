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
import { effect, EffectRef } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

import { dhSetControlValidators, DhSetControlValidatorsOptions } from './dh-set-control-validators';

/** Creates an effect that syncs validators on a control based on a reactive condition. */
export function dhSyncControlValidators(
  control: () => AbstractControl,
  validators: ValidatorFn | ValidatorFn[],
  condition: () => boolean,
  options?: DhSetControlValidatorsOptions
): EffectRef {
  return effect(() => dhSetControlValidators(control(), validators, condition(), options));
}

export interface DhSwapControlValidatorsEntry {
  validators: ValidatorFn | ValidatorFn[];
  active: () => boolean;
  reset?: boolean;
}

/** Creates an effect that swaps multiple validator sets on a control based on reactive conditions. */
export function dhSwapControlValidators(
  control: () => AbstractControl,
  entries: DhSwapControlValidatorsEntry[]
): EffectRef {
  return effect(() => {
    const ctrl = control();
    for (const entry of entries) {
      if (entry.active()) {
        ctrl.addValidators(entry.validators);
      } else {
        ctrl.removeValidators(entry.validators);
        if (entry.reset) ctrl.reset();
      }
    }
    ctrl.updateValueAndValidity();
  });
}
