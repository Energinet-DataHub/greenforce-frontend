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
export const marketParticipantUserRoleGetUserRoleWithPermissions = [
  {
    id: 'ff029a48-b06f-4300-8ec0-84d121a4b83f',
    name: 'Balanceansvarlig',
    description: 'Manglede beskrivelse',
    eicFunction: 'EnergySupplier',
    status: 'Active',
    permissions: [
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
    ],
  },
  {
    id: '512b2941-e82e-4097-aa4b-ec322871a3e6',
    name: 'Supporter',
    description: 'Manglede beskrivelse',
    eicFunction: 'EnergySupplier',
    status: 'Active',
    permissions: [
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
    ],
  },
];
