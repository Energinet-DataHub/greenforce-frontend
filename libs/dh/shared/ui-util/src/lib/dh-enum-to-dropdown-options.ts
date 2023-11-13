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
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

export function dhEnumToWattDropdownOptions<T extends object>(
  enumObj: T,
  exclude?: string[],
  sort: 'asc' | 'desc' = 'asc'
) {
  return Object.keys(enumObj)
    .map((key) => ({
      displayValue: key,
      value: Object.values(enumObj)[Object.keys(enumObj).indexOf(key)],
    }))
    .sort((a, b) => {
      if (sort === 'asc') {
        return a.displayValue.localeCompare(b.displayValue);
      } else {
        return b.displayValue.localeCompare(a.displayValue);
      }
    })
    .filter(({ value }) => !exclude?.includes(value)) as WattDropdownOptions;
}
