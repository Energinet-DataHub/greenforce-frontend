import { Pipe, PipeTransform } from '@angular/core';

import { WattRange } from './watt-date-range';
import { formatStrings, wattFormatDate } from './watt-format-date';

@Pipe({
  name: 'wattDate',
  standalone: true,
})
export class WattDatePipe implements PipeTransform {
  /**
   * @param input WattDateRange or string in ISO 8601 format or unix timestamp number
   */
  transform(
    input?: WattRange<Date> | WattRange<string> | Date | string | number | null,
    format: keyof typeof formatStrings = 'short',
    timeZone = 'Europe/Copenhagen'
  ): string | null {
    return wattFormatDate(input, format, timeZone);
  }
}
