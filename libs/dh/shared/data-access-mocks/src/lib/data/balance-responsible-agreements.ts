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
  BalanceResponsibilityAgreement,
  BalanceResponsibilityAgreementStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const balanceResponsibleAgreements: BalanceResponsibilityAgreement[] = [
  {
    __typename: 'BalanceResponsibilityAgreement',
    validPeriod: { start: new Date('2024-03-01T00:00+02:00'), end: new Date() },
    status: BalanceResponsibilityAgreementStatus.Active,
    gridAreaId: '001',
    meteringPointType: 'CONSUMPTION',
    balanceResponsibleWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 1',
      },
    },
    energySupplierWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 2',
      },
    },
  },
  {
    __typename: 'BalanceResponsibilityAgreement',
    validPeriod: { start: new Date(), end: null },
    status: BalanceResponsibilityAgreementStatus.Awaiting,
    gridAreaId: '002',
    meteringPointType: 'CONSUMPTION',
    balanceResponsibleWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-0001-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 1',
      },
    },
    energySupplierWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-0003-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 3',
      },
    },
  },
  {
    __typename: 'BalanceResponsibilityAgreement',
    validPeriod: {
      start: new Date('2024-02-01T00:00+01:00'),
      end: new Date('2024-04-01T00:00+02:00'),
    },
    status: BalanceResponsibilityAgreementStatus.Expired,
    gridAreaId: '005',
    meteringPointType: 'PRODUCTION',
    balanceResponsibleWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-0003-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 3',
      },
    },
    energySupplierWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-0005-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 5',
      },
    },
  },
  {
    __typename: 'BalanceResponsibilityAgreement',
    validPeriod: {
      start: new Date('2024-01-01T00:00+01:00'),
      end: new Date('2024-03-01T00:00+02:00'),
    },
    status: BalanceResponsibilityAgreementStatus.SoonToExpire,
    gridAreaId: '005',
    meteringPointType: 'PRODUCTION',
    balanceResponsibleWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-0006-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 6',
      },
    },
    energySupplierWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-0005-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 5',
      },
    },
  },
];
