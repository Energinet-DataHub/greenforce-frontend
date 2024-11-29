export function fromWh(value: number, unit: 'Wh' | 'kWh' | 'MWh' | 'GWh' | 'TWh'): number {
  switch (unit) {
    case 'Wh':
      return value;
    case 'kWh':
      return value / 1000;
    case 'MWh':
      return value / 1000000;
    case 'GWh':
      return value / 1000000000;
    case 'TWh':
      return value / 1000000000000;
    default:
      throw new Error(`Invalid unit: ${unit}`);
  }
}
