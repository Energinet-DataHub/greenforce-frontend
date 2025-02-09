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
import {
  GetImbalancePricesMonthOverviewQuery,
  ImbalancePrice,
  ImbalancePriceDaily,
  ImbalancePriceStatus,
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
  {
    __typename: 'ImbalancePrice',
    priceAreaCode: PriceAreaCode.Dk1,
    price: 0,
    timestamp: new Date('2024-01-01T03:00:00.000+01:00'),
  },
  {
    __typename: 'ImbalancePrice',
    priceAreaCode: PriceAreaCode.Dk1,
    price: null,
    timestamp: new Date('2024-01-01T04:00:00.000+01:00'),
  },
];

export const imbalancePricesForMonth = (apiBase: string): ImbalancePriceDaily[] => [
  {
    __typename: 'ImbalancePriceDaily',
    timeStamp: new Date('2024-01-01'),
    status: ImbalancePriceStatus.Complete,
    importedAt: new Date('2024-02-01'),
    imbalancePricesDownloadImbalanceUrl: `${apiBase}/v1/ImbalancePrices/DownloadImbalanceCSV`,
    imbalancePrices,
  },
  {
    __typename: 'ImbalancePriceDaily',
    timeStamp: new Date('2024-01-02'),
    status: ImbalancePriceStatus.InComplete,
    importedAt: null,
    imbalancePricesDownloadImbalanceUrl: `${apiBase}/v1/ImbalancePrices/DownloadImbalanceCSV`,
    imbalancePrices,
  },
  {
    __typename: 'ImbalancePriceDaily',
    timeStamp: new Date('2024-01-03'),
    status: ImbalancePriceStatus.NoData,
    importedAt: null,
    imbalancePricesDownloadImbalanceUrl: `${apiBase}/v1/ImbalancePrices/DownloadImbalanceCSV`,
    imbalancePrices,
  },
];

export const imbalancePricesMonthOverviewQueryMock = (
  apiBase: string
): GetImbalancePricesMonthOverviewQuery => ({
  __typename: 'Query',
  imbalancePricesForMonth: imbalancePricesForMonth(apiBase),
});
