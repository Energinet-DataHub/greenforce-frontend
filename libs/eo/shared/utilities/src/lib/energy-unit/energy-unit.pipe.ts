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
