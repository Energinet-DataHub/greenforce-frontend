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
import { rest } from 'msw';

import {
  Actor,
  GetActorEditableFieldsQuery,
  ActorStatus,
  EicFunction,
  Organization,
  mockGetActorByIdQuery,
  mockGetActorEditableFieldsQuery,
  mockGetActorsByOrganizationIdQuery,
  mockGetActorsQuery,
  mockGetOrganizationByIdQuery,
  mockGetOrganizationsQuery,
  mockUpdateOrganizationMutation,
  UpdateOrganizationMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import organizationsData from './data/marketParticipantOrganizations.json';
import { marketParticipantOrganizationsWithActors } from './data/marketParticipantOrganizationsWithActors';
import gridAreaData from './data/marketParticipantGridArea.json';
import gridAreaOverviewData from './data/marketParticipantGridAreaOverview.json';
import actorData from './data/marketPaticipantActor.json';
import actorContactsData from './data/marketPaticipantActorContacts.json';
import organizationData from './data/marketPaticipantOrganization.json';
import userRoleData from './data/marketParticipantUserRoleTemplates.json';
import { marketParticipantActors } from './data/market-participant-actors';
import { getOrganizationsQueryMock } from './data/market-participant-organizations';

export function marketParticipantMocks(apiBase: string) {
  return [
    getOrganizations_REST(apiBase),
    getAllOrganizationsWithActors(apiBase),
    getMarketParticipantGridArea(apiBase),
    getMarketParticipantGridAreaOverview(apiBase),
    getActor(apiBase),
    getActorContact(apiBase),
    getOrganization(apiBase),
    getUserRoles(apiBase),
    getActors(),
    getActorById(),
    getActorEditableFields(),
    getOrganizations_GrahpQL(),
    getOrganizationById(),
    getActorByOrganizationId(),
    updateOrganization(),
  ];
}

function getOrganizations_REST(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipant/Organization/GetAllOrganizations`,
    (req, res, ctx) => {
      return res(ctx.json(organizationsData));
    }
  );
}

function getAllOrganizationsWithActors(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipant/Organization/GetAllOrganizationsWithActors`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantOrganizationsWithActors));
    }
  );
}

function getOrganization(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipant/Organization/GetOrganization`,
    (req, res, ctx) => {
      const { orgId } = req.params;
      const organizationDataWithUpdatedId = {
        ...organizationData,
        orgId,
      };
      return res(ctx.json(organizationDataWithUpdatedId));
    }
  );
}

function getMarketParticipantGridArea(apiBase: string) {
  return rest.get(`${apiBase}/v1/MarketParticipantGridArea/GetAllGridAreas`, (req, res, ctx) => {
    return res(ctx.json(gridAreaData));
  });
}

function getMarketParticipantGridAreaOverview(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantGridAreaOverview/GetAllGridAreas`,
    (req, res, ctx) => {
      return res(ctx.json(gridAreaOverviewData));
    }
  );
}

function getActor(apiBase: string) {
  return rest.get(`${apiBase}/v1/MarketParticipant/Organization/GetActor`, (req, res, ctx) => {
    const { actorId } = req.params;
    const actorDataWithUpdatedId = {
      ...actorData,
      actorId,
    };
    return res(ctx.json(actorDataWithUpdatedId));
  });
}

function getActorContact(apiBase: string) {
  return rest.get(`${apiBase}/v1/MarketParticipant/Organization/GetContacts`, (req, res, ctx) => {
    return res(ctx.json(actorContactsData));
  });
}

function getUserRoles(apiBase: string) {
  return rest.get(`${apiBase}/v1/MarketParticipantUserRoleTemplate/users`, (req, res, ctx) => {
    return res(ctx.json(userRoleData));
  });
}

function getActors() {
  return mockGetActorsQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data({ __typename: 'Query', actors: marketParticipantActors }));
  });
}

function getActorById() {
  return mockGetActorByIdQuery((req, res, ctx) => {
    const { id } = req.variables;

    const actorById = marketParticipantActors.find((a) => a.id === id) as Actor;

    return res(ctx.delay(300), ctx.data({ __typename: 'Query', actorById }));
  });
}

function getActorEditableFields() {
  return mockGetActorEditableFieldsQuery((req, res, ctx) => {
    const query: GetActorEditableFieldsQuery = {
      __typename: 'Query',
      actorById: {
        __typename: 'Actor',
        name: 'Test Actor 1',
        organization: {
          __typename: 'Organization',
          domain: 'fake-domain.dk',
        } as Organization,
        contact: {
          __typename: 'ActorContactDto',
          name: 'Test Department',
          email: 'test-actor@fake-domain.dk',
          phone: '11223344',
        },
      },
    };

    return res(ctx.delay(300), ctx.data(query));
  });
}

function getOrganizations_GrahpQL() {
  return mockGetOrganizationsQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data(getOrganizationsQueryMock));
  });
}

function getOrganizationById() {
  return mockGetOrganizationByIdQuery((req, res, ctx) => {
    const { id } = req.variables;

    const organizationById = getOrganizationsQueryMock.organizations.find(
      (a) => a.organizationId === id
    ) as Organization;

    return res(ctx.delay(300), ctx.data({ __typename: 'Query', organizationById }));
  });
}

function getActorByOrganizationId() {
  return mockGetActorsByOrganizationIdQuery((req, res, ctx) => {
    const { organizationId } = req.variables;

    const actors: Actor[] = [
      {
        __typename: 'Actor',
        id: '801011ea-a291-41f7-be19-581abc05a5ac',
        glnOrEicNumber: '5790000555465',
        name: 'Inactive balance responsible',
        gridAreas: [],
        marketRole: EicFunction.BalanceResponsibleParty,
        status: ActorStatus.Inactive,
        organization: {
          __typename: 'Organization',
          organizationId: organizationId,
          name: '',
        } as Organization,
      },
      {
        __typename: 'Actor',
        id: '9c3be101-1471-4a1a-8f52-ddb619778f8f',
        glnOrEicNumber: '5790000555466',
        name: 'Active energy supplier',
        gridAreas: [],
        marketRole: EicFunction.EnergySupplier,
        status: ActorStatus.Active,
        organization: {
          __typename: 'Organization',
          organizationId: organizationId,
          name: '',
        } as Organization,
      },
    ];

    return res(ctx.delay(300), ctx.data({ __typename: 'Query', actorsByOrganizationId: actors }));
  });
}

function updateOrganization() {
  return mockUpdateOrganizationMutation((req, res, ctx) => {
    const response: UpdateOrganizationMutation = {
      __typename: 'Mutation',
      updateOrganization: {
        __typename: 'UpdateOrganizationPayload',
        errors: [],
        boolean: true,
      },
    };

    return res(ctx.delay(300), ctx.data(response));
  });
}
