import { formatInTimeZone } from 'date-fns-tz';

const danishTimeZoneIdentifier = 'Europe/Copenhagen';
export type TValue = string | null | undefined;

export function dhFormatDanishDatetime(
  timeValue: TValue,
  format: string
): string | null {
  if (timeValue == null) {
    return null;
  }

  return formatInTimeZone(timeValue, danishTimeZoneIdentifier, format);
}
