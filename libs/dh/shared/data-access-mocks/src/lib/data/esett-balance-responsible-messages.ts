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
  BalanceResponsibleType,
  GridAreaDto,
  BalanceResponsibilityMeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs } from '@energinet-datahub/watt/date';

const validPeriod = {
  start: dayjs('2020-01-28T23:00:00.000Z').toDate(),
  end: dayjs('2020-01-29T22:59:59.998Z').toDate(),
};

const validPeriodWithNull = {
  start: dayjs('2020-01-28T23:00:00.000Z').toDate(),
  end: null,
};

export const eSettBalanceResponsibleMessages = (apibase: string): BalanceResponsibleType[] => [
  {
    __typename: 'BalanceResponsibleType',
    id: '1',
    receivedDateTime: new Date('2021-02-01T00:00:00.000Z'),
    supplier: '123',
    balanceResponsible: '321',
    gridArea: '344',
    gridAreaWithName: {
      __typename: 'GridAreaDto',
      id: '11',
      code: '344',
      name: 'N1 A/S',
    } as GridAreaDto,
    meteringPointType: BalanceResponsibilityMeteringPointType.Production,
    validPeriod,
    balanceResponsibleWithName: {
      __typename: 'ActorNameDto',
      value: 'Test Balance Ansvarlig',
    },
    supplierWithName: {
      __typename: 'ActorNameDto',
      value: 'Test Supplier',
    },
    storageDocumentUrl: `${apibase}/v1/EsettExchange/StorageDocument`,
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
      id: '22',
      code: '999',
      name: 'N2 A/S',
    } as GridAreaDto,
    meteringPointType: BalanceResponsibilityMeteringPointType.Production,
    validPeriod: validPeriodWithNull,
    balanceResponsibleWithName: {
      __typename: 'ActorNameDto',
      value: 'Test Balance Ansvarlig 2',
    },
    supplierWithName: {
      __typename: 'ActorNameDto',
      value: 'Test Supplier 2',
    },
    storageDocumentUrl: `${apibase}/v1/EsettExchange/StorageDocument`,
  },
  {
    __typename: 'BalanceResponsibleType',
    id: '3',
    receivedDateTime: new Date('2022-01-01T00:00:00.000Z'),
    supplier: '888',
    balanceResponsible: '999',
    gridArea: '000',
    gridAreaWithName: null,
    meteringPointType: BalanceResponsibilityMeteringPointType.Production,
    validPeriod: validPeriodWithNull,
    balanceResponsibleWithName: null,
    supplierWithName: null,
    storageDocumentUrl: `${apibase}/v1/EsettExchange/StorageDocument`,
  },
];
