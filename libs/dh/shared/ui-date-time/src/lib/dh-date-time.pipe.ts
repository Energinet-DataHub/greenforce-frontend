import { Pipe, PipeTransform } from '@angular/core';
import { formatInTimeZone } from 'date-fns-tz';

const danishTimeZoneIdentifier = 'Europe/Copenhagen';

@Pipe({
  name: 'dhDate',
})
export class DhDatePipe implements PipeTransform {
  /**
   *
   * @param maybeIso8601DateTime Date time in ISO 8601 format (e.g. 2021-12-01T23:00:00Z)
   * @returns
   */
  transform(maybeIso8601DateTime: string | null | undefined): string | null {
    if (maybeIso8601DateTime == null) {
      return null;
    }

    const dateFormat = 'dd-MM-yyyy';

    return formatInTimeZone(
      maybeIso8601DateTime,
      danishTimeZoneIdentifier,
      dateFormat
    );
  }
}
