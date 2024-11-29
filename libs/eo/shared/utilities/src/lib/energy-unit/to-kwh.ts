export function toKWh(value: number, unit: 'Wh' | 'kWh' | 'MWh' | 'GWh' | 'TWh'): number {
  switch (unit) {
    case 'Wh':
      return value / 1000;
    case 'kWh':
      return value;
    case 'MWh':
      return value * 1000;
    case 'GWh':
      return value * 1000000;
    case 'TWh':
      return value * 1000000000;
    default:
      throw new Error(`Invalid unit: ${unit}`);
  }
}
