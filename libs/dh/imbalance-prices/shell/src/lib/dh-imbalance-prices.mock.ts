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
import { ImbalancePriceStatus, PriceAreaCode } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhImbalancePrice } from './dh-imbalance-prices';

export const dhImbalancePricesMock: DhImbalancePrice[] = [
  {
    name: '2024-01-01T00:00+01:00',
    priceAreaCode: PriceAreaCode.Dk1,
    status: ImbalancePriceStatus.Complete,
  },
  {
    name: '2024-01-01T00:00+01:00',
    priceAreaCode: PriceAreaCode.Dk2,
    status: ImbalancePriceStatus.MissingPrices,
  },
  {
    name: '2023-12-01T00:00+01:00',
    priceAreaCode: PriceAreaCode.Dk1,
    status: ImbalancePriceStatus.Complete,
  },
  {
    name: '2023-12-01T00:00+01:00',
    priceAreaCode: PriceAreaCode.Dk2,
    status: ImbalancePriceStatus.MissingPrices,
  },
];
