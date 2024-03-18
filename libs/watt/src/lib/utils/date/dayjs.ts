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
import dayjs, { OpUnitType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Injectable } from '@angular/core';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

@Injectable({
  providedIn: 'root',
})
class WattDateUtils {
  startOf(date: Date, unit: OpUnitType): Date {
    return dayjs(date).startOf(unit).toDate();
  }

  isValid(date: Date | string): boolean {
    return dayjs(date).isValid();
  }

  utc(date: Date | string): Date {
    return dayjs(date).utc().toDate();
  }

  endOf(date: Date, unit: OpUnitType): Date {
    return dayjs(date).endOf(unit).toDate();
  }

  toTimeZone(date: Date | string, timeZone: string): Date | null {
    if (this.isValid(date)) {
      return dayjs(date).tz(timeZone).toDate();
    } else {
      const maybeShortFormattedDate = this.parse(date, 'DD-MM-YYYY');
      if (this.isValid(maybeShortFormattedDate)) {
        return this.toTimeZone(maybeShortFormattedDate, timeZone);
      } else {
        return null;
      }
    }
  }

  parse(date: Date | string, format?: string) {
    return dayjs(date, format).toDate();
  }

  format(date: string, format: string, timezone: string): string {
    return dayjs(date).tz(timezone).format(format);
  }
}

export { dayjs, WattDateUtils };
