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
  Actor,
  ActorAuditedChange,
  ActorAuditedChangeAuditLogDto,
  ActorStatus,
  ContactCategory,
  EicFunction,
  OrganizationAuditedChange,
  OrganizationAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

const auditLog: ActorAuditedChangeAuditLogDto = {
  __typename: 'ActorAuditedChangeAuditLogDto',
  change: ActorAuditedChange.Name,
  isInitialAssignment: false,
  timestamp: new Date('2021-02-01'),
  auditedBy: 'Jane Smith',
  consolidation: null,
  currentValue: 'Jane Smith',
  previousValue: 'John Doe',
  delegation: null,
};

const organizationAuditLog: OrganizationAuditedChangeAuditLogDto = {
  __typename: 'OrganizationAuditedChangeAuditLogDto',
  change: OrganizationAuditedChange.Name,
  isInitialAssignment: false,
  timestamp: new Date('2021-02-01'),
  auditedBy: 'Jane Smith',
  currentValue: 'Jane Smith',
  previousValue: 'John Doe',
};
export const filteredActors: Actor[] = [
  {
    __typename: 'Actor',
    id: '00000000-0000-0000-0000-000000000001',
    glnOrEicNumber: '5790001330583',
    name: 'Energinet DataHub A/S',
    status: ActorStatus.Active,
    userRoles: [],
    gridAreas: [],
    marketRole: EicFunction.DataHubAdministrator,
    displayName: 'Energinet DataHub A/S • DataHubAdministrator',
    auditLog: [auditLog],
    contact: {
      __typename: 'ActorContactDto',
      contactId: '10000000-0000-0000-0000-000000000001',
      actorId: '00000000-0000-0000-0000-000000000001',
      category: ContactCategory.Default,
      name: 'Energinet Contact',
      email: 'noreply@datahub.dk',
    },
    organization: {
      auditLogs: [organizationAuditLog],
      id: '00000000-0000-0000-0000-000000000031',
      name: 'Energinet DataHub A/S',
      businessRegisterIdentifier: '5790001330583',
      domains: ['energinet.dk'],
      status: 'Active',
      __typename: 'Organization',
      address: {
        __typename: 'AddressDto',
        country: 'DK',
      },
    },
  },
  {
    __typename: 'Actor',
    id: '00000000-0000-0000-0000-000000000002',
    glnOrEicNumber: '5790001330583',
    name: 'Sort Størm A/S',
    status: ActorStatus.Active,
    userRoles: [],
    gridAreas: [],
    marketRole: EicFunction.EnergySupplier,
    displayName: 'Sort Størm A/S • EnergySupplier',
    auditLog: [auditLog],
    contact: {
      __typename: 'ActorContactDto',
      contactId: '10000000-0000-0000-0000-000000000002',
      actorId: '00000000-0000-0000-0000-000000000002',
      category: ContactCategory.Default,
      name: 'Sort Størm Contact',
      email: 'noreply@sortstrøm.dk',
    },
    organization: {
      auditLogs: [organizationAuditLog],
      id: '00000000-0000-0000-0000-000000000033',
      name: 'Sort Størm A/S',
      businessRegisterIdentifier: '5790001330583',
      domains: ['sort.dk', 'hvid.dk'],
      status: 'Active',
      __typename: 'Organization',
      address: {
        __typename: 'AddressDto',
        country: 'DK',
      },
    },
  },
];
