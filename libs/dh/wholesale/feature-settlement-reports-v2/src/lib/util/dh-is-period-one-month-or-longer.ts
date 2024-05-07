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
import { WattRange, dayjs } from '@energinet-datahub/watt/date';

export function dhIsPeriodOneMonthOrLonger(period: WattRange<string>): boolean {
  const startOfMonth = dayjs(period.start).startOf('month').valueOf();
  const endOfMonth = dayjs(period.end).endOf('month').valueOf();

  const isStartOfMonth = dayjs(period.start).valueOf() === startOfMonth;
  const isEndOfMonth = dayjs(period.end).valueOf() === endOfMonth;

  if (isStartOfMonth && isEndOfMonth) {
    return true;
  }

  return dayjs(period.end).diff(dayjs(period.start), 'month') >= 1;
}
