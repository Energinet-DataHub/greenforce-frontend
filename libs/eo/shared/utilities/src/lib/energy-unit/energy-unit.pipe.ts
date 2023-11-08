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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'energyUnit',
  pure: true,
  standalone: true
})
export class EnergyUnitPipe implements PipeTransform {
  transform(value: number | null | undefined, maxDecimals = 2): unknown {
    if (!value) return '';

    const units = ['Wh', 'kWh', 'MWh', 'GWh', 'TWh'];
    let unitIndex = 0;
    let originalValue = value;

    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000;
      originalValue /= 1000;
      unitIndex++;
    }

    const decimalPart = Number((originalValue - Math.floor(value)).toFixed(maxDecimals));
    const formattedDecimalPart = decimalPart > 0 ? decimalPart.toString().substring(1) : '';
    return `${Math.floor(value)}${formattedDecimalPart} ${units[unitIndex]}`;
  }
}
