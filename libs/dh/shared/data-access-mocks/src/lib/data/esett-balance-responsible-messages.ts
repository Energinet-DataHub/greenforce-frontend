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
  BalanceResponsibleType,
  GridAreaDto,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const eSettBalanceResponsibleMessages: BalanceResponsibleType[] = [
  {
    __typename: 'BalanceResponsibleType',
    id: '1',
    receivedDateTime: new Date('2021-02-01T00:00:00.000Z'),
    supplier: '123',
    balanceResponsible: '321',
    gridArea: '344',
    gridAreaWithName: {
      __typename: 'GridAreaDto',
      code: '344',
      name: 'N1 A/S',
    } as GridAreaDto,
    meteringPointType: TimeSeriesType.Production,
    validFromDate: new Date('2021-02-01T10:00:00.000Z'),
    validToDate: new Date('2021-05-02T00:00:00.000Z'),
    balanceResponsibleWithName: {
      __typename: 'ActorNameDto',
      value: 'Test Balance Ansvarlig',
    },
    supplierWithName: {
      __typename: 'ActorNameDto',
      value: 'Test Supplier',
    },
  },
  {
    __typename: 'BalanceResponsibleType',
    id: '2',
    receivedDateTime: new Date('2022-01-01T00:00:00.000Z'),
    supplier: '111',
    balanceResponsible: '222',
    gridArea: '999',
    gridAreaWithName: {
      __typename: 'GridAreaDto',
      code: '999',
      name: 'N2 A/S',
    } as GridAreaDto,
    meteringPointType: TimeSeriesType.Production,
    validFromDate: new Date('2022-01-01T10:00:00.000Z'),
    validToDate: null,
    balanceResponsibleWithName: {
      __typename: 'ActorNameDto',
      value: 'Test Balance Ansvarlig 2',
    },
    supplierWithName: {
      __typename: 'ActorNameDto',
      value: 'Test Supplier 2',
    },
  },
  {
    __typename: 'BalanceResponsibleType',
    id: '3',
    receivedDateTime: new Date('2022-01-01T00:00:00.000Z'),
    supplier: '888',
    balanceResponsible: '999',
    gridArea: '000',
    gridAreaWithName: null,
    meteringPointType: TimeSeriesType.Production,
    validFromDate: new Date('2022-01-01T10:00:00.000Z'),
    validToDate: null,
    balanceResponsibleWithName: null,
    supplierWithName: null,
  },
];
