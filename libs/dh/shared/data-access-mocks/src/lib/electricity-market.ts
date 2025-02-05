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
  CommercialRelationDto,
  MeteringPointPeriodDto,
  mockGetCommercialRelationsQuery,
  mockGetMeteringPointQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

export function electricityMarketMocks() {
  return [getMeteringPointsQuery(), getCommercialRelationsQuery()];
}

const meteringPoints: MeteringPointPeriodDto[] = [
  {
    __typename: 'MeteringPointPeriodDto',
    id: '1',
    meteringPointId: '1',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '1',
    ownedBy: '5790000000001',
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
    __typename: 'MeteringPointPeriodDto',
    id: '2',
    meteringPointId: '2',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '2',
    ownedBy: '5790000000002',
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
    __typename: 'MeteringPointPeriodDto',
    id: '3',
    meteringPointId: '3',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '3',
    ownedBy: '5790000000003',
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
    __typename: 'MeteringPointPeriodDto',
    id: '4',
    meteringPointId: '4',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '4',
    ownedBy: '5790000000004',
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
    __typename: 'MeteringPointPeriodDto',
    id: '5',
    meteringPointId: '5',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '5',
    ownedBy: '5790000000005',
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
    __typename: 'MeteringPointPeriodDto',
    id: '6',
    meteringPointId: '6',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '6',
    ownedBy: '5790000000006',
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
    __typename: 'MeteringPointPeriodDto',
    id: '7',
    meteringPointId: '7',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '7',
    ownedBy: '5790000000007',
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
    __typename: 'MeteringPointPeriodDto',
    id: '8',
    meteringPointId: '8',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '8',
    ownedBy: '5790000000008',
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
    __typename: 'MeteringPointPeriodDto',
    id: '9',
    meteringPointId: '9',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '9',
    ownedBy: '5790000000009',
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
    __typename: 'MeteringPointPeriodDto',
    id: '10',
    meteringPointId: '10',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '10',
    ownedBy: '5790000000010',
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
    __typename: 'MeteringPointPeriodDto',
    id: '11',
    meteringPointId: '11',
    connectionState: 'Connected',
    createdAt: new Date(),
    gridAreaCode: '11',
    ownedBy: '5790000000011',
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

const commercialRelations: CommercialRelationDto[] = [
  {
    __typename: 'CommercialRelationDto',
    customerId: '579000000',
    endDate: new Date(),
    energyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '1',
        energySupplier: '579000000',
        id: '1',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '1',
        retiredAt: new Date(),
        retiredById: 2,
      },
    ],
    energySupplier: '579000000',
    id: '1',
    meteringPointId: '1',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
  {
    __typename: 'CommercialRelationDto',
    customerId: '579000001',
    endDate: new Date(),
    energyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '2',
        energySupplier: '579000001',
        id: '2',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '2',
        retiredAt: new Date(),
        retiredById: 3,
      },
    ],
    energySupplier: '579000001',
    id: '2',
    meteringPointId: '2',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
  {
    __typename: 'CommercialRelationDto',
    customerId: '579000002',
    endDate: new Date(),
    energyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '3',
        energySupplier: '579000002',
        id: '3',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '3',
        retiredAt: new Date(),
        retiredById: 4,
      },
    ],
    energySupplier: '579000002',
    id: '3',
    meteringPointId: '3',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
  {
    __typename: 'CommercialRelationDto',
    customerId: '579000003',
    endDate: new Date(),
    energyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '4',
        energySupplier: '579000003',
        id: '4',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '4',
        retiredAt: new Date(),
        retiredById: 5,
      },
    ],
    energySupplier: '579000003',
    id: '4',
    meteringPointId: '4',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
  {
    __typename: 'CommercialRelationDto',
    customerId: '579000004',
    endDate: new Date(),
    energyPeriods: [
      {
        __typename: 'EnergySupplierPeriodDto',
        businessTransactionDosId: '5',
        energySupplier: '579000004',
        id: '5',
        validFrom: new Date(),
        validTo: new Date(),
        webAccessCode: '5',
        retiredAt: new Date(),
        retiredById: 6,
      },
    ],
    energySupplier: '579000004',
    id: '5',
    meteringPointId: '5',
    modifiedAt: new Date(),
    startDate: new Date(),
  },
];

function getMeteringPointsQuery() {
  return mockGetMeteringPointQuery(async ({ variables: { filter } }) => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          __typename: 'MeteringPointDto',
          id: '1',
          meteringPointPeriods: {
            __typename: 'MeteringPointPeriodsConnection',
            totalCount: meteringPoints.length,
            pageInfo: {
              __typename: 'PageInfo',
              endCursor: '11',
              startCursor: null,
            },
            nodes: filter
              ? meteringPoints.filter((x) => x.meteringPointId === filter)
              : meteringPoints,
          },
        },
      },
    });
  });
}

function getCommercialRelationsQuery() {
  return mockGetCommercialRelationsQuery(async ({ variables: { filter } }) => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          __typename: 'MeteringPointDto',
          id: '1',
          commercialRelations: {
            __typename: 'CommercialRelationsConnection',
            totalCount: commercialRelations.length,
            pageInfo: {
              __typename: 'PageInfo',
              endCursor: '11',
              startCursor: null,
            },
            nodes: filter
              ? commercialRelations.filter((x) => x.meteringPointId === filter)
              : commercialRelations,
          },
        },
      },
    });
  });
}
