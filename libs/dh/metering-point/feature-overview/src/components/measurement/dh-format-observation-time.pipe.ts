//#region License
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
//#endregion
import { Pipe, PipeTransform } from '@angular/core';

import { dayjs } from '@energinet-datahub/watt/date';
import { Resolution } from '@energinet-datahub/dh/shared/domain/graphql';

@Pipe({
  name: 'dhFormatObservationTime',
})
export class DhFormatObservationTimePipe implements PipeTransform {
  transform(observationTime: Date | string | undefined | null, resolution: Resolution): string {
    if (!observationTime) return '';

    if (resolution === Resolution.Hourly) {
      const firstHour = dayjs(observationTime).format('HH');
      const lastHour = dayjs(observationTime).add(1, 'hour').format('HH');

      return this.startEnd(firstHour, lastHour);
    }

    if (resolution === Resolution.QuarterHourly) {
      const firstQuarter = dayjs(observationTime).format('HH:mm');
      const lastQuarter = dayjs(observationTime).add(15, 'minutes').format('HH:mm');

      return this.startEnd(firstQuarter, lastQuarter);
    }

    if (resolution === Resolution.Daily) {
      const firstDay = dayjs(observationTime).format('DD');
      const lastDay = dayjs(observationTime).add(1, 'day').format('DD');
      return this.startEnd(firstDay, lastDay);
    }

    if (resolution === Resolution.Monthly) {
      return dayjs(observationTime).format('MMMM');
    }

    return '';
  }

  private startEnd(start: string, end: string): string {
    return `${start} — ${end}`;
  }
}
