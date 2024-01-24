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
import {
  GetImbalancePriceByMonthAndYearQuery,
  ImbalancePrice,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';

const dailyPrices: ImbalancePrice[] = [
  {
    __typename: 'ImbalancePrice',
    price: 4.321,
    priceAreaCode: PriceAreaCode.Dk1,
    timestamp: new Date('2024-01-01T00:00+01:00'),
  },
  {
    __typename: 'ImbalancePrice',
    price: 3.321,
    priceAreaCode: PriceAreaCode.Dk1,
    timestamp: new Date('2024-01-01T00:00+02:00'),
  },
  {
    __typename: 'ImbalancePrice',
    price: 2.321,
    priceAreaCode: PriceAreaCode.Dk2,
    timestamp: new Date('2024-01-01T00:00+03:00'),
  },
  {
    __typename: 'ImbalancePrice',
    price: 1.321,
    priceAreaCode: PriceAreaCode.Dk2,
    timestamp: new Date('2024-01-01T00:00+04:00'),
  },
];

export const imbalancePricesByMonthAndYearQueryMock: GetImbalancePriceByMonthAndYearQuery = {
  __typename: 'Query',
  imbalancePricesForMonth: [
    {
      __typename: 'ImbalancePriceDaily',
      imbalancePrices: dailyPrices,
    },
  ],
};
