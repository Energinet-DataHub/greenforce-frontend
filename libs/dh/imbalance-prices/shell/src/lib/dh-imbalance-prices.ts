import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  GetImbalancePricesMonthOverviewDocument,
  GetImbalancePricesOverviewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhImbalancePrice = ResultOf<
  typeof GetImbalancePricesOverviewDocument
>['imbalancePricesOverview']['pricePeriods'][0];

export type DhImbalancePricesForMonth = ResultOf<
  typeof GetImbalancePricesMonthOverviewDocument
>['imbalancePricesForMonth'][0];

export type DhImbalancePricesForDay = DhImbalancePricesForMonth['imbalancePrices'][0];

export type DhImbalancePricesForDayProcessed = Omit<DhImbalancePricesForDay, 'timestamp'> & {
  timestampFrom: DhImbalancePricesForDay['timestamp'];
  timestampTo: Date;
};
