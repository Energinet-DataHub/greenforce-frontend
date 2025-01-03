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
  EicFunction,
  GetUserRoleWithPermissionsQuery,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const marketParticipantUserRoleGetUserRoleWithPermissions: GetUserRoleWithPermissionsQuery['userRoleById'][] =
  [
    {
      __typename: 'UserRoleWithPermissions',
      id: '512b2941-e82e-4097-aa4b-ec322871a3e6',
      name: 'Basis adgang',
      description: 'Manglede beskrivelse',
      eicFunction: EicFunction.EnergySupplier,
      status: UserRoleStatus.Active,
      permissions: [
        {
          __typename: 'PermissionDetailsDto',
          id: 1,
          name: 'actors:manage',
          description: 'Permission to manage actors',
        },
        {
          __typename: 'PermissionDetailsDto',
          id: 2,
          name: 'organizations:view',
          description: 'Permission to view organization',
        },
        {
          __typename: 'PermissionDetailsDto',
          id: 3,
          name: 'user:manage',
          description: 'Permission to manage users',
        },
      ],
    },
    {
      __typename: 'UserRoleWithPermissions',
      id: 'b5b8b2b1-7b2e-4d0b-8c4f-0e1a4b2f7d1b',
      name: 'Fuld adgang [Edit error state]',
      description: 'Manglede beskrivelse',
      eicFunction: EicFunction.EnergySupplier,
      status: UserRoleStatus.Active,
      permissions: [
        {
          __typename: 'PermissionDetailsDto',
          id: 1,
          name: 'actors:manage',
          description: 'Permission to manage actors',
        },
        {
          __typename: 'PermissionDetailsDto',
          id: 2,
          name: 'organizations:view',
          description: 'Permission to view organization',
        },
        {
          __typename: 'PermissionDetailsDto',
          id: 3,
          name: 'user:manage',
          description: 'Permission to manage users',
        },
      ],
    },
  ];
