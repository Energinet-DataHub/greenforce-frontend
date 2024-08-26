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
  EicFunction,
  GetUserRolesByActorIdQuery,
  UserRoleDto,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const userRoles: UserRoleDto[] = [
  {
    __typename: 'UserRoleDto',
    id: '14bc75d5-7e92-47e8-22c3-08db1af941a6',
    name: 'BRUGER TEST må slettes',
    description: 'BRUGER ROLLE SOM KAN SLETTES',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: 'd49e60f8-a2c5-4760-22c4-08db1af941a6',
    name: 'Rasmus 1 må slettes',
    description: 'Rasmus 1 tik test - brugeradmin.',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '53ee44bf-af3e-4073-6697-08db1b12d471',
    name: 'Må slettes organisation',
    description: 'Må slettes organisation DNI vil gerne have mere tekst',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: 'a205e6ea-9b59-4302-a63f-08db1bddde55',
    name: 'Test af bruger roller (må slettes)',
    description: 'Må slettes',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '6687881c-63cb-40eb-b3a5-137056da2746',
    name: 'Basis adgang',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '49a9db56-0fc1-47a6-ad57-3500c4e6fba4',
    name: 'Adgang til CPR visning',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: 'd02711bf-64b9-43c8-b83b-8c984ac79802',
    name: 'Rapporter',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '8acafc2b-506f-49e1-b9bf-97712b5834f8',
    name: 'Afregningskørsler',
    description: 'Adgang til Start og Søg Batch samt Afregningsrapporter',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: 'b50dfe6b-962b-448e-88e6-97b715fb33bc',
    name: 'Supporter',
    description: 'Supporter beskrivelse',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '31f69805-0cae-42ae-ab13-bd20e442add9',
    name: 'Se adgang - 1',
    description: 'JJ - Test',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '8cc60b54-369b-406d-9d25-df0548e9672f',
    name: 'Beskedudveksling (Webforms)',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: 'bd0f73e1-d39e-4f2d-9446-e209ed7ec84e',
    name: 'Datahub systemejer - Admin',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: 'a66977e6-4b09-4ebe-8065-e8d2c086bfea',
    name: 'HTX-rettelser',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '62386ea8-3efd-44f5-a7e2-ee8b107336ac',
    name: 'Sprogskift',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '767eed63-2f84-4dc3-846e-eea468986143',
    name: 'GUI nyheder',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: '9f53b1bf-3ac6-4bb3-aeee-f544664a88ad',
    name: 'Fuld adgang',
    description: '',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
  {
    __typename: 'UserRoleDto',
    id: 'f3df856f-bd11-4174-97cb-fb6bc54c300a',
    name: 'Brugeradministration',
    description: 'Test',
    eicFunction: EicFunction.DataHubAdministrator,
    status: UserRoleStatus.Active,
  },
];

export const marketParticipantUserRoles: GetUserRolesByActorIdQuery = {
  __typename: 'Query',
  userRolesByActorId: userRoles,
};
