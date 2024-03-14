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
  ActorDelegationStatus,
  DelegationMessageType,
  GetDelegationsForActorQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs } from '@energinet-datahub/watt/date';

export const getDelegationsForActorMock: GetDelegationsForActorQuery = {
  __typename: 'Query',
  getDelegationsForActor: [
    {
      __typename: 'MessageDelegationType',
      messageType: DelegationMessageType.Rsm016Outbound,
      startsAt: dayjs('2024-01-01T00:00:00+00:00').toDate(),
      expiresAt: dayjs('2024-02-01T00:00:00+00:00').toDate(),
      delegatedTo: {
        __typename: 'Actor',
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Test actor 1',
      },
      gridArea: {
        __typename: 'GridAreaDto',
        code: '003',
        id: '00000000-0000-0000-0000-000000000011',
      },
      status: ActorDelegationStatus.Active,
    },
    {
      __typename: 'MessageDelegationType',
      messageType: DelegationMessageType.Rsm016Outbound,
      startsAt: dayjs('2024-02-10T00:00:00+00:00').toDate(),
      expiresAt: null,
      delegatedTo: {
        __typename: 'Actor',
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Test actor 1',
      },
      gridArea: {
        __typename: 'GridAreaDto',
        code: '004',
        id: '00000000-0000-0000-0000-000000000012',
      },
      status: ActorDelegationStatus.Awaiting,
    },
    {
      __typename: 'MessageDelegationType',
      messageType: DelegationMessageType.Rsm016Inbound,
      startsAt: dayjs('2024-02-01T00:00:00+00:00').toDate(),
      expiresAt: dayjs('2024-03-01T00:00:00+00:00').toDate(),
      delegatedTo: {
        __typename: 'Actor',
        id: '00000000-0000-0000-0000-000000000003',
        name: 'Test actor 3',
      },
      gridArea: {
        __typename: 'GridAreaDto',
        code: '116',
        id: '00000000-0000-0000-0000-000000000013',
      },
      status: ActorDelegationStatus.Cancelled,
    },
    {
      __typename: 'MessageDelegationType',
      messageType: DelegationMessageType.Rsm017Outbound,
      startsAt: dayjs('2024-03-01T00:00:00+00:00').toDate(),
      expiresAt: null,
      delegatedTo: {
        __typename: 'Actor',
        id: '00000000-0000-0000-0000-000000000004',
        name: 'Test actor 4',
      },
      gridArea: {
        __typename: 'GridAreaDto',
        code: '117',
        id: '00000000-0000-0000-0000-000000000013',
      },
      status: ActorDelegationStatus.Expired,
    },
  ],
};
