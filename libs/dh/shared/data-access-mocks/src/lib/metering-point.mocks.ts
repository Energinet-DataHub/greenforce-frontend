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
                    isProtectedAddress: true,
                  },
                  isProtectedName: true,
                  relationType: CustomerRelation.Primary,
                  name: 'Hr name',
                },
                {
                  __typename: 'ContactDto',
                  id: 2,
                  address: {
                    __typename: 'ContactAddressDto',
                    id: 2,
                    isProtectedAddress: false,
                  },
                  isProtectedName: false,
                  relationType: CustomerRelation.Secondary,
                  name: 'Fru Name',
                },
                {
                  __typename: 'ContactDto',
                  id: 3,
                  address: {
                    __typename: 'ContactAddressDto',
                    id: 3,
                    isProtectedAddress: false,
                  },
                  isProtectedName: false,
                  relationType: CustomerRelation.Legal,
                  name: 'Legal Person',
                },
                {
                  __typename: 'ContactDto',
                  id: 4,
                  address: {
                    __typename: 'ContactAddressDto',
                    id: 4,
                    isProtectedAddress: false,
                  },
                  isProtectedName: false,
                  relationType: CustomerRelation.Technical,
                  name: 'Service person',
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
