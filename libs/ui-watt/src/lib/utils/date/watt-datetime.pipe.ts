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

@Pipe({
  name: 'wattDateTime',
  standalone: true,
})
export class WattDateTimePipe implements PipeTransform {
  /**
   * @param maybeIso8601DateTime DateTime in ISO 8601 format (e.g. 2021-12-01T23:00:00Z)
   */
  transform(maybeIso8601DateTime?: string | null) {
    return !maybeIso8601DateTime
      ? null
      : formatInTimeZone(maybeIso8601DateTime, 'Europe/Copenhagen', 'dd-MM-yyyy HH:mm');
  }
}
