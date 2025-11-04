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
import type { Signal } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export function dhFormToSignal<T extends { [K in keyof T]: AbstractControl }>(
  form: FormGroup<T>,
  useRawValue: true
): Signal<ReturnType<typeof form.getRawValue>>;

export function dhFormToSignal<T extends { [K in keyof T]: AbstractControl }>(
  form: FormGroup<T>,
  useRawValue?: boolean
): Signal<typeof form.value>;

export function dhFormToSignal<T extends { [K in keyof T]: AbstractControl }>(
  form: FormGroup<T>,
  useRawValue = false
) {
  return toSignal(
    form.valueChanges.pipe(map((value) => (useRawValue ? form.getRawValue() : value))),
    { initialValue: useRawValue ? form.getRawValue() : form.value }
  );
}
