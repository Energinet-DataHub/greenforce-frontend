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
import { capitalize } from '@energinet-datahub/dh/shared/util-text';
import { ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';

const formatTime = (index: number, resolution: ChargeResolution) => {
  const today = dayjs();
  switch (resolution) {
    case 'QuarterHourly':
      return `${today.minute(index * 15).format('mm')} — ${today.minute((index + 1) * 15).format('mm')}`;
    case 'Hourly':
      return `${today.hour(index).format('HH')} — ${today.hour(index + 1).format('HH')}`;
    case 'Daily':
      return today.date(index + 1).format('DD');
    case 'Monthly':
      return capitalize(today.month(index).format('MMMM'));
    case 'Unknown':
      return index + 1;
  }
};

export default formatTime;
