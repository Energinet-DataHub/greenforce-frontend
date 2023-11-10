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

import { findNearestUnit } from './find-nearest-unit';

@Pipe({
  name: 'energyUnit',
  pure: true,
  standalone: true,
})
export class EnergyUnitPipe implements PipeTransform {
  transform(value: number | null | undefined, maxDecimals = 2): unknown {
    if (value === undefined || value === null) return '';

    const [nearestValue, nearestUnit] = findNearestUnit(value);

    const decimalPart = Number((nearestValue - Math.floor(nearestValue)).toFixed(maxDecimals));
    const formattedDecimalPart = decimalPart > 0 ? decimalPart.toString().substring(1) : '';
    return `${Math.floor(nearestValue)}${formattedDecimalPart} ${nearestUnit}`;
  }
}
