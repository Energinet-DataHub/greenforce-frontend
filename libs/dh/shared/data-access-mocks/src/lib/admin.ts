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
import { delay, http, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import {
  mockGetKnownEmailsQuery,
  mockGetPermissionDetailsQuery,
  mockGetPermissionAuditLogsQuery,
  mockGetPermissionsQuery,
  mockGetUserRoleAuditLogsQuery,
  mockGetUserRolesByEicfunctionQuery,
  mockGetUserAuditLogsQuery,
  mockGetGridAreasQuery,
  mockUserOverviewSearchQuery,
  mockGetUserRolesByActorIdQuery,
  mockGetUserRoleWithPermissionsQuery,
  mockGetUserByIdQuery,
  GetUserResponse,
  mockUpdateUserAndRolesMutation,
  mockUpdatePermissionMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { actorQuerySelection } from './data/market-participant-actor-query-selection-actors';
import { marketParticipantUserRoleGetAll } from './data/market-participant-user-role-get-all';
import { marketParticipantUserGetUserAuditLogs } from './data/market-participant-user-get-user-audit-logs';
import { marketParticipantUserRoleGetUserRoleWithPermissions } from './data/market-participant-user-role-get-user-role-with-permissions';
import { getUserRoleAuditLogsMock } from './data/get-user-role-audit-logs';
import { adminPermissionsMock } from './data/admin-get-permissions';
import { adminPermissionAuditLogsMock } from './data/admin-get-permission-audit-logs';
import { adminPermissionDetailsMock } from './data/admin-get-permission-details';
import { marketParticipantUserRoles } from './data/admin-get-market-participant-user-roles';
import { marketParticipantOrganization } from './data/admin-get-actor-organization';
import { getUserRolesByEicfunction } from './data/get-user-roles-by-eicfunction';
import { marketParticipantOrganizationGetFilteredActors } from './data/market-participant-organization-get-filtered-actors';
import { getGridAreas } from './data/get-grid-areas';
import { overviewUsers } from './data/admin/user-overview-items';

export function adminMocks(apiBase: string) {
  return [
    getMarketParticipantActorQuerySelectionActors(apiBase),
    getMarketParticipantUserRoleGetAll(apiBase),
    getMarketParticipantUserGetUserAuditLogs(),
    getUserRoleWithPermissionsQuery(),
    putMarketParticipantUserRoleUpdate(apiBase),
    getMarketParticipantOrganizationGetFilteredActors(apiBase),
    getAdminPermissions(),
    getAdminPermissionLogs(),
    getAdminPermissionDetails(),
    getUserRoleAuditLogs(),
    getUserRolesByEicfunctionQuery(),
    postMarketParticipantUserRoleCreate(apiBase),
    postMarketParticipantUserInviteUser(apiBase),
    getUserRolesByActorIdQuery(),
    getActorOrganization(apiBase),
    getKnownEmailsQuery(),
    getGridAreasQuery(),
    getUserOverviewQuery(),
    getUserByIdQuery(),
    updateUserAndRoles(),
    updatePermission(),
    getMarketParticipantUserDeactivate(apiBase),
    getMarketParticipantUserReActivate(apiBase),
  ];
}

function getMarketParticipantUserDeactivate(apiBase: string) {
  return http.put(`${apiBase}/v1/MarketParticipantUser/DeactivateUser`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 200 });
  });
}

function getMarketParticipantUserReActivate(apiBase: string) {
  return http.put(`${apiBase}/v1/MarketParticipantUser/ReActivateUser`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 200 });
  });
}

function getMarketParticipantActorQuerySelectionActors(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantActorQuery/GetSelectionActors`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(actorQuerySelection);
  });
}

function getUserRolesByActorIdQuery() {
  return mockGetUserRolesByActorIdQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: marketParticipantUserRoles });
  });
}

function getActorOrganization(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipant/Organization/GetActorOrganization`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(marketParticipantOrganization);
  });
}

