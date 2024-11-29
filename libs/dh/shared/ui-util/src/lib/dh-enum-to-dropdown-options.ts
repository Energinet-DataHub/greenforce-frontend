import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

export function dhEnumToWattDropdownOptions<T extends object>(
  enumObj: T,
  exclude?: string[]
): WattDropdownOptions {
  return Object.keys(enumObj)
    .map((key) => ({
      displayValue: key,
      value: Object.values(enumObj)[Object.keys(enumObj).indexOf(key)],
    }))
    .filter(({ value }) => !exclude?.includes(value));
}
