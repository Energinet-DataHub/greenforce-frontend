export function findNearestUnit(value: number): [number, string] {
  const units = ['Wh', 'kWh', 'MWh', 'GWh', 'TWh'];
  let unitIndex = 0;
  let originalValue = value;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    originalValue /= 1000;
    unitIndex++;
  }

  return [originalValue, units[unitIndex]];
}
