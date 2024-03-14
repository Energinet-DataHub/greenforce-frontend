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
  Actor,
  ActorStatus,
  EicFunction,
  GridAreaDto,
  Organization,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const marketParticipantActors: Actor[] = [
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb1',
    glnOrEicNumber: '5790000555555',
    name: 'Test Actor 1',
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        code: 'DK1',
        name: 'DK1',
        id: '1',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.BalanceResponsibleParty,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      name: 'Test Organization 1',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb4',
    glnOrEicNumber: '5790000555465',
    name: 'Test Actor 3',
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        code: 'DK1',
        name: 'DK1',
        id: '2',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.GridAccessProvider,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      name: 'Test Organization 3',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
    glnOrEicNumber: '5790000555465',
    name: 'Test Actor 2',
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        code: 'DK1',
        name: 'DK1',
        id: '3',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.BalanceResponsibleParty,
    status: ActorStatus.Inactive,
    organization: {
      __typename: 'Organization',
      name: 'Test Organization 2',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c18-08da5f28ddb1',
    glnOrEicNumber: '5790000555444',
    name: 'Test Actor 3',
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        code: 'DK2',
        name: 'DK2',
        id: '4',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.DanishEnergyAgency,
    status: ActorStatus.Inactive,
    organization: {
      __typename: 'Organization',
      name: 'Test Organization 2',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c19-08da5f28ddb1',
    glnOrEicNumber: '5790000555123',
    name: 'Test Actor 4',
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        code: 'DK2',
        name: 'DK2',
        id: '5',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.DanishEnergyAgency,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      name: 'Test Organization 3',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1',
    glnOrEicNumber: '5790000555333',
    name: 'Test Actor 5',
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        code: 'DK2',
        name: 'DK2',
        id: '6',
      } as GridAreaDto,
    ],
    marketRole: null,
    status: null as unknown as ActorStatus,
    organization: null as unknown as Organization,
  },
];
