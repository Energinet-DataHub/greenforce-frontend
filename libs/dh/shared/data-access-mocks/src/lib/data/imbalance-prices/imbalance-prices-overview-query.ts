import {
  GetImbalancePricesOverviewQuery,
  ImbalancePricePeriod,
  ImbalancePriceStatus,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';

const pricePeriods: ImbalancePricePeriod[] = [
  {
    __typename: 'ImbalancePricePeriod',
    name: new Date('2024-01-01T00:00+01:00'),
    priceAreaCode: PriceAreaCode.Dk1,
    status: ImbalancePriceStatus.Complete,
  },
  {
    __typename: 'ImbalancePricePeriod',
    name: new Date('2024-01-01T00:00+01:00'),
    priceAreaCode: PriceAreaCode.Dk2,
    status: ImbalancePriceStatus.InComplete,
  },
  {
    __typename: 'ImbalancePricePeriod',
    name: new Date('2023-12-01T00:00+01:00'),
    priceAreaCode: PriceAreaCode.Dk1,
    status: ImbalancePriceStatus.Complete,
  },
  {
    __typename: 'ImbalancePricePeriod',
    name: new Date('2023-12-01T00:00+01:00'),
    priceAreaCode: PriceAreaCode.Dk2,
    status: ImbalancePriceStatus.InComplete,
  },
];

export const imbalancePricesOverviewQueryMock = (apiBase: string) =>
  ({
    __typename: 'Query',
    imbalancePricesOverview: {
      __typename: 'ImbalancePricesOverview',
      uploadImbalancePricesUrl: `${apiBase}/v1/ImbalancePrices/DownloadImbalanceCSV`,
      pricePeriods,
    },
  }) as GetImbalancePricesOverviewQuery;
