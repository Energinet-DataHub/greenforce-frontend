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

import { GetUserRolesByEicfunctionQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const getUserRolesByEicfunction: GetUserRolesByEicfunctionQuery = {
  __typename: 'Query',
  userRolesByEicFunction: [
    {
      name: 'dd - slet',
      id: '257b5004-d007-44a4-a640-08db1bddde55',
      description: 'dd - slet',
      __typename: 'UserRoleDto',
    },
    {
      name: 'Rapporter',
      id: 'fafdab39-818e-40b6-bcb2-0d215c9fbfc9',
      description: '',
      __typename: 'UserRoleDto',
    },
    {
      name: 'Sprogskift',
      id: 'f024eebc-ec85-4f56-be8a-4c5aa14833ac',
      description: '',
      __typename: 'UserRoleDto',
    },
    {
      name: 'Se adgang - 2',
      id: '04b3241b-e4ce-4367-8bf8-82e839d2438f',
      description: 'Test',
      __typename: 'UserRoleDto',
    },
    {
      name: 'Brugeradministration',
      id: '1735dead-4f90-4844-bf62-8d282696b592',
      description: '',
      __typename: 'UserRoleDto',
    },
    {
      name: 'Basis adgang',
      id: '6ee01869-d8de-45a2-99d1-9393e1404da8',
      description: '',
      __typename: 'UserRoleDto',
    },
    {
      name: 'Beskedudveksling (Webforms)',
      id: 'ba353b11-145e-40ff-9459-b4c3703983dd',
      description: '',
      __typename: 'UserRoleDto',
    },
    {
      name: 'GUI nyheder',
      id: 'b502b24f-a0d7-4921-a6d4-e7bfa8bf0840',
      description: '',
      __typename: 'UserRoleDto',
    },
    {
      name: 'Fuld adgang',
      id: '838c4700-7794-4e55-b0c9-f4f7ee9ec203',
      description: 'Fuld adgang',
      __typename: 'UserRoleDto',
    },
  ],
};
