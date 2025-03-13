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
  ActorStatus,
  EicFunction,
  Organization,
  Actor,
  ActorUserRole,
  UserRoleStatus,
  ContactCategory,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { credentials } from './market-participant-filtered-actors';

const userActorRoles: ActorUserRole[] = [
  {
    __typename: 'ActorUserRole',
    assigned: true,
    description: 'Test description',
    id: '1',
    eicFunction: EicFunction.BalanceResponsibleParty,
    name: 'Test name',
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'ActorUserRole',
    assigned: false,
    description: 'Test description 2',
    id: '2',
    eicFunction: EicFunction.BalanceResponsibleParty,
    name: 'Test name 2',
    status: UserRoleStatus.Active,
  },
];

export const actors = (id: string): Actor[] => [
  {
    __typename: 'Actor',
    id: '801011ea-a291-41f7-be19-581abc05a5ac',
    glnOrEicNumber: '5790000555465',
    name: 'Inactive balance responsible',
    auditLogs: [],
    displayName: 'Inactive balance responsible • BalanceResponsibleParty',
    gridAreas: [],
    userRoles: userActorRoles,
    marketRole: EicFunction.BalanceResponsibleParty,
    balanceResponsibleAgreements: [],
    status: ActorStatus.Inactive,
    credentials,
    organization: {
      __typename: 'Organization',
      id,
      name: '',
    } as Organization,
    contact: {
      __typename: 'ActorContactDto',
      contactId: '901011ea-a291-41f7-be19-581abc05a5ac',
      actorId: '801011ea-a291-41f7-be19-581abc05a5ac',
      category: ContactCategory.Default,
      name: 'Inactive balance responsible Contact',
      email: 'noreply@testorg.dk',
    },
    delegations: [],
  },
  {
    __typename: 'Actor',
    id: '9c3be101-1471-4a1a-8f52-ddb619778f8f',
    glnOrEicNumber: '5790000555466',
    name: 'Active energy supplier',
    displayName: 'Active energy supplier • EnergySupplier',
    auditLogs: [],
    gridAreas: [],
    userRoles: userActorRoles,
    marketRole: EicFunction.EnergySupplier,
    balanceResponsibleAgreements: [],
    status: ActorStatus.Active,
    credentials,
    organization: {
      __typename: 'Organization',
      id,
      name: '',
    } as Organization,
    contact: {
      __typename: 'ActorContactDto',
      contactId: 'ac3be101-1471-4a1a-8f52-ddb619778f8f',
      actorId: '9c3be101-1471-4a1a-8f52-ddb619778f8f',
      category: ContactCategory.Default,
      name: 'Active energy supplier Contact',
      email: 'noreply@testorg.dk',
    },
    delegations: [],
  },
];
