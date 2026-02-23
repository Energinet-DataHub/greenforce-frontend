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
import { effect, linkedSignal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

/** Helper function for creating a writeable signal for the value of a FormControl. */
export const dhFormControlToSignal = <T>(control: FormControl<T>): WritableSignal<T> => {
  const value = linkedSignal(toSignal(control.valueChanges, { initialValue: control.value }));
  effect(() => {
    if (value() === control.value) return;
    control.setValue(value());
    control.updateValueAndValidity();
  });

  return value;
};
