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
import { ChargePricesSubPaths } from '@energinet-datahub/dh/core/configuration-routing';
import { ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';

export function correctChargeTypeView(resolution?: ChargeResolution): ChargePricesSubPaths {
  switch (resolution) {
    case 'DAILY':
      return 'month';
    case 'MONTHLY':
      return 'year';
    case 'QUARTER_HOURLY':
    case 'HOURLY':
    default:
      return 'day';
  }
}
