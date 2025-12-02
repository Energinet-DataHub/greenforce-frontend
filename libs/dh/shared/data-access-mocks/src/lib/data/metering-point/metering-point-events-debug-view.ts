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
import { GetMeteringPointResultDtoV1 } from '@energinet-datahub/dh/shared/domain/graphql';

export const eventsDebugView: GetMeteringPointResultDtoV1 = {
  __typename: 'GetMeteringPointResultDtoV1',
  meteringPoint: {
    __typename: 'MeteringPointDtoV1',
    meteringPointId: '111111111111111111',
    meteringPointPeriods: [
      {
        __typename: 'MeteringPointPeriodDto',
        validFrom: new Date('2023-01-01T00:00:00Z'),
        validTo: new Date('2023-12-31T23:59:59Z'),
        type: 'Consumption',
        connectionState: 'Connected',
      },
      {
        __typename: 'MeteringPointPeriodDto',
        validFrom: new Date('2023-01-01T00:00:00Z'),
        validTo: new Date('2023-12-31T23:59:59Z'),
        type: 'Consumption',
        connectionState: 'Connected',
      },
    ],
    commercialRelations: [
      {
        __typename: 'ElectricityMarketV2CommercialRelationDto',
        customerId: '111',
        energySupplierId: '2222222222222222',
        startDate: new Date('2023-01-01T00:00:00Z'),
        endDate: new Date('2023-12-31T23:59:59Z'),
        energySupplierPeriods: [
          {
            __typename: 'EnergySupplierPeriodDto',
            validFrom: new Date('2023-01-01T00:00:00Z'),
            validTo: new Date('2023-12-31T23:59:59Z'),
            contacts: [],
          },
        ],
      },
    ],
  },
  events: [
    {
      __typename: 'ElectricityMarketV2EventDto',
      id: 'event-1',
      type: 'MeteringPointCreatedEventV1',
      timestamp: new Date('2023-01-01T12:00:00Z'),
      jsonData:
        '{ "id": "111111111", "type": "Consumption", "validityDate": "2023-01-04T00:00:00Z", "connectionState": "New" }',
    },
    {
      __typename: 'ElectricityMarketV2EventDto',
      id: 'event-2',
      type: 'MoveInInitiatedEventV1',
      timestamp: new Date('2023-01-04T07:00:00Z'),
      jsonData:
        '{ "customerId": "111", "validityDate": "2023-01-04T00:00:00Z", "energySupplierId": "2222222222222222" }',
    },
    {
      __typename: 'ElectricityMarketV2EventDto',
      id: 'event-3',
      type: 'MeteringPointConnectedEventV1',
      timestamp: new Date('2023-01-01T12:00:00Z'),
      jsonData:
        '{ "id": "111111111", "validityDate": "2023-01-04T00:00:00Z", "connectionState": "Connected" }',
    },
  ],
};
