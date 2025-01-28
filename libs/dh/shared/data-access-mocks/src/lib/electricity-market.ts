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
  MeteringPointPeriod,
  mockGetMeteringPointQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

export function electricityMarketMocks() {
  return [getMeteringPointsQuery()];
}

const meteringPoints: MeteringPointPeriod[] = [
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '1',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '1',
    ownenBy: '5790000000001',
    productId: '1',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 1,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '2',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '2',
    ownenBy: '5790000000002',
    productId: '2',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 2,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '3',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '3',
    ownenBy: '5790000000003',
    productId: '3',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 3,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '4',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '4',
    ownenBy: '5790000000004',
    productId: '4',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 4,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '5',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '5',
    ownenBy: '5790000000005',
    productId: '5',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 5,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '6',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '6',
    ownenBy: '5790000000006',
    productId: '6',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 6,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '7',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '7',
    ownenBy: '5790000000007',
    productId: '7',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 7,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '8',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '8',
    ownenBy: '5790000000008',
    productId: '8',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 8,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '9',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '9',
    ownenBy: '5790000000009',
    productId: '9',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 9,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '10',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '10',
    ownenBy: '5790000000010',
    productId: '10',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 10,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
  {
    __typename: 'MeteringPointPeriod',
    meteringPointId: '11',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '11',
    ownenBy: '5790000000011',
    productId: '11',
    resolution: 'PT15M',
    type: 'Consumption',
    scheduledMeterReadingMonth: 11,
    subType: 'Consumption',
    validFrom: new Date(),
    validTo: new Date(),
    unit: 'kWh',
  },
];

function getMeteringPointsQuery() {
  return mockGetMeteringPointQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoints: {
          __typename: 'MeteringPointsConnection',
          totalCount: meteringPoints.length,
          pageInfo: {
            __typename: 'PageInfo',
            endCursor: '11',
            startCursor: null,
          },
          nodes: meteringPoints,
        },
      },
    });
  });
}
