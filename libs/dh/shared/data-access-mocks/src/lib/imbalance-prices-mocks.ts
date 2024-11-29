import { HttpResponse, delay, http } from 'msw';
import { mswConfig } from '@energinet-datahub/gf/util-msw';

import {
  mockGetImbalancePricesMonthOverviewQuery,
  mockGetImbalancePricesOverviewQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { imbalancePricesOverviewQueryMock } from './data/imbalance-prices/imbalance-prices-overview-query';
import { imbalancePricesMonthOverviewQueryMock } from './data/imbalance-prices/imbalance-prices-month-overview-query';

export function imbalancePricesMocks(apiBase: string) {
  return [
    getImbalancePricesOverviewQuery(apiBase),
    imbalancePricesUploadImbalanceCSV(apiBase),
    imbalancePricesDownloadImbalanceCSV(apiBase),
    getImbalancePricesMonthOverviewQuery(apiBase),
  ];
}

function getImbalancePricesOverviewQuery(apiBase: string) {
  return mockGetImbalancePricesOverviewQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: imbalancePricesOverviewQueryMock(apiBase),
    });
  });
}

function getImbalancePricesMonthOverviewQuery(apiBase: string) {
  return mockGetImbalancePricesMonthOverviewQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: imbalancePricesMonthOverviewQueryMock(apiBase),
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
    return HttpResponse.text(
      'header1;header2;header3\nrow1col1;row1col2;row1col3\nrow2col1;row2col2;row2col3\nrow3col1;row3col2;row3col3',
      { status: 200 }
    );
  });
}
