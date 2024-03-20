/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { dayjs } from './dayjs';
import { WattRange } from './watt-date-range';

const formatStrings = {
  monthYear: 'MMMM YYYY',
  short: 'DD-MM-YYYY',
  long: 'DD-MM-YYYY, HH:mm',
  longAbbr: 'DD-MMM-YYYY HH:mm',
  time: 'HH:mm',
  longAbbrWithSeconds: 'DD-MMM-YYYY HH:mm:ss',
};

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
    if (!input) return null;

    return input instanceof Date || typeof input === 'string'
      ? dayjs(input).tz(timeZone).format(formatStrings[format])
      : typeof input === 'number'
        ? dayjs(new Date(input)).tz(timeZone).format(formatStrings[format])
        : `${this.transform(input.start, format)} ― ${this.transform(input.end, format)}`;
  }
}
