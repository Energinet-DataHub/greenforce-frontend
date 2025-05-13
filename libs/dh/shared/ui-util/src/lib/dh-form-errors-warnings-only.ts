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
import { FormGroup, ValidationErrors } from '@angular/forms';

/**
 * Returns `true` if the provided `FormGroup` has either no errors
 * OR all errors are marked with `warning: true`.
 */
export function dhFormErrorsWarningsOnly(form: FormGroup) {
  return Object.keys(form.controls).every((key) => {
    const errors: ValidationErrors | null = form.get(key)?.errors ?? null;
    return !errors ? true : Object.keys(errors).every((key) => errors[key]?.warning);
  });
}
