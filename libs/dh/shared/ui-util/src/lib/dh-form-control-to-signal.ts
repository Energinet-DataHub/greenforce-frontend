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
import { computed, effect, linkedSignal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';

/** Helper function for creating a writeable signal for the value of a FormControl. */
export const dhFormControlToSignal = <T>(
  formControl: FormControl<T> | (() => FormControl<T>)
): WritableSignal<T> => {
  const control = computed(() => (typeof formControl === 'function' ? formControl() : formControl));
  const value = linkedSignal<T>(() => control().value);

  effect((onCleanup) => {
    const subscription = control().valueChanges.subscribe((v) => value.set(v));
    return onCleanup(() => subscription.unsubscribe());
  });

  effect(() => {
    if (value() === control().value) return;
    control().setValue(value());
    control().updateValueAndValidity();
  });

  return value;
};
