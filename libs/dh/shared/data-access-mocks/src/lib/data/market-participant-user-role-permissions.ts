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
import { GetPermissionByEicFunctionQuery } from '@energinet-datahub/dh/shared/domain/graphql';

export const marketParticipantUserRolePermissionsQuery: GetPermissionByEicFunctionQuery = {
  __typename: 'Query',
  permissionsByEicFunction: [
    {
      __typename: 'PermissionDetailsDto',
      id: 1,
      name: 'actors:manage',
      description: 'Permission to manage actors',
      created: new Date('2021-09-01T00:00:00Z'),
    },
    {
      __typename: 'PermissionDetailsDto',
      id: 2,
      name: 'organizations:view',
      description: 'Permission to view organization',
      created: new Date('2021-09-02T00:00:00Z'),
    },
    {
      __typename: 'PermissionDetailsDto',
      id: 3,
      name: 'user:manage',
      description: 'Permission to manage users',
      created: new Date('2021-09-03T00:00:00Z'),
    },
    {
      __typename: 'PermissionDetailsDto',
      id: 4,
      name: 'user-roles:manage',
      description: 'Permission to manage user roles',
      created: new Date('2021-09-04T00:00:00Z'),
    },
  ],
};

export const marketParticipantUserRolePermissions = [
  {
    id: 1,
    name: 'actors:manage',
    description: 'Permission to manage actors',
  },
  {
    id: 2,
    name: 'organizations:view',
    description: 'Permission to view organization',
  },
  {
    id: 3,
    name: 'user:manage',
    description: 'Permission to manage users',
  },
  {
    id: 4,
    name: 'user-roles:manage',
    description: 'Permission to manage user roles',
  },
];
