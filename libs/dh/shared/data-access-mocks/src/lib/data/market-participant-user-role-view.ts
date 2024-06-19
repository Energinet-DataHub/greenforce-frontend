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
export const marketParticipantUserRoleView = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    organizationName: 'Energinet DataHub A/S',
    name: 'Energinet DataHub A/S (FAS)',
    actorNumber: '5790001330583',
    userRoles: [
      {
        id: 'b50dfe6b-962b-448e-88e6-97b715fb33bc',
        name: 'Supporter',
        marketRole: 'EnergySupplier',
        description: 'Beskrivelse Supporter',
        userActorId: '00000000-0000-0000-0000-000000000001',
      },
      {
        id: 'b50dfe6b-962b-448e-88e6-97b715fb33ba',
        name: 'Lys ansvarlig',
        marketRole: 'EnergySupplier',
        description: 'Beskrivelse Lys ansvarlig',
        userActorId: null,
      },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    organizationName: 'Nordlys A/S',
    name: 'Energi mister',
    actorNumber: '3790001330583',
    userRoles: [
      {
        id: 'b50dfe6b-962b-448e-88e6-97b715fb33bc',
        name: 'Lys ansvarlig',
        marketRole: 'EnergySupplier',
        description: 'Beskrivelse Lys ansvarlig',
        userActorId: '00000000-0000-0000-0000-000000000002',
      },
    ],
  },
];
