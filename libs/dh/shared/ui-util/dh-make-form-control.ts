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
import { AsyncValidatorFn, FormControl, FormControlState, ValidatorFn } from '@angular/forms';

type ValidatorsOpts = ValidatorFn | ValidatorFn[];
type AsyncValidatorsOpts = AsyncValidatorFn | AsyncValidatorFn[];

/**
 * Helper function for creating form control with `nonNullable` based on value.
 */
export function dhMakeFormControl<T>(
  value: T | FormControlState<T>,
  validators?: ValidatorsOpts,
  asyncValidators?: AsyncValidatorsOpts
): FormControl<T>;

export function dhMakeFormControl<T>(
  value?: T | null | FormControlState<T | null>,
  validators?: ValidatorsOpts,
  asyncValidators?: AsyncValidatorsOpts
): FormControl<T | null>;

export function dhMakeFormControl(
  value: unknown = null,
  validators?: ValidatorsOpts,
  asyncValidators?: AsyncValidatorsOpts
) {
  return new FormControl(value, { nonNullable: Boolean(value), validators, asyncValidators });
}
