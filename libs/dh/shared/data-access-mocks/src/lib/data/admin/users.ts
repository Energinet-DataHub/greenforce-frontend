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

/* eslint-disable sonarjs/no-duplicate-string */

import {
  Actor,
  ActorAuditedChange,
  ActorAuditedChangeAuditLogDto,
  ActorStatus,
  ContactCategory,
  EicFunction,
  GridAreaStatus,
  GridAreaType,
  OrganizationAuditedChange,
  OrganizationAuditedChangeAuditLogDto,
  PriceAreaCode,
  UserOverviewItemDto,
  UserRoleStatus,
  UserStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { credentials } from '../market-participant-filtered-actors';

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

const orgAuditLog: OrganizationAuditedChangeAuditLogDto = {
  __typename: 'OrganizationAuditedChangeAuditLogDto',
  change: OrganizationAuditedChange.Domain,
  isInitialAssignment: false,
  timestamp: new Date('2021-02-01'),
  auditedBy: 'Jane Smith',
  currentValue: 'Jane Smith',
  previousValue: 'John Doe',
};

const actor: Actor = {
  __typename: 'Actor',
  id: '2',
  displayName: 'Jane Smith • 9876543210987 • DataHubAdministrator',
  glnOrEicNumber: '9876543210987',
  gridAreas: [
    {
      __typename: 'GridAreaDto',
      id: '2',
      code: 'DK2',
      name: 'Denmark',
      displayName: 'Denmark',
      includedInCalculation: false,
      priceAreaCode: PriceAreaCode.Dk2,
      status: GridAreaStatus.Created,
      type: GridAreaType.Aboard,
      validFrom: new Date('2021-02-01'),
      validTo: null,
    },
  ],
  credentials,
  auditLogs: [auditLog],
  marketRole: EicFunction.DataHubAdministrator,
  name: 'Jane Smith',
  delegations: [],
  organization: {
    __typename: 'Organization',
    address: {
      __typename: 'AddressDto',
      country: 'Denmark',
      city: 'Aarhus',
      number: '2',
      streetName: 'Example street',
      zipCode: '8000',
    },
    businessRegisterIdentifier: '987654321',
    domains: ['example.com'],
    id: '2',
    name: 'Example organization',
    status: 'Inactive',
    actors: [],

    auditLogs: [orgAuditLog],
  },
  status: ActorStatus.Inactive,
  userRoles: [
    {
      __typename: 'ActorUserRole',
      assigned: true,
      description: 'Example description',
      eicFunction: EicFunction.Delegated,
      id: '2',
      name: 'Example role',
      status: UserRoleStatus.Inactive,
    },
  ],
  balanceResponsibleAgreements: [],
  contact: {
    __typename: 'ActorContactDto',
    actorId: '2',
    category: ContactCategory.EnerginetInquiry,
    contactId: '2',
    email: '',
    name: 'Example contact',
    phone: '87654321',
  },
  additionalRecipientForMeasurements: [],
};

export const users: UserOverviewItemDto[] = [
  {
    __typename: 'UserOverviewItemDto',
    id: '2',
    name: 'Jane Smith',
    createdDate: new Date('2021-02-01'),
    email: 'jane@email.com',
    firstName: 'Jane',
    lastName: 'Smith',
    status: UserStatus.Inactive,
    phoneNumber: '87654321',
    latestLoginAt: new Date('2024-02-02'),
    actors: [actor],
    administratedBy: actor,
  },
  {
    __typename: 'UserOverviewItemDto',
    id: '3',
    name: 'Alice Johnson',
    createdDate: new Date('2021-03-01'),
    email: 'alice@email.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    status: UserStatus.InviteExpired,
    phoneNumber: '11223344',
    latestLoginAt: new Date('2024-02-01'),
    administratedBy: actor,
    actors: [
      {
        __typename: 'Actor',
        id: '3',
        displayName: 'Alice Johnson • 1122334455667 • BalanceResponsibleParty',
        glnOrEicNumber: '1122334455667',
        delegations: [],
        gridAreas: [
          {
            __typename: 'GridAreaDto',
            id: '3',
            code: 'DK3',
            name: 'Denmark',
            displayName: 'Denmark',
            includedInCalculation: true,
            priceAreaCode: PriceAreaCode.Dk1,
            status: GridAreaStatus.Archived,
            type: GridAreaType.Aboard,
            validFrom: new Date('2021-03-01'),
            validTo: null,
          },
        ],
        marketRole: EicFunction.BalanceResponsibleParty,
        name: 'Alice Johnson',
        auditLogs: [auditLog],
        credentials,
        organization: {
          __typename: 'Organization',
          address: {
            __typename: 'AddressDto',
            country: 'Denmark',
            city: 'Odense',
            number: '3',
            streetName: 'Sample street',
            zipCode: '5000',
          },
          businessRegisterIdentifier: '112233445',
          domains: ['sample.com'],
          id: '3',
          name: 'Sample organization',
          status: 'Pending',
          actors: [],
          auditLogs: [orgAuditLog],
        },
        status: ActorStatus.Inactive,
        userRoles: [
          {
            __typename: 'ActorUserRole',
            assigned: true,
            description: 'Sample description',
            eicFunction: EicFunction.BalanceResponsibleParty,
            id: '3',
            name: 'Sample role',
            status: UserRoleStatus.Active,
          },
        ],
        balanceResponsibleAgreements: [],
        contact: {
          __typename: 'ActorContactDto',
          actorId: '3',
          category: ContactCategory.Default,
          contactId: '3',
          email: '',
          name: 'Sample contact',
          phone: '11223344',
        },
        additionalRecipientForMeasurements: [],
      },
    ],
  },
  {
    __typename: 'UserOverviewItemDto',
    id: '4',
    name: 'Bob Brown',
    createdDate: new Date('2021-04-01'),
    email: 'bob@email.com',
    firstName: 'Bob',
    lastName: 'Brown',
    status: UserStatus.Active,
    phoneNumber: '22334455',
    latestLoginAt: new Date('2023-02-01'),
    administratedBy: actor,
    actors: [
      {
        __typename: 'Actor',
        id: '4',
        displayName: 'Bob Brown • 2233445566778 • BalanceResponsibleParty',
        glnOrEicNumber: '2233445566778',
        delegations: [],
        gridAreas: [
          {
            __typename: 'GridAreaDto',
            id: '4',
            code: 'DK4',
            name: 'Denmark',
            displayName: 'Denmark',
            includedInCalculation: false,
            priceAreaCode: PriceAreaCode.Dk2,
            status: GridAreaStatus.Active,
            type: GridAreaType.Aboard,
            validFrom: new Date('2021-04-01'),
            validTo: null,
          },
        ],
        marketRole: EicFunction.BalanceResponsibleParty,
        auditLogs: [auditLog],
        credentials,
        name: 'Bob Brown',
        organization: {
          __typename: 'Organization',
          address: {
            __typename: 'AddressDto',
            country: 'Denmark',
            city: 'Aalborg',
            number: '4',
            streetName: 'Test avenue',
            zipCode: '9000',
          },
          businessRegisterIdentifier: '223344556',
          domains: ['test.com'],
          id: '4',
          name: 'Test organization',
          status: 'Active',
          actors: [],
          auditLogs: [orgAuditLog],
        },
        status: ActorStatus.Active,
        userRoles: [
          {
            __typename: 'ActorUserRole',
            assigned: false,
            description: 'Test description',
            eicFunction: EicFunction.DanishEnergyAgency,
            id: '4',
            name: 'Test role',
            status: UserRoleStatus.Active,
          },
        ],
        balanceResponsibleAgreements: [],
        contact: {
          __typename: 'ActorContactDto',
          actorId: '4',
          category: ContactCategory.Charges,
          contactId: '4',
          email: '',
          name: 'Test contact',
          phone: '22334455',
        },
        additionalRecipientForMeasurements: [],
      },
    ],
  },
  {
    __typename: 'UserOverviewItemDto',
    id: '5',
    name: 'Charlie Davis',
    createdDate: new Date('2021-05-01'),
    email: 'charlie@email.com',
    firstName: 'Charlie',
    lastName: 'Davis',
    status: UserStatus.Inactive,
    phoneNumber: '33445566',
    latestLoginAt: new Date('2024-02-01'),
    administratedBy: actor,
    actors: [
      {
        __typename: 'Actor',
        id: '5',
        displayName: 'Charlie Davis • 3344556677889 • BalanceResponsibleParty',
        glnOrEicNumber: '3344556677889',
        delegations: [],
        gridAreas: [
          {
            __typename: 'GridAreaDto',
            id: '5',
            code: 'DK5',
            name: 'Denmark',
            displayName: 'Denmark',
            includedInCalculation: true,
            priceAreaCode: PriceAreaCode.Dk1,
            status: GridAreaStatus.Expired,
            type: GridAreaType.Aboard,
            validFrom: new Date('2021-05-01'),
            validTo: null,
          },
        ],
        marketRole: EicFunction.BalanceResponsibleParty,
        name: 'Charlie Davis',
        credentials,
        auditLogs: [auditLog],
        organization: {
          __typename: 'Organization',
          address: {
            __typename: 'AddressDto',
            country: 'Denmark',
            city: 'Esbjerg',
            number: '5',
            streetName: 'Example avenue',
            zipCode: '6700',
          },
          businessRegisterIdentifier: '334455667',
          domains: ['example.com'],
          id: '5',
          name: 'Example organization',
          status: 'Inactive',
          actors: [],
          auditLogs: [orgAuditLog],
        },
        status: ActorStatus.Inactive,
        userRoles: [
          {
            __typename: 'ActorUserRole',
            assigned: true,
            description: 'Example description',
            eicFunction: EicFunction.BalanceResponsibleParty,
            id: '5',
            name: 'Example role',
            status: UserRoleStatus.Inactive,
          },
        ],
        balanceResponsibleAgreements: [],
        contact: {
          __typename: 'ActorContactDto',
          actorId: '5',
          category: ContactCategory.Charges,
          contactId: '5',
          email: '',
          name: 'Example contact',
          phone: '33445566',
        },
        additionalRecipientForMeasurements: [],
      },
    ],
  },
  {
    __typename: 'UserOverviewItemDto',
    id: '6',
    name: 'Diana Evans',
    createdDate: new Date('2021-06-01'),
    email: 'diana@email.com',
    firstName: 'Diana',
    lastName: 'Evans',
    status: UserStatus.Active,
    phoneNumber: '44556677',
    latestLoginAt: new Date('2024-04-01'),
    administratedBy: actor,
    actors: [
      {
        __typename: 'Actor',
        id: '6',
        displayName: 'Diana Evans • 4455667788990 • BalanceResponsibleParty',
        glnOrEicNumber: '4455667788990',
        delegations: [],
        gridAreas: [
          {
            __typename: 'GridAreaDto',
            id: '6',
            code: 'DK6',
            name: 'Denmark',
            displayName: 'Denmark',
            includedInCalculation: false,
            priceAreaCode: PriceAreaCode.Dk2,
            status: GridAreaStatus.Active,
            type: GridAreaType.Aboard,
            validFrom: new Date('2021-06-01'),
            validTo: null,
          },
        ],
        marketRole: EicFunction.BalanceResponsibleParty,
        name: 'Diana Evans',
        credentials,
        auditLogs: [auditLog],
        organization: {
          __typename: 'Organization',
          address: {
            __typename: 'AddressDto',
            country: 'Denmark',
            city: 'Randers',
            number: '6',
            streetName: 'Sample avenue',
            zipCode: '8900',
          },
          businessRegisterIdentifier: '445566778',
          domains: ['sample.com'],
          id: '6',
          name: 'Sample organization',
          status: 'Pending',
          actors: [],
          auditLogs: [orgAuditLog],
        },
        status: ActorStatus.Active,
        userRoles: [
          {
            __typename: 'ActorUserRole',
            assigned: true,
            description: 'Sample description',
            eicFunction: EicFunction.DanishEnergyAgency,
            id: '6',
            name: 'Sample role',
            status: UserRoleStatus.Active,
          },
        ],
        balanceResponsibleAgreements: [],
        contact: {
          __typename: 'ActorContactDto',
          actorId: '6',
          category: ContactCategory.EndOfSupply,
          contactId: '6',
          email: '',
          name: 'Sample contact',
          phone: '44556677',
        },
        additionalRecipientForMeasurements: [],
      },
    ],
  },
];
