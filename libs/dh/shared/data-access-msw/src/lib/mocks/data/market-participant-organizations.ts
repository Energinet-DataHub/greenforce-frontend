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
  ActorStatus,
  EicFunction,
  GetOrganizationsQuery,
  OrganizationStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const getOrganizationsQueryMock: GetOrganizationsQuery = {
  __typename: 'Query',
  organizations: [
    {
      __typename: 'Organization',
      organizationId: 'b3bdd441-4f22-3f33-b88f-08da5f288474',
      businessRegisterIdentifier: '12345677',
      name: 'Sort Strøm',
      status: OrganizationStatus.Active,
      domain: 'sortstrom.dk',
      actors: [
        {
          __typename: 'Actor',
          id: '938d280d-9af9-4ebe-87fa-7b95fb1b4e5d',
          name: 'Aktør 1',
          glnOrEicNumber: '123',
          marketRole: EicFunction.EnergySupplier,
          status: ActorStatus.Active,
        },
        {
          __typename: 'Actor',
          id: 'df839f07-4e6e-49bb-bb17-1345d45cddd4',
          name: 'Aktør 2',
          glnOrEicNumber: '321',
          marketRole: EicFunction.BalanceResponsibleParty,
          status: ActorStatus.Active,
        },
      ],
    },
    {
      __typename: 'Organization',
      organizationId: '23f2fca9-2b4b-1150-99e9-08dbc66e2700',
      businessRegisterIdentifier: '99990115',
      name: 'Hvid Strøm',
      status: OrganizationStatus.New,
      domain: 'hvidstrom.dk',
      actors: [
        {
          __typename: 'Actor',
          id: 'f70cb365-38ea-4b4b-82e0-33f2d617df0a',
          name: 'Aktør 3',
          glnOrEicNumber: '456',
          marketRole: EicFunction.EnergySupplier,
          status: ActorStatus.Active,
        },
        {
          __typename: 'Actor',
          id: 'f4be9e5a-67c7-4f53-9e3f-47d8d0381651',
          name: 'Aktør 4',
          glnOrEicNumber: '654',
          marketRole: EicFunction.BalanceResponsibleParty,
          status: ActorStatus.Active,
        },
        {
          __typename: 'Actor',
          id: '5e98e349-6cc8-4a80-bcce-0e568caf9baa',
          name: 'Aktør 5',
          glnOrEicNumber: '999',
          marketRole: EicFunction.EnergySupplier,
          status: ActorStatus.Active,
        },
      ],
    },
  ],
};
