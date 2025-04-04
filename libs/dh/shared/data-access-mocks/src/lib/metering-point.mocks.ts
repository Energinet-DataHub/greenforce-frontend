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
import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';
import {
  AssetType,
  ConnectionState,
  ConnectionType,
  DisconnectionType,
  ElectricityMarketMeteringPointType,
  MeasurementPointDto,
  MeteringPointMeasureUnit,
  MeteringPointSubType,
  Product,
  Quality,
  SettlementMethod,
  Unit,
  WashInstructions,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  mockDoesMeteringPointExistQuery,
  mockGetContactCprQuery,
  mockGetMeasurementsByIdQuery,
  mockGetMeteringPointByIdQuery,
  mockGetMeteringPointsByGridAreaQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

const measurementPoints: MeasurementPointDto[] = [
  {
    __typename: 'MeasurementPointDto',
    created: new Date('2023-01-01T00:00:00Z'),
    quality: Quality.Calculated,
    quantity: 23,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    created: new Date('2023-01-01T01:00:00Z'),
    quality: Quality.Calculated,
    quantity: 3,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    created: new Date('2023-01-01T02:00:00Z'),
    quality: Quality.Calculated,
    quantity: 2,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    created: new Date('2023-01-01T03:00:00Z'),
    quality: Quality.Calculated,
    quantity: 4,
    unit: Unit.KWh,
  },
  {
    __typename: 'MeasurementPointDto',
    created: new Date('2023-01-01T04:00:00Z'),
    quality: Quality.Calculated,
    quantity: 34,
    unit: Unit.KWh,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [
    doesMeteringPointExists(),
    getContactCPR(),
    getMeteringPoint(),
    getMeteringPointsByGridArea(),
    getMeasurementPoints(),
  ];
}

function getMeasurementPoints() {
  return mockGetMeasurementsByIdQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        measurements: {
          __typename: 'MeasurementsDto',
          measurementPositions: [
            {
              __typename: 'MeasurementPositionDto',
              measurementPoints: measurementPoints.toSpliced(0, 1),
              observationTime: new Date('2023-01-01T23:59:59.99999Z'),
              current: measurementPoints[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              measurementPoints: measurementPoints.toSpliced(0, 1),
              observationTime: new Date('2023-01-01T00:00:00Z'),
              current: measurementPoints[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              measurementPoints: measurementPoints.toSpliced(0, 1).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T01:00:00Z'),
              current: measurementPoints.toSpliced(0, 1)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              measurementPoints: measurementPoints.toSpliced(2, 4).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T02:00:00Z'),
              current: measurementPoints.toSpliced(2, 4)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              measurementPoints: measurementPoints.toSpliced(1, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T03:00:00Z'),
              current: measurementPoints.toSpliced(1, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              measurementPoints: measurementPoints.toSpliced(0, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T04:00:00Z'),
              current: measurementPoints.toSpliced(0, 3)[0],
            },
          ],
        },
      },
    });
  });
}

function doesMeteringPointExists() {
  return mockDoesMeteringPointExistQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);

    if (meteringPointId === '222222222222222222') {
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          meteringPoint: {
            __typename: 'MeteringPointDto',
            id: 1,
            meteringPointId,
          },
        },
      });
    }

    return HttpResponse.json({
      data: null,
      errors: [
        {
          message: 'Metering point not found',
          path: ['meteringPoint'],
        },
      ],
    });
  });
}

function getContactCPR() {
  return mockGetContactCprQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointContactCpr: { __typename: 'CPRResponse', result: '1234567890' },
      },
    });
  });
}

