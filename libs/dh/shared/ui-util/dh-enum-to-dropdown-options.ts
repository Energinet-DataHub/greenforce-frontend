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
import { WattDropdownOptions } from '@energinet/watt/dropdown';

export function dhEnumToWattDropdownOptions<T extends object>(
  enumObj: T,
  exclude?: T[keyof T][],
  disabled?: T[keyof T][]
): WattDropdownOptions {
  return Object.entries(enumObj)
    .filter(([, value]) => !exclude?.includes(value))
    .map(([key, value]) => ({
      displayValue: key,
      value,
      disabled: disabled?.includes(value) ?? false,
    }));
}
