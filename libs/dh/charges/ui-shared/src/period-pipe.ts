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

import { dayjs, WattRange } from '@energinet/watt/date';
import { ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';
import { capitalize } from '@energinet-datahub/dh/shared/util-text';

@Pipe({
  name: 'dhChargesPeriod',
})
export class DhChargesPeriodPipe implements PipeTransform {
  transform(input?: WattRange<Date>, resolution?: ChargeResolution) {
    if (!input) return '';
    const start = dayjs(input.start);
    const end = dayjs(input.end).add(1, 'ms');
    switch (resolution) {
      case 'QUARTER_HOURLY':
        return `${start.format('HH:mm')} — ${end.format('HH:mm')}`;
      case 'HOURLY':
        return `${start.format('HH')} — ${end.format('HH')}`;
      case 'DAILY':
        return start.format('DD');
      case 'MONTHLY':
        return capitalize(start.format('MMMM'));
      default:
        return `${start.format('DD-MM-YYYY HH:mm')} — ${end.format('DD-MM-YYYY HH:mm')}`;
    }
  }
}
