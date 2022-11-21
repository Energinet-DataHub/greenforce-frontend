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
import {
  ChargePriceV1Dto,
  Resolution,
} from '@energinet-datahub/dh/shared/domain';
import { format, getHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const timeFormat = 'HH:mm';
const danishTimeZoneIdentifier = 'Europe/Copenhagen';

export function getFromDateTime(
  price: ChargePriceV1Dto,
  resolution: Resolution
) {
  const fromDateTime = toDanishTimeZone(price.fromDateTime);

  if (resolution == Resolution.PT1H) return formatHours(fromDateTime, 0);

  return format(fromDateTime, timeFormat);
}

export function getToDateTime(price: ChargePriceV1Dto, resolution: Resolution) {
  const toDateTime = toDanishTimeZone(price.toDateTime);

  if (resolution == Resolution.PT1H) {
    const fromDateTime = toDanishTimeZone(price.fromDateTime);

    // If fromDateTime is winter and toDateTime is summer, remove 1 hour from ToDateTime
    if (fromDateTime.getTimezoneOffset() > toDateTime.getTimezoneOffset())
      return formatHours(toDateTime, -1);

    const fromDateTimeUtc = new Date(price.fromDateTime);
    const toDateTimeUtc = new Date(price.toDateTime);
    // If fromDateTime is summer and toDateTime is winter, add 1 hour to ToDateTime
    if (
      fromDateTimeUtc.getTimezoneOffset() < toDateTimeUtc.getTimezoneOffset()
    ) {
      return formatHours(toDateTimeUtc, 1);
    }

    return formatHours(toDateTime, 0);
  }

  return format(toDateTime, timeFormat);
}

function formatHours(date: Date, hoursToAdd: number) {
  const dateHours = getHours(date);
  const hours = Number(dateHours) + hoursToAdd;

  return addLeadingZeros(hours, 2);
}

function addLeadingZeros(number: number, totalLength: number): string {
  return String(number).padStart(totalLength, '0');
}

function toDanishTimeZone(value: string): Date {
  return utcToZonedTime(value, danishTimeZoneIdentifier);
}
