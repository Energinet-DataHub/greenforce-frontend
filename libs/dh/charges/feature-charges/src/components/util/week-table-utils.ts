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
import { dayjs } from '@energinet/watt/core/date';

import { DhChargeIntervalPipe } from '@energinet-datahub/dh/charges/feature-ui-shared';

import { ChargeSeriesPointLite } from '../../types';

export function computeRowLabels(weekStart: Date, weekEnd: Date): string[] {
  const pipe = new DhChargeIntervalPipe();
  const totalHours = dayjs(weekEnd).diff(dayjs(weekStart), 'hour');

  const labels = Array.from({ length: totalHours }, (_, i) => dayjs(weekStart).add(i, 'hour'))
    .map((start) => ({ start: start.toDate(), end: start.add(1, 'hour').toDate() }))
    .map((range) => pipe.transform(range, 'HOURLY'))
    // Ensure the correct order of labels in case of DST transition

    // In case of DST start
    // 00 - 01
    // 01 - 02
    // 01 - 03 (DST start)
    // 02 - 03

    // In case of DST end
    // 00 - 01
    // 01 - 02
    // 02 - 02 (DST end)
    // 02 - 03
    .toSorted();

  return [...new Set(labels)];
}

export function groupSeriesByDay(
  series: ChargeSeriesPointLite[]
): Partial<Record<string, ChargeSeriesPointLite[]>> {
  return Object.groupBy(series, (point) =>
    dayjs(point.interval.start).startOf('day').toISOString()
  );
}
