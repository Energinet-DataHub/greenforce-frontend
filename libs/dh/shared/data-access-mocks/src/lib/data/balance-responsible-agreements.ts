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
  GridAreaDto,
  MarketParticipantMeteringPointType,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';

const gridArea: GridAreaDto = {
  __typename: 'GridAreaDto',
  id: '001',
  name: 'Grid Area 1',
  code: '001',
  displayName: 'Grid Area 1',
  priceAreaCode: PriceAreaCode.Dk1,
  validFrom: new Date('2024-03-01T00:00+03:00'),
  validTo: new Date('2024-03-01T00:00+04:00'),
  includedInCalculation: true,
};

export const balanceResponsibleAgreements: BalanceResponsibilityAgreement[] = [
  {
    __typename: 'BalanceResponsibilityAgreement',
    validPeriod: { start: new Date('2024-03-01T00:00+02:00'), end: new Date() },
    status: BalanceResponsibilityAgreementStatus.Active,
    gridArea,
    meteringPointType: MarketParticipantMeteringPointType.E17Consumption,
    balanceResponsibleWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 2',
      },
    },
    energySupplierWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 1',
      },
    },
  },
  {
    __typename: 'BalanceResponsibilityAgreement',
    validPeriod: { start: new Date(), end: null },
    status: BalanceResponsibilityAgreementStatus.Awaiting,
    gridArea: {
      ...gridArea,
      name: 'Grid Area 2',
      code: '002',
      displayName: 'Grid Area 2',
    },
    meteringPointType: MarketParticipantMeteringPointType.E17Consumption,
    balanceResponsibleWithName: {
      __typename: 'ActorNameWithId',
      id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 2',
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
    status: BalanceResponsibilityAgreementStatus.SoonToExpire,
    gridArea: {
      ...gridArea,
      name: 'Grid Area 6',
      code: '006',
      displayName: 'Grid Area 6',
    },
    meteringPointType: MarketParticipantMeteringPointType.E18Production,
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
    status: BalanceResponsibilityAgreementStatus.Expired,
    gridArea: {
      ...gridArea,
      name: 'Grid Area 5',
      code: '005',
      displayName: 'Grid Area 5',
    },
    meteringPointType: MarketParticipantMeteringPointType.E18Production,
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
  {
    __typename: 'BalanceResponsibilityAgreement',
    validPeriod: {
      start: new Date('2023-01-10T00:00+01:00'),
      end: new Date('2023-03-10T00:00+02:00'),
    },
    status: BalanceResponsibilityAgreementStatus.Expired,
    gridArea: {
      ...gridArea,
      name: 'Grid Area 7',
      code: '007',
      displayName: 'Grid Area 7',
    },
    meteringPointType: MarketParticipantMeteringPointType.E18Production,
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
      id: 'efad0fee-9d7c-49c6-0008-08da5f28ddb1',
      actorName: {
        __typename: 'ActorNameDto',
        value: 'Test Actor 8',
      },
    },
  },
];
