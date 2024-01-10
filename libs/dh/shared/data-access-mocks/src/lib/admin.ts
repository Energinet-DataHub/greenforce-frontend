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

import {
  mockGetGridAreasForCreateActorQuery,
  mockGetKnownEmailsQuery,
  mockGetPermissionDetailsQuery,
  mockGetPermissionAuditLogsQuery,
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
import { adminPermissionAuditLogsMock } from './data/admin-get-permission-audit-logs';
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
    postMarketParticipantUserRoleCreate(apiBase),
    putMarketParticipantUserUpdateUserIdentity(apiBase),
    putMarketParticipantUserRoleAssignmentUpdateAssignments(apiBase),
    getMarketParticipantUserRoleGetAssignable(apiBase),
    getActorOrganization(apiBase),
    getKnownEmailsQuery(),
    getGridAreasForCreateActor(),
  ];
}

function getMarketParticipantUserSearchUsers(apiBase: string) {
  return http.post(`${apiBase}/v1/MarketParticipantUserOverview/SearchUsers`, () => {
    return HttpResponse.json(marketParticipantUserSearchUsers);
  });
}

function getMarketParticipantActorQuerySelectionActors(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantActorQuery/GetSelectionActors`, () => {
    return HttpResponse.json(marketParticipantActorQuerySelectionActors);
  });
}

function getMarketParticipantUserRoleGetAssignable(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantUserRole/GetAssignable`, () => {
    return HttpResponse.json(marketParticipantUserRoles);
  });
}

function getActorOrganization(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipant/Organization/GetActorOrganization`, () => {
    return HttpResponse.json(marketParticipantOrganization);
  });
}

function getMarketParticipantUserRoleGetAll(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantUserRole/GetAll`, () => {
    return HttpResponse.json(marketParticipantUserRoleGetAll);
  });
}

function getMarketParticipantUserGetUserAuditLogs(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantUser/GetUserAuditLogs`, () => {
    return HttpResponse.json(marketParticipantUserGetUserAuditLogs);
  });
}

function getMarketParticipantUserRoleGetUserRoleWithPermissions(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MarketParticipantUserRole/GetUserRoleWithPermissions`,
    ({ request }) => {
      const url = new URL(request.url);
      const userRoleId = url.searchParams.get('userRoleId');

      const userRole = marketParticipantUserRoleGetUserRoleWithPermissions.find(
        (userRole) => userRole.id === userRoleId
      );

      return HttpResponse.json(userRole);
    }
  );
}

function getUserRoleAuditLogs() {
  return mockGetUserRoleAuditLogsQuery(async () => {
    await delay(300);
    return HttpResponse.json({ data: getUserRoleAuditLogsMock });
  });
}

function putMarketParticipantUserRoleUpdate(apiBase: string) {
  return http.put(`${apiBase}/v1/MarketParticipantUserRole/Update`, () => {
    return HttpResponse.json(null, { status: 200 });
  });
}

function getMarketParticipantOrganizationGetFilteredActors(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipant/Organization/GetFilteredActors`, () => {
    return HttpResponse.json(marketParticipantOrganizationGetFilteredActors);
  });
}

function getAdminPermissions() {
  return mockGetPermissionsQuery(async () => {
    await delay(300);
    return HttpResponse.json({ data: adminPermissionsMock });
  });
}

function getAdminPermissionDetails() {
  return mockGetPermissionDetailsQuery(async () => {
    await delay(300);
    return HttpResponse.json({ data: adminPermissionDetailsMock });
  });
}

function getAdminPermissionLogs() {
  return mockGetPermissionAuditLogsQuery(async ({ variables }) => {
    const permId = variables.id;
    const permissionAuditLogs = [adminPermissionAuditLogsMock[permId]];
    await delay(300);
    return HttpResponse.json({ data: { __typename: 'Query', permissionAuditLogs } });
  });
}

function putMarketParticipantPermissionsUpdate(apiBase: string) {
  return http.put(`${apiBase}/v1/MarketParticipantPermissions/Update`, () => {
    return HttpResponse.json(null, { status: 200 });
  });
}

function postMarketParticipantUserRoleCreate(apiBase: string) {
  return http.post(`${apiBase}/v1/MarketParticipantUserRole/Create`, () => {
    return HttpResponse.text('', { status: 200 });
  });
}

function putMarketParticipantUserUpdateUserIdentity(apiBase: string) {
  return http.put(`${apiBase}/v1/MarketParticipantUser/UpdateUserIdentity`, () => {
    return HttpResponse.json(null, { status: 200 });
  });
}

function putMarketParticipantUserRoleAssignmentUpdateAssignments(apiBase: string) {
  return http.put(`${apiBase}/v1/MarketParticipantUserRoleAssignment/UpdateAssignments`, () => {
    return HttpResponse.json(null, { status: 200 });
  });
}

function getUserRolesByEicfunctionQuery() {
  return mockGetUserRolesByEicfunctionQuery(async () => {
    await delay(300);
    return HttpResponse.json({ data: getUserRolesByEicfunction });
  });
}

function getKnownEmailsQuery() {
  return mockGetKnownEmailsQuery(async () => {
    await delay(300);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        knownEmails: marketParticipantUserSearchUsers.users.map((x) => x.email),
      },
    });
  });
}

function getGridAreasForCreateActor() {
  return mockGetGridAreasForCreateActorQuery(async () => {
    await delay(300);
    return HttpResponse.json({ data: getGridAreasForCreateActorMock });
  });
}
