import {
  ImbalancePrice,
  ImbalancePriceDaily,
  ImbalancePriceDailyCompletenessStatus,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';

const imbalancePrices: ImbalancePrice[] = [
  {
    __typename: 'ImbalancePrice',
    priceAreaCode: PriceAreaCode.Dk1,
    price: 109.000451,
    timestamp: new Date('2024-01-01T00:00:00.000+01:00'),
  },
  {
    __typename: 'ImbalancePrice',
    priceAreaCode: PriceAreaCode.Dk1,
    price: 76.410051,
    timestamp: new Date('2024-01-01T01:00:00.000+01:00'),
  },
  {
    __typename: 'ImbalancePrice',
    priceAreaCode: PriceAreaCode.Dk1,
    price: -100.041549,
    timestamp: new Date('2024-01-01T02:00:00.000+01:00'),
  },
];

export const monthViewMock: ImbalancePriceDaily[] = [
  {
    __typename: 'ImbalancePriceDaily',
    timeStamp: new Date('2024-01-01'),
    status: ImbalancePriceDailyCompletenessStatus.Complete,
    imbalancePrices,
  },
  {
    __typename: 'ImbalancePriceDaily',
    timeStamp: new Date('2024-01-02'),
    status: ImbalancePriceDailyCompletenessStatus.InComplete,
    imbalancePrices,
  },
  {
    __typename: 'ImbalancePriceDaily',
    timeStamp: new Date('2024-01-03'),
    status: ImbalancePriceDailyCompletenessStatus.NoData,
    imbalancePrices,
  },
];
