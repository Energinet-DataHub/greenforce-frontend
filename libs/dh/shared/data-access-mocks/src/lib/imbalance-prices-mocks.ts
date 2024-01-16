import { mockGetImbalancePricesOverviewQuery } from '@energinet-datahub/dh/shared/domain/graphql';
import { imbalancePricesOverviewQueryMock } from './data/imbalance-prices/imbalance-prices-overview-query';

export function imbalancePricesMocks() {
  return [getImbalancePricesOverviewQuery()];
}

function getImbalancePricesOverviewQuery() {
  return mockGetImbalancePricesOverviewQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data(imbalancePricesOverviewQueryMock));
  });
}
