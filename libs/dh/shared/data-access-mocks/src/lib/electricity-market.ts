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
import { mockGetMeteringPointQuery } from '@energinet-datahub/dh/shared/domain/graphql';
import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

export function electricityMarketMocks() {
  return [getMeteringPointsQuery()];
}

function getMeteringPointsQuery() {
  return mockGetMeteringPointQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoints: {
          __typename: 'MeteringPointsConnection',
          totalCount: 11,
          pageInfo: {
            __typename: 'PageInfo',
            endCursor: '11',
            startCursor: null,
          },
          nodes: [
            {
              __typename: 'MeteringPointDto',
              id: '1',
              identification: '1',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '1',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '1',
                ownenBy: '1',
                productId: '1',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 1,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '2',
              identification: '2',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '2',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '2',
                ownenBy: '2',
                productId: '2',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 2,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '3',
              identification: '3',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '3',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '3',
                ownenBy: '3',
                productId: '3',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 3,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '4',
              identification: '4',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '4',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '4',
                ownenBy: '4',
                productId: '4',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 4,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '5',
              identification: '5',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '5',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '5',
                ownenBy: '5',
                productId: '5',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 5,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '6',
              identification: '6',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '6',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '6',
                ownenBy: '6',
                productId: '6',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 6,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '7',
              identification: '7',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '7',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '7',
                ownenBy: '7',
                productId: '7',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 7,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '8',
              identification: '8',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '8',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '8',
                ownenBy: '8',
                productId: '8',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 8,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '9',
              identification: '9',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '9',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '9',
                ownenBy: '9',
                productId: '9',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 9,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '10',
              identification: '10',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '10',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '10',
                ownenBy: '10',
                productId: '10',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 10,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
            {
              __typename: 'MeteringPointDto',
              id: '11',
              identification: '11',
              meteringPointPeriod: {
                __typename: 'MeteringPointPeriodDto',
                id: '11',
                connectionState: 'Connected',
                createdAt: new Date(),
                gridAreaCode: '11',
                ownenBy: '11',
                productId: '11',
                resolution: 'PT15M',
                type: 'Consumption',
                scheduledMeterReadingMonth: 11,
                subType: 'Consumption',
                validFrom: new Date(),
                validTo: new Date(),
                unit: 'kWh',
              },
            },
          ],
        },
      },
    });
  });
}
