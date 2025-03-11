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
  ActorDelegationStatus,
  DelegatedProcess,
  GetDelegationsForActorQuery,
  MessageDelegationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs } from '@energinet-datahub/watt/date';

import { actors } from './get-actors-by-organizationId';
import { gridAreas } from './get-grid-areas';

const [delegatedBy, delegatedTo] = actors('10000000-0000-0000-0000-000000000001');

export const delegations: MessageDelegationType[] = [
  {
    __typename: 'MessageDelegationType',
    id: '00000000-0000-0000-0000-000000000001',
    periodId: '00000000-0000-0000-0000-000000000011',
    process: DelegatedProcess.ReceiveEnergyResults,
    validPeriod: {
      start: dayjs('2024-01-01T00:00:00+01:00').toDate(),
      end: dayjs('2024-02-01T23:59:59+01:00').toDate(),
    },
    delegatedBy,
    delegatedTo,
    status: ActorDelegationStatus.Active,
    gridArea: gridAreas[0],
  },
  {
    __typename: 'MessageDelegationType',
    id: '00000000-0000-0000-0000-000000000002',
    periodId: '00000000-0000-0000-0000-000000000022',
    process: DelegatedProcess.ReceiveEnergyResults,
    validPeriod: {
      start: dayjs('2024-01-01T00:00:00+01:00').toDate(),
      end: dayjs('2024-03-01T23:59:59+01:00').toDate(),
    },
    delegatedBy,
    delegatedTo,
    gridArea: gridAreas[0],
    status: ActorDelegationStatus.Active,
  },
  {
    __typename: 'MessageDelegationType',
    id: '00000000-0000-0000-0000-000000000003',
    periodId: '00000000-0000-0000-0000-000000000033',
    process: DelegatedProcess.ReceiveWholesaleResults,
    validPeriod: {
      start: dayjs('2024-02-10T00:00:00+01:00').toDate(),
      end: null,
    },
    delegatedBy,
    delegatedTo,
    gridArea: gridAreas[0],
    status: ActorDelegationStatus.Awaiting,
  },
  {
    __typename: 'MessageDelegationType',
    id: '00000000-0000-0000-0000-000000000004',
    periodId: '00000000-0000-0000-0000-000000000044',
    process: DelegatedProcess.RequestEnergyResults,
    validPeriod: {
      start: dayjs('2024-02-01T00:00:00+01:00').toDate(),
      end: dayjs('2024-03-01T23:59:59+01:01').toDate(),
    },
    delegatedBy,
    delegatedTo,
    gridArea: gridAreas[0],
    status: ActorDelegationStatus.Cancelled,
  },
  {
    __typename: 'MessageDelegationType',
    id: '00000000-0000-0000-0000-000000000005',
    periodId: '00000000-0000-0000-0000-000000000055',
    process: DelegatedProcess.RequestWholesaleResults,
    validPeriod: {
      start: dayjs('2024-03-01T00:00:00+01:00').toDate(),
      end: dayjs('2024-03-01T23:59:59+01:00').toDate(),
    },
    delegatedBy,
    delegatedTo,
    gridArea: gridAreas[0],
    status: ActorDelegationStatus.Expired,
  },
];

export const getDelegationsForActorMock: GetDelegationsForActorQuery = {
  __typename: 'Query',
  actorById: {
    __typename: 'Actor',
    delegations: delegations,
    id: '00000000-0000-0000-0000-000000000001',
  },
};