function getMarketParticipantUserRoleGetAll(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantUserRole/GetAll`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(marketParticipantUserRoleGetAll);
  });
}

function getMarketParticipantUserGetUserAuditLogs() {
  return mockGetUserAuditLogsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: marketParticipantUserGetUserAuditLogs });
  });
}

function getUserRoleWithPermissionsQuery() {
  return mockGetUserRoleWithPermissionsQuery(async ({ variables }) => {
    const userRole = marketParticipantUserRoleGetUserRoleWithPermissions.find(
      (userRole) => userRole.id === variables.id
    );

    if (userRole) {
      await delay(mswConfig.delay);

      return HttpResponse.json({ data: { __typename: 'Query', userRoleById: userRole } });
    }

    return HttpResponse.json(null, { status: 404 });
  });
}

function getUserRoleAuditLogs() {
  return mockGetUserRoleAuditLogsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: getUserRoleAuditLogsMock });
  });
}

function getUserByIdQuery() {
  return mockGetUserByIdQuery(async ({ variables }) => {
    const userId = variables.id;
    await delay(mswConfig.delay);

    const user = overviewUsers.find((user) => user.id === userId) as GetUserResponse | undefined;

    if (user) {
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          userById: user,
        },
      });
    }

    return HttpResponse.json(null, { status: 404 });
  });
}

function getUserOverviewQuery() {
  return mockUserOverviewSearchQuery(async () => {
    await delay(mswConfig.delay);

    const users = overviewUsers;

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        userOverviewSearch: {
          __typename: 'GetUserOverviewResponse',
          totalUserCount: users.length,
          users: users,
        },
      },
    });
  });
}

function putMarketParticipantUserRoleUpdate(apiBase: string) {
  return http.put(`${apiBase}/v1/MarketParticipantUserRole/Update`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 200 });
  });
}

function getMarketParticipantOrganizationGetFilteredActors(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipant/Organization/GetFilteredActors`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(marketParticipantOrganizationGetFilteredActors);
  });
}

function getAdminPermissions() {
  return mockGetPermissionsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: adminPermissionsMock });
  });
}

function getAdminPermissionDetails() {
  return mockGetPermissionDetailsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: adminPermissionDetailsMock });
  });
}

function getAdminPermissionLogs() {
  return mockGetPermissionAuditLogsQuery(async ({ variables }) => {
    const permId = variables.id;
    const permissionAuditLogs = [adminPermissionAuditLogsMock[permId]];
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: { __typename: 'Query', permissionAuditLogs } });
  });
}

function postMarketParticipantUserRoleCreate(apiBase: string) {
  return http.post(`${apiBase}/v1/MarketParticipantUserRole/Create`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.text('', { status: 200 });
  });
}

function postMarketParticipantUserInviteUser(apiBase: string) {
  return http.post(`${apiBase}/v1/MarketParticipantUser/InviteUser`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 200 });
  });
}

function updatePermission() {
  return mockUpdatePermissionMutation(async ({ variables }) => {
    const { id } = variables.input.input;
    await delay(mswConfig.delay);

    if (id === 1)
      return HttpResponse.json({
        data: null,
        errors: [
          {
            message: 'Permission not found',
            path: ['updatePermission'],
            extensions: { code: 'NOT_FOUND' },
          },
        ],
      });

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        updatePermission: {
          errors: null,
          __typename: 'UpdatePermissionPayload',
          permission: {
            __typename: 'Permission',
            id,
          },
        },
      },
    });
  });
}

function updateUserAndRoles() {
  return mockUpdateUserAndRolesMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        updateUserIdentity: {
          success: true,
          __typename: 'UpdateUserIdentityPayload',
          errors: null,
        },
        updateUserRoleAssignment: {
          success: true,
          __typename: 'UpdateUserRoleAssignmentPayload',
          errors: null,
        },
      },
    });
  });
}

function getUserRolesByEicfunctionQuery() {
  return mockGetUserRolesByEicfunctionQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: getUserRolesByEicfunction });
  });
}

function getKnownEmailsQuery() {
  return mockGetKnownEmailsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        knownEmails: [
          'testuser1@test.dk',
          'testuser2@test.dk',
          'testuser3@test.dk',
          'testuser4@test.dk',
        ],
      },
    });
  });
}

function getGridAreasQuery() {
  return mockGetGridAreasQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: getGridAreas });
  });
}
