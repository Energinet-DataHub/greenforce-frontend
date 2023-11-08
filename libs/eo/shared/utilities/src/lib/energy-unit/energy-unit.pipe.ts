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
