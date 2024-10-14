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
  ActorUserRole,
  EicFunction,
  Organization,
  User,
  UserRoleStatus,
  UserStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

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

const actors: Actor[] = [
  {
    __typename: 'Actor',
    id: '801011ea-a291-41f7-be19-581abc05a5ac',
    glnOrEicNumber: '5790000555465',
    name: 'Inactive balance responsible',
    displayName: 'Inactive balance responsible • BalanceResponsibleParty',
    gridAreas: [],
    userRoles: userActorRoles,
    marketRole: EicFunction.BalanceResponsibleParty,
    balanceResponsibleAgreements: [],
    status: ActorStatus.Inactive,
    organization: {
      __typename: 'Organization',
      id: '1',
      name: '',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: '301011ea-a291-41f7-be19-581abc05a5ac',
    glnOrEicNumber: '5790000555465',
    name: 'Balance responsible',
    displayName: 'Balance responsible • BalanceResponsibleParty',
    gridAreas: [],
    userRoles: userActorRoles,
    marketRole: EicFunction.BalanceResponsibleParty,
    balanceResponsibleAgreements: [],
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      id: '1',
      name: '',
    } as Organization,
  },
];

export const overviewUsers: User[] = [
  {
    __typename: 'User',
    id: '1',
    email: 'test@test.dk',
    firstName: 'Test',
    lastName: 'Test',
    status: UserStatus.Active,
    phoneNumber: '+45 12345678',
    createdDate: new Date(),
    name: 'Test Test',
    actors,
    administratedBy: actors[0],
  },
  {
    __typename: 'User',
    id: '2',
    email: 'test1@test1.dk',
    firstName: 'Test1',
    lastName: 'Test1',
    status: UserStatus.Inactive,
    phoneNumber: '+45 22345678',
    createdDate: new Date(),
    name: 'Test1 Test1',
    actors,
    administratedBy: actors[0],
  },
  {
    __typename: 'User',
    id: '3',
    email: 'test1@test2.dk',
    firstName: 'Test2',
    lastName: 'Test2',
    status: UserStatus.InviteExpired,
    phoneNumber: '+45 32345678',
    createdDate: new Date(),
    name: 'Test2 Test2',
    actors,
    administratedBy: actors[0],
  },
  {
    __typename: 'User',
    id: '4',
    email: 'test1@test3.dk',
    firstName: 'Test3',
    lastName: 'Test3',
    status: UserStatus.Invited,
    phoneNumber: '+45 34345678',
    createdDate: new Date(),
    name: 'Test3 Test3',
    actors,
    administratedBy: actors[0],
    latestLoginAt: new Date(),
  },
  {
    __typename: 'User',
    id: '5',
    email: 'test1@test4.dk',
    firstName: 'Test4',
    lastName: 'Test4',
    status: UserStatus.Invited,
    phoneNumber: null,
    createdDate: new Date(),
    name: 'Test4 Test4',
    actors,
    administratedBy: actors[0],
  },
];
