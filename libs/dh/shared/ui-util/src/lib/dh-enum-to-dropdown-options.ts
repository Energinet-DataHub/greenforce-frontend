import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

export function enumToDropdownOptions<T extends object>(enumObj: T) {
  return Object.keys(enumObj).map((key) => ({
    displayValue: key,
    value: Object.values(enumObj)[Object.keys(enumObj).indexOf(key)],
  })) as WattDropdownOptions;
}
