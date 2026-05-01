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

import { WattRange, dayjs, wattFormatDate } from '@energinet/watt/date';

@Pipe({
  name: 'dhChargePeriod',
})
export class DhChargePeriodPipe implements PipeTransform {
  transform(input?: WattRange<Date> | null): string {
    if (!input) return '';
    const start = wattFormatDate(input.start);
    if (!input.end) return start ?? '';
    if (dayjs(input.start).toDate().getTime() === dayjs(input.end).toDate().getTime())
      return start ?? '';
    const end = wattFormatDate(input.end);
    return `${start} — ${end}`;
  }
}
