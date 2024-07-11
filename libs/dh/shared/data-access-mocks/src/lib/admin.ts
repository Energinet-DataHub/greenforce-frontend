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
  User,
  mockUpdateUserAndRolesMutation,
  mockUpdateUserRoleMutation,
  mockUpdatePermissionMutation,
  mockGetFilteredActorsQuery,
  mockCreateUserRoleMutation,
  mockDeactivateUserMutation,
  mockReActivateUserMutation,
  mockReInviteUserMutation,
  mockReset2faMutation,
  mockGetSelectionActorsQuery,
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
import { getUserRolesByEicfunction } from './data/get-user-roles-by-eicfunction';
import { filteredActors } from './data/market-participant-filtered-actors';
import { getGridAreas } from './data/get-grid-areas';
import { overviewUsers } from './data/admin/user-overview-items';

export function adminMocks(apiBase: string) {
  return [
    mockGetSelectionActors(),
    getMarketParticipantUserRoleGetAll(apiBase),
    getMarketParticipantUserGetUserAuditLogs(),
    getUserRoleWithPermissionsQuery(),
    updateUserRoleMutation(),
    getAdminPermissions(),
    getAdminPermissionLogs(),
    getAdminPermissionDetails(),
    getUserRoleAuditLogs(),
    getUserRolesByEicfunctionQuery(),
    mockCreateUserRole(),
    getUserRolesByActorIdQuery(),
    getKnownEmailsQuery(),
    getGridAreasQuery(),
    getUserOverviewQuery(),
    getUserByIdQuery(),
    updateUserAndRoles(),
    updatePermission(),
    getFilteredActors(),
    deactivedUser(),
    reActivedUser(),
    reInviteUser(),
    reset2fa(),
  ];
}

function maybeError() {
  const maybeErrorState = self.crypto.getRandomValues(new Uint32Array(1))[0] % 2 === 0;

  if (!maybeErrorState) return null;

  return [
    {
      message: 'mock error',
      statusCode: 400,
      apiErrors: [
        {
          __typename: 'ApiErrorDescriptor' as const,
          message: 'error message',
          code: 'market_participant.validation.error',
          args: {},
        },
      ],
      __typename: 'ApiError' as const,
    },
  ];
}

function reset2fa() {
  return mockReset2faMutation(async () => {
    await delay(mswConfig.delay);
    const errors = maybeError();
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        resetTwoFactorAuthentication: {
          __typename: 'ResetTwoFactorAuthenticationPayload',
          success: errors === null,
          errors,
        },
      },
    });
  });
}

function deactivedUser() {
  return mockDeactivateUserMutation(async () => {
    await delay(mswConfig.delay);
    const errors = maybeError();

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        deactivateUser: {
          __typename: 'DeactivateUserPayload',
          success: errors === null,
          errors,
        },
      },
    });
  });
}

function reActivedUser() {
  return mockReActivateUserMutation(async () => {
    await delay(mswConfig.delay);
    const errors = maybeError();

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        reActivateUser: {
          __typename: 'ReActivateUserPayload',
          success: errors === null,
          errors,
        },
      },
    });
  });
}

function reInviteUser() {
  return mockReInviteUserMutation(async () => {
    await delay(mswConfig.delay);
    const errors = maybeError();
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        reInviteUser: {
          __typename: 'ReInviteUserPayload',
          success: errors === null,
          errors,
        },
      },
    });
  });
}

function mockGetSelectionActors() {
  return mockGetSelectionActorsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: actorQuerySelection });
  });
}

function getFilteredActors() {
  return mockGetFilteredActorsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: { __typename: 'Query', filteredActors } });
  });
}

function getUserRolesByActorIdQuery() {
  return mockGetUserRolesByActorIdQuery(async ({ variables }) => {
    await delay(mswConfig.delay);
    const [, second] = filteredActors;
    if (second.id === variables.actorId) {
      return HttpResponse.json({
        data: null,
        errors: [
          { message: 'Actor not found', path: ['actorId'], extensions: { code: 'NOT_FOUND' } },
        ],
      });
    }
    return HttpResponse.json({ data: marketParticipantUserRoles });
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

    const user = overviewUsers.find((user) => user.id === userId) as User | undefined;

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

function updateUserRoleMutation() {
  return mockUpdateUserRoleMutation(async ({ variables }) => {
    const maybeErrorState = variables.input.userRoleId === marketParticipantUserRoleGetAll[1].id;

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        updateUserRole: {
          __typename: 'UpdateUserRolePayload',
          success: !maybeErrorState,
          errors: maybeErrorState
            ? [
                {
                  message: 'mock error',
                  statusCode: 400,
                  apiErrors: [
                    {
                      __typename: 'ApiErrorDescriptor',
                      message: 'error message',
                      code: 'market_participant.validation.market_role.reserved',
                      args: {},
                    },
                  ],
                  __typename: 'ApiError',
                },
              ]
            : null,
        },
      },
    });
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

function mockCreateUserRole() {
  return mockCreateUserRoleMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        createUserRole: {
          __typename: 'CreateUserRolePayload',
          success: true,
          errors: null,
        },
      },
    });
  });
}

function updatePermission() {
  return mockUpdatePermissionMutation(async ({ variables }) => {
    const { id } = variables.input;
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
