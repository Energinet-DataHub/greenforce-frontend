import { formatInTimeZone } from 'date-fns-tz';

export type TValue = string | null | undefined;

export class DhDatetimeFormatService {
  private static danishTimeZoneIdentifier = 'Europe/Copenhagen';

  public static format(timeValue: TValue, format: string): string | null {
    if (timeValue == null) {
      return null;
    }

    return formatInTimeZone(
      timeValue,
      DhDatetimeFormatService.danishTimeZoneIdentifier,
      format
    );
  }
}
