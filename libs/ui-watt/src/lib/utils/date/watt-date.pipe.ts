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
import { formatInTimeZone } from 'date-fns-tz';

export interface WattDateRange<T> {
  start: T | null;
  end: T | null;
}

const formatStrings = {
  short: 'dd-MM-yyyy',
  long: 'dd-MM-yyyy HH:mm',
};

@Pipe({
  name: 'wattDate',
  standalone: true,
})
export class WattDatePipe<T extends Date | string> implements PipeTransform {
  /**
   * @param input WattDateRange or string in ISO 8601 format
   */
  transform(
    input?: WattDateRange<T> | T | null,
    format: keyof typeof formatStrings = 'short'
  ): string | null {
    if (!input) return null;
    return input instanceof Date || typeof input === 'string'
      ? formatInTimeZone(input, 'Europe/Copenhagen', formatStrings[format])
      : `${this.transform(input.start, format)} ― ${this.transform(input.end, format)}`;
  }
}
