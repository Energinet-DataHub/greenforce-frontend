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
import { HttpResponse, delay, http } from 'msw';
import { mswConfig } from '@energinet-datahub/gf/util-msw';

import { mockGetImbalancePricesOverviewQuery } from '@energinet-datahub/dh/shared/domain/graphql';

import { imbalancePricesOverviewQueryMock } from './data/imbalance-prices/imbalance-prices-overview-query';

export function imbalancePricesMocks(apiBase: string) {
  return [
    getImbalancePricesOverviewQuery(),
    imbalancePricesUploadImbalanceCSV(apiBase),
    imbalancePricesDownloadImbalanceCSV(apiBase),
  ];
}

function getImbalancePricesOverviewQuery() {
  return mockGetImbalancePricesOverviewQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: imbalancePricesOverviewQueryMock,
    });
  });
}

function imbalancePricesUploadImbalanceCSV(apiBase: string) {
  return http.post(`${apiBase}/v1/ImbalancePrices/UploadImbalanceCSV`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 200 });
  });
}

function imbalancePricesDownloadImbalanceCSV(apiBase: string) {
  return http.get(`${apiBase}/v1/ImbalancePrices/DownloadImbalanceCSV`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.text('test', { status: 200 });
  });
}
