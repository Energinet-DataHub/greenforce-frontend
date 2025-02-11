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
  CustomerRelation,
  mockDoesMeteringPointExistQuery,
  mockGetMeteringPointByIdQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [doesMeteringPointExists(), getMeteringPoint()];
}

function doesMeteringPointExists() {
  return mockDoesMeteringPointExistQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);

    if (meteringPointId === '222222222222222222') {
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          meteringPoint: {
            __typename: 'MeteringPointDetails',
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

function getMeteringPoint() {
  return mockGetMeteringPointByIdQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          __typename: 'MeteringPointDetails',
          meteringPointId: '222222222222222222',
          currentCommercialRelation: {
            __typename: 'CommercialRelationDto',
            customerId: '111111111111111111',
            energySupplier: '222222222222222222',
            id: 1,
            currentElectricalHeatingPeriod: {
              __typename: 'ElectricalHeatingPeriodDto',
              id: 1,
            },
            currentEnergySupplierPeriod: {
              __typename: 'EnergySupplierPeriodDto',
              id: 1,
              contacts: [
                {
                  __typename: 'ContactDto',
                  id: 1,
                  address: {
                    __typename: 'ContactAddressDto',
                    id: 1,
                    cityName: 'Hr City',
                    darReference: '123456789',
                    municipalityCode: '123',
                    postBox: '1234',
                    postCode: '1234',
                    streetCode: '1234',
                    streetName: 'Hr Street',
                    countryCode: 'DK',
                    isProtectedAddress: true,
                  },
                  isProtectedName: true,
                  relationType: CustomerRelation.Primary,
                  name: 'Hr name',
                  email: 'hr@name.dk',
                  phone: '12345678',
                },
                {
                  __typename: 'ContactDto',
                  id: 2,
                  address: {
                    __typename: 'ContactAddressDto',
                    id: 2,
                    cityName: 'Fru City',
                    darReference: '987654321',
                    municipalityCode: '987',
                    postBox: '9876',
                    postCode: '9876',
                    streetCode: '9876',
                    streetName: 'Fru Street',
                    countryCode: 'DK',
                    isProtectedAddress: false,
                  },
                  isProtectedName: false,
                  relationType: CustomerRelation.Secondary,
                  name: 'Fru Name',
                  email: 'fru@name.dk',
                  phone: '87654321',
                },
                {
                  __typename: 'ContactDto',
                  id: 3,
                  address: {
                    __typename: 'ContactAddressDto',
                    id: 3,
                    cityName: 'Legal City',
                    darReference: '123456789',
                    municipalityCode: '123',
                    postBox: '1234',
                    postCode: '1234',
                    streetCode: '1234',
                    streetName: 'Legal Street',
                    countryCode: 'DK',
                    isProtectedAddress: false,
                  },
                  isProtectedName: false,
                  relationType: CustomerRelation.Legal,
                  name: 'Legal Person',
                  email: 'legal@person.dk',
                  phone: '12345678',
                },
                {
                  __typename: 'ContactDto',
                  id: 4,
                  address: {
                    __typename: 'ContactAddressDto',
                    id: 4,
                    cityName: 'Service City',
                    darReference: '0a3f50b9-b942-32b8-e044-0003ba298018',
                    municipalityCode: '987',
                    postBox: '9876',
                    postCode: '9876',
                    streetCode: '9876',
                    streetName: 'Service Street',
                    countryCode: 'DK',
                    isProtectedAddress: false,
                  },
                  isProtectedName: false,
                  relationType: CustomerRelation.Technical,
                  name: 'Service person',
                  email: 'service@person.dk',
                  phone: '87654321',
                },
              ],
            },
          },
          currentMeteringPointPeriod: {
            __typename: 'MeteringPointPeriodDto',
            id: 1,
            unit: 'MWh',
            ownedBy: '111111111111111111',
            type: 'CONSUMPTION',
            connectionState: 'CONNECTED',
            netSettlementGroup: '6',
            installationAddress: {
              __typename: 'InstallationAddressDto',
              id: 1,
              washInstruction: 'false',
            },
          },
        },
      },
    });
  });
}
