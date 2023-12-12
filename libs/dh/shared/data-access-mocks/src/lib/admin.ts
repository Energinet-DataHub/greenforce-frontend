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
  mockGetGridAreasForCreateActorQuery,
  mockGetKnownEmailsQuery,
  mockGetPermissionDetailsQuery,
  mockGetPermissionLogsQuery,
  mockGetPermissionsQuery,
  mockGetUserRoleAuditLogsQuery,
  mockGetUserRolesByEicfunctionQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

import marketParticipantActorQuerySelectionActors from './data/marketParticipantActorQuerySelectionActors.json';
import marketParticipantUserRoleGetAll from './data/marketParticipantUserRoleGetAll.json';
import marketParticipantUserGetUserAuditLogs from './data/marketParticipantUserGetUserAuditLogs.json';
import marketParticipantUserRoleGetUserRoleWithPermissions from './data/marketParticipantUserRoleGetUserRoleWithPermissions.json';
import { getUserRoleAuditLogsMock } from './data/get-user-role-audit-logs';
import { adminPermissionsMock } from './data/admin-get-permissions';
import { adminPermissionPermissionLogsMock } from './data/admin-get-permissionlogs';
import { adminPermissionDetailsMock } from './data/admin-get-permission-details';
import { marketParticipantUserRoles } from './data/admin-get-marketParticipantUserRoles';
import { marketParticipantOrganization } from './data/admin-get-actorOrganization';
import { marketParticipantUserSearchUsers } from './data/marketParticipantUserSearchUsers';
import { getUserRolesByEicfunction } from './data/get-user-roles-by-eicfunction';
import { marketParticipantOrganizationGetFilteredActors } from './data/marketParticipantOrganizationGetFilteredActors';
import { getGridAreasForCreateActorMock } from './data/get-grid-areas-for-actor-create';

export function adminMocks(apiBase: string) {
  return [
    getMarketParticipantUserSearchUsers(apiBase),
    getMarketParticipantActorQuerySelectionActors(apiBase),
    getMarketParticipantUserRoleGetAll(apiBase),
    getMarketParticipantUserGetUserAuditLogs(apiBase),
    getMarketParticipantUserRoleGetUserRoleWithPermissions(apiBase),
    putMarketParticipantUserRoleUpdate(apiBase),
    getMarketParticipantOrganizationGetFilteredActors(apiBase),
    getAdminPermissions(),
    getAdminPermissionLogs(),
    getAdminPermissionDetails(),
    getUserRoleAuditLogs(),
    getUserRolesByEicfunctionQuery(),
    putMarketParticipantPermissionsUpdate(apiBase),
    putMarketParticipantUserUpdateUserIdentity(apiBase),
    putMarketParticipantUserRoleAssignmentUpdateAssignments(apiBase),
    getMarketParticipantUserRoleGetAssignable(apiBase),
    getActorOrganization(apiBase),
    getKnownEmailsQuery(),
    getGridAreasForCreateActor(),
  ];
}

function getMarketParticipantUserSearchUsers(apiBase: string) {
  return rest.post(`${apiBase}/v1/MarketParticipantUserOverview/SearchUsers`, (req, res, ctx) => {
    return res(ctx.delay(300), ctx.json(marketParticipantUserSearchUsers));
  });
}

function getMarketParticipantActorQuerySelectionActors(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantActorQuery/GetSelectionActors`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantActorQuerySelectionActors));
    }
  );
}

function getMarketParticipantUserRoleGetAssignable(apiBase: string) {
  return rest.get(`${apiBase}/v1/MarketParticipantUserRole/GetAssignable`, (req, res, ctx) => {
    return res(ctx.json(marketParticipantUserRoles));
  });
}

function getActorOrganization(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipant/Organization/GetActorOrganization`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantOrganization));
    }
  );
}

function getMarketParticipantUserRoleGetAll(apiBase: string) {
  return rest.get(`${apiBase}/v1/MarketParticipantUserRole/GetAll`, (req, res, ctx) => {
    return res(ctx.delay(300), ctx.json(marketParticipantUserRoleGetAll));
  });
}

function getMarketParticipantUserGetUserAuditLogs(apiBase: string) {
  return rest.get(`${apiBase}/v1/MarketParticipantUser/GetUserAuditLogs`, (req, res, ctx) => {
    return res(ctx.json(marketParticipantUserGetUserAuditLogs));
  });
}

function getMarketParticipantUserRoleGetUserRoleWithPermissions(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantUserRole/GetUserRoleWithPermissions`,
    (req, res, ctx) => {
      const userRoleId = req.url.searchParams.get('userRoleId');

      const userRole = marketParticipantUserRoleGetUserRoleWithPermissions.find(
        (userRole) => userRole.id === userRoleId
      );

      return res(ctx.json(userRole));
    }
  );
}

function getUserRoleAuditLogs() {
  return mockGetUserRoleAuditLogsQuery((req, res, ctx) => {
    return res(ctx.data(getUserRoleAuditLogsMock));
  });
}

function putMarketParticipantUserRoleUpdate(apiBase: string) {
  return rest.put(`${apiBase}/v1/MarketParticipantUserRole/Update`, (req, res, ctx) => {
    return res(ctx.status(200));
  });
}

function getMarketParticipantOrganizationGetFilteredActors(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipant/Organization/GetFilteredActors`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantOrganizationGetFilteredActors));
    }
  );
}

function getAdminPermissions() {
  return mockGetPermissionsQuery((req, res, ctx) => {
    return res(ctx.data(adminPermissionsMock));
  });
}

function getAdminPermissionDetails() {
  return mockGetPermissionDetailsQuery((req, res, ctx) => {
    return res(ctx.data(adminPermissionDetailsMock));
  });
}

function getAdminPermissionLogs() {
  return mockGetPermissionLogsQuery((req, res, ctx) => {
    const permId = req.variables.id;
    const permissionLogs = [adminPermissionPermissionLogsMock[permId]];
    return res(ctx.delay(300), ctx.data({ __typename: 'Query', permissionLogs }));
  });
}

function putMarketParticipantPermissionsUpdate(apiBase: string) {
  return rest.put(`${apiBase}/v1/MarketParticipantPermissions/Update`, (req, res, ctx) => {
    return res(ctx.status(200));
  });
}

function putMarketParticipantUserUpdateUserIdentity(apiBase: string) {
  return rest.put(`${apiBase}/v1/MarketParticipantUser/UpdateUserIdentity`, (req, res, ctx) => {
    return res(ctx.delay(300), ctx.status(200));
  });
}

function putMarketParticipantUserRoleAssignmentUpdateAssignments(apiBase: string) {
  return rest.put(
    `${apiBase}/v1/MarketParticipantUserRoleAssignment/UpdateAssignments`,
    (req, res, ctx) => {
      return res(ctx.delay(300), ctx.status(200));
    }
  );
}

function getUserRolesByEicfunctionQuery() {
  return mockGetUserRolesByEicfunctionQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data(getUserRolesByEicfunction));
  });
}

function getKnownEmailsQuery() {
  return mockGetKnownEmailsQuery((req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.data({
        __typename: 'Query',
        knownEmails: marketParticipantUserSearchUsers.users.map((x) => x.email),
      })
    );
  });
}

function getGridAreasForCreateActor() {
  return mockGetGridAreasForCreateActorQuery((req, res, ctx) => {
    return res(ctx.data(getGridAreasForCreateActorMock));
  });
}