function getMeteringPoint() {
  return mockGetMeteringPointByIdQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          __typename: 'MeteringPointDto',
          id: 1,
          isChild: false,
          isEnergySupplier: true,
          isGridAccessProvider: true,
          meteringPointId: '222222222222222222',
          relatedMeteringPoints: {
            __typename: 'RelatedMeteringPointsDto',
            current: {
              __typename: 'RelatedMeteringPointDto',
              id: 1,
              connectionState: ConnectionState.Connected,
              identification: '111111111111111111',
              type: ElectricityMarketMeteringPointType.Consumption,
              closedDownDate: null,
              connectionDate: new Date('2021-01-01'),
            },
            parent: {
              __typename: 'RelatedMeteringPointDto',
              id: 2,
              connectionState: ConnectionState.Connected,
              identification: '222222222222222222',
              type: ElectricityMarketMeteringPointType.Consumption,
              closedDownDate: null,
              connectionDate: new Date('2021-01-01'),
            },
            relatedMeteringPoints: [
              {
                __typename: 'RelatedMeteringPointDto',
                id: 3,
                connectionState: ConnectionState.Connected,
                identification: '3333333333333333',
                type: ElectricityMarketMeteringPointType.ElectricalHeating,
                closedDownDate: null,
                connectionDate: new Date('2024-01-01'),
              },
            ],
            relatedByGsrn: [
              {
                __typename: 'RelatedMeteringPointDto',
                id: 4,
                connectionState: ConnectionState.New,
                identification: '4444444444444444',
                type: ElectricityMarketMeteringPointType.ElectricalHeating,
                closedDownDate: null,
                connectionDate: new Date('2024-01-01'),
              },
            ],
            historicalMeteringPoints: [
              {
                __typename: 'RelatedMeteringPointDto',
                id: 5,
                connectionState: ConnectionState.ClosedDown,
                identification: '5555555555555555',
                type: ElectricityMarketMeteringPointType.ElectricalHeating,
                closedDownDate: new Date('2021-11-01'),
                connectionDate: new Date('2021-01-01'),
              },
            ],
            historicalMeteringPointsByGsrn: [
              {
                __typename: 'RelatedMeteringPointDto',
                id: 6,
                connectionState: ConnectionState.Disconnected,
                identification: '6666666666666666',
                type: ElectricityMarketMeteringPointType.ElectricalHeating,
                closedDownDate: null,
                connectionDate: new Date('2022-01-01'),
              },
            ],
          },
          commercialRelation: {
            __typename: 'CommercialRelationDto',
            energySupplier: '222222222222222222',
            energySupplierName: {
              __typename: 'ActorNameDto',
              value: 'Test Supplier',
            },
            id: 1,
            activeElectricalHeatingPeriods: {
              __typename: 'ElectricalHeatingDto',
              id: 1,
              validFrom: new Date('2021-01-01'),
            },
            haveElectricalHeating: true,
            hadElectricalHeating: false,
            electricalHeatingPeriods: [],
            activeEnergySupplyPeriod: {
              __typename: 'EnergySupplyPeriodDto',
              id: 1,
              validFrom: new Date('2023-01-01'),
              customers: [
                {
                  __typename: 'CustomerDto',
                  id: 1,
                  isProtectedName: true,
                  cvr: null,
                  name: 'Hr name',
                  technicalContact: null,
                  legalContact: {
                    __typename: 'CustomerContactDto',
                    id: 1,
                    cityName: 'Hr City',
                    darReference: '123456789',
                    municipalityCode: '123',
                    postBox: '1234',
                    postCode: '1234',
                    streetCode: '1234',
                    buildingNumber: '4',
                    streetName: 'Hr Street',
                    countryCode: 'DK',
                    isProtectedAddress: true,
                    email: 'hr@name.dk',
                    phone: '12345678',
                  },
                },
                {
                  __typename: 'CustomerDto',
                  id: 2,
                  isProtectedName: false,
                  cvr: '12345678',
                  name: 'Fru Name',
                  legalContact: null,
                  technicalContact: {
                    __typename: 'CustomerContactDto',
                    id: 2,
                    cityName: 'Fru City',
                    darReference: '987654321',
                    municipalityCode: '987',
                    postBox: '9876',
                    postCode: '9876',
                    streetCode: '9876',
                    buildingNumber: '4',
                    streetName: 'Fru Street',
                    countryCode: 'DK',
                    isProtectedAddress: false,
                    email: 'fru@name.dk',
                    phone: '87654321',
                  },
                },
              ],
            },
          },
          metadata: {
            __typename: 'MeteringPointMetadataDto',
            id: 1,
            measureUnit: MeteringPointMeasureUnit.KWh,
            gridArea: {
              __typename: 'GridAreaDto',
              id: '1',
              displayName: '001',
            },
            ownedBy: '111111111111111111',
            type: ElectricityMarketMeteringPointType.Consumption,
            subType: MeteringPointSubType.Physical,
            connectionState: ConnectionState.Disconnected,
            netSettlementGroup: 6,
            assetType: AssetType.CombustionEngineDiesel,
            connectionType: ConnectionType.Installation,
            disconnectionType: DisconnectionType.RemoteDisconnection,
            fromGridArea: {
              __typename: 'GridAreaDto',
              id: '2',
              displayName: '002',
            },
            environmentalFriendly: true,
            meterNumber: '123456789',
            product: Product.FuelQuantity,
            resolution: 'PT15M',
            scheduledMeterReadingMonth: 1,
            toGridArea: {
              __typename: 'GridAreaDto',
              id: '3',
              displayName: '003',
            },
            settlementMethod: SettlementMethod.FlexSettled,
            capacity: '100',
            powerLimitKw: 100,
            powerPlantGsrn: '1234567890',
            installationAddress: {
              __typename: 'InstallationAddressDto',
              id: 1,
              buildingNumber: '4',
              cityName: 'City',
              postCode: '5000',
              countryCode: 'DK',
              darReference: '123456789',
              washInstructions: WashInstructions.Washable,
              floor: '3',
              locationDescription: 'Location',
              municipalityCode: '123',
              citySubDivisionName: 'Subdivision name',
              room: 'th',
              streetCode: '44',
              streetName: 'Gade Vej Alle',
            },
          },
        },
      },
    });
  });
}

function getMeteringPointsByGridArea() {
  return mockGetMeteringPointsByGridAreaQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointsByGridAreaCode: [
          {
            __typename: 'MeteringPointsGroupByPackageNumber',
            packageNumber: '1',
            meteringPoints: [
              {
                __typename: 'MeteringPointDto',
                id: 1,
                meteringPointId: '111111111111111111',
              },
              {
                __typename: 'MeteringPointDto',
                id: 2,
                meteringPointId: '222222222222222222',
              },
            ],
          },
          {
            __typename: 'MeteringPointsGroupByPackageNumber',
            packageNumber: '2',
            meteringPoints: [
              {
                __typename: 'MeteringPointDto',
                id: 3,
                meteringPointId: '333333333333333333',
              },
              {
                __typename: 'MeteringPointDto',
                id: 4,
                meteringPointId: '444444444444444444',
              },
              {
                __typename: 'MeteringPointDto',
                id: 5,
                meteringPointId: '555555555555555555',
              },
            ],
          },
        ],
      },
    });
  });
}
