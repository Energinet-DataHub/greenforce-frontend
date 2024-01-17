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
import { rest } from 'msw';

import { mockGetImbalancePricesOverviewQuery } from '@energinet-datahub/dh/shared/domain/graphql';

import { imbalancePricesOverviewQueryMock } from './data/imbalance-prices/imbalance-prices-overview-query';

export function imbalancePricesMocks(apiBase: string) {
  return [getImbalancePricesOverviewQuery(), imbalancePricesUploadImbalanceCSV(apiBase)];
}

function getImbalancePricesOverviewQuery() {
  return mockGetImbalancePricesOverviewQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data(imbalancePricesOverviewQueryMock));
  });
}

function imbalancePricesUploadImbalanceCSV(apiBase: string) {
  return rest.post(`${apiBase}/v1/ImbalancePrices/UploadImbalanceCSV`, (req, res, ctx) => {
    return res(ctx.delay(300), ctx.status(200));
  });
}
