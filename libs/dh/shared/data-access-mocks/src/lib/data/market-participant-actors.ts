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
  ActorContactDto,
  ActorStatus,
  ActorUserRole,
  ContactCategory,
  EicFunction,
  GridAreaDto,
  Organization,
  UserRoleStatus,
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

const contact: ActorContactDto = {
  __typename: 'ActorContactDto',
  email: 'test@energinet.dk',
  actorId: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb1',
  phone: '12345678',
  contactId: '1',
  name: 'Test Name',
  category: ContactCategory.MeasurementData,
};

export const marketParticipantActors: Actor[] = [
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb1',
    glnOrEicNumber: '5790000555555',
    name: 'Test Actor 1',
    displayName: 'Test Actor 1 • EnergySupplier',
    userRoles: userActorRoles,
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        displayName: `DK1 • DK1`,
        code: 'DK1',
        name: 'DK1',
        id: '1',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.EnergySupplier,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      id: 'b3bdd441-4f22-3f33-b88f-08da5f288474',
      name: 'Organization 1',
      domains: ['data.dk', 'todo.dk', 'funny.dk', 'domain.dk'],
      businessRegisterIdentifier: '12345678',
      address: {
        __typename: 'AddressDto',
        country: 'Denmark',
        city: 'Copenhagen',
        number: '1',
        streetName: 'Test Street',
        zipCode: '1234',
      },
    } as Organization,
    publicMail: null,
    contact,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb4',
    glnOrEicNumber: '5790000555465',
    name: 'Test Actor 3',
    displayName: 'Test Actor 3 • GridAccessProvider',
    userRoles: userActorRoles,
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        displayName: `DK1 • DK1`,
        code: 'DK1',
        name: 'DK1',
        id: '2',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.GridAccessProvider,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      id: 'id-test-organization-3',
      name: 'Test Organization 3',
      domains: ['data.dk', 'todo.dk', 'funny.dk', 'domain.dk'],
      businessRegisterIdentifier: '12345678',
      address: {
        __typename: 'AddressDto',
        country: 'Denmark',
        city: 'Copenhagen',
        number: '2',
        streetName: 'Test Street 2',
        zipCode: '4444',
      },
    } as Organization,
    publicMail: null,
    contact,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
    glnOrEicNumber: '5790000555465',
    name: 'Test Actor 2',
    displayName: 'Test Actor 2 • BalanceResponsibleParty',
    userRoles: userActorRoles,
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        displayName: `DK1 • DK1`,
        code: 'DK1',
        name: 'DK1',
        id: '3',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.BalanceResponsibleParty,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      id: 'id-test-organization-2',
      name: 'Test Organization 2',
      address: {
        __typename: 'AddressDto',
        country: 'Denmark',
        city: 'Copenhagen',
        number: '3',
        streetName: 'Test Street 3',
        zipCode: '5555',
      },
      businessRegisterIdentifier: '12345678',
      domains: ['data.dk', 'todo.dk', 'funny.dk', 'domain.dk'],
      status: 'Active',
      actors: [],
    },
    publicMail: null,
    contact,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c18-08da5f28ddb1',
    glnOrEicNumber: '5790000555444',
    name: 'Test Actor 3',
    displayName: 'Test Actor 3 • DanishEnergyAgency',
    userRoles: userActorRoles,
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        displayName: `DK2 • DK2`,
        code: 'DK2',
        name: 'DK2',
        id: '4',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.DanishEnergyAgency,
    status: ActorStatus.Inactive,
    organization: {
      __typename: 'Organization',
      id: 'id-test-organization-2',
      name: 'Test Organization 2',
      address: {
        __typename: 'AddressDto',
        country: 'Denmark',
        city: 'Copenhagen',
        number: '3',
        streetName: 'Test Street 3',
        zipCode: '5555',
      },
      businessRegisterIdentifier: '12345678',
      domains: ['data.dk', 'todo.dk', 'funny.dk', 'domain.dk'],
      status: 'Active',
      actors: [],
    },
    publicMail: null,
    contact,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c19-08da5f28ddb1',
    glnOrEicNumber: '5790000555123',
    userRoles: userActorRoles,
    name: 'Test Actor 4',
    displayName: 'Test Actor 4 • DanishEnergyAgency',
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        displayName: `DK2 • DK2`,
        code: 'DK2',
        name: 'DK2',
        id: '5',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.DanishEnergyAgency,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      id: 'id-test-organization-3',
      name: 'Test Organization 3',
      address: {
        __typename: 'AddressDto',
        country: 'Denmark',
        city: 'Copenhagen',
        number: '2',
        streetName: 'Test Street 2',
        zipCode: '4444',
      },
      businessRegisterIdentifier: '12345678',
      domains: ['data.dk', 'todo.dk', 'funny.dk', 'domain.dk'],
      status: 'Active',
      actors: [],
    },
    publicMail: null,
    contact: null,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1',
    glnOrEicNumber: '5790000555333',
    name: 'Test Actor 5',
    displayName: 'Test Actor 5 • BalanceResponsibleParty',
    userRoles: userActorRoles,
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        displayName: `DK2 • DK2`,
        code: 'DK2',
        name: 'DK2',
        id: '6',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.BalanceResponsibleParty,
    status: null as unknown as ActorStatus,
    organization: null as unknown as Organization,
    publicMail: {
      __typename: 'ActorPublicMail',
      mail: 'hello@efad0fee-9d7c-49c6-7c20-08da5f28ddb1.com',
    },
    contact,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb2',
    glnOrEicNumber: '5790000555588',
    name: 'Test Actor 6',
    displayName: 'Test Actor 6 • EnergySupplier',
    userRoles: userActorRoles,
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        displayName: `DK1 • DK1`,
        code: 'DK1',
        name: 'DK1',
        id: '1',
      } as GridAreaDto,
    ],
    marketRole: EicFunction.EnergySupplier,
    status: ActorStatus.Active,
    organization: {
      __typename: 'Organization',
      id: 'id-test-organization-1',
      name: 'Test Organization 1',
    } as Organization,
    publicMail: null,
    contact: null,
  },
];
