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
  MeteringPointMeasureUnit,
  MeteringPointSubType,
  mockDoesMeteringPointExistQuery,
  mockGetContactCprQuery,
  mockGetMeteringPointByIdQuery,
  Product,
  SettlementMethod,
} from '@energinet-datahub/dh/shared/domain/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [doesMeteringPointExists(), getContactCPR(), getMeteringPoint()];
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
          meteringPointId: '222222222222222222',
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
            activeEnergySupplyPeriod: {
              __typename: 'EnergySupplyPeriodDto',
              id: 1,
              validFrom: new Date('2023-01-01'),
              customers: [
                {
                  __typename: 'CustomerDto',
                  id: 1,
                  isProtectedName: true,
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
            type: ElectricityMarketMeteringPointType.ActualProduction,
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
