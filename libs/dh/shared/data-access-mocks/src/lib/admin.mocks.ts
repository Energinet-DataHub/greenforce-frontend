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
import { delay, http, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import {
  mockGetKnownEmailsQuery,
  mockGetPermissionDetailsQuery,
  mockGetPermissionAuditLogsQuery,
  mockGetUserRoleAuditLogsQuery,
  mockGetUserRolesByEicfunctionQuery,
  mockGetUserAuditLogsQuery,
  mockGetUserRolesByActorIdQuery,
  mockGetUserRoleWithPermissionsQuery,
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
  mockDeactivateUserRoleMutation,
  mockGetUsersQuery,
  mockGetUserDetailsQuery,
  mockGetActorsAndUserRolesQuery,
  mockGetFilteredUserRolesQuery,
  mockGetFilteredPermissionsQuery,
  mockGetUserEditQuery,
  mockGetPermissionEditQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { actorQuerySelection } from './data/market-participant-actor-query-selection-actors';
import { marketParticipantUserGetUserAuditLogs } from './data/market-participant-user-get-user-audit-logs';
import { marketParticipantUserRoleGetUserRoleWithPermissions } from './data/market-participant-user-role-get-user-role-with-permissions';
import { getUserRoleAuditLogsMock } from './data/get-user-role-audit-logs';
import { filteredPermissionsMock } from './data/admin/permissions';
import { adminPermissionAuditLogsMock } from './data/admin-get-permission-audit-logs';
import { adminPermissionDetailsMock } from './data/admin-get-permission-details';
import { marketParticipantUserRoles } from './data/admin-get-market-participant-user-roles';
import { getUserRolesByEicfunctionQuery } from './data/get-user-roles-by-eicfunction';
import { filteredActors } from './data/market-participant-filtered-actors';
import { users } from './data/admin/users';
import { userRoles } from './data/admin/user-roles';

export function adminMocks(apiBase: string) {
  return [
    mockGetSelectionActors(),
    getMarketParticipantUserGetUserAuditLogs(),
    getFilteredPermissions(apiBase),
    getPermissions(apiBase),
    getAdminPermissionLogs(),
    getAdminPermissionDetails(),
    getKnownEmailsQuery(),
    getUserDetailsQuery(),
    updateUserAndRoles(),
    updatePermission(),
    getFilteredActors(),
    deactivedUser(),
    reActivedUser(),
    reInviteUser(),
    reset2fa(),
    updateUserRole(),
    getUserRoleAuditLogs(),
    getUserRolesByEicfunction(),
    createUserRole(),
    getUserRolesByActorId(),
    deactivateUserRole(),
    getUsersQuery(),
    getActorsAndUserRolesQuery(),
    getFilteredUserRolesQuery(),
    getUserRoleWithPermissionsQuery(),
    getUserEditQuery(),
    getPermissionEditQuery(apiBase),
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

function getUserRolesByActorId() {
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

function getFilteredUserRolesQuery() {
  return mockGetFilteredUserRolesQuery(async ({ variables }) => {
    const roles = userRoles
      .filter((x) => x.status === variables.status)
      .filter((x) =>
        (variables.eicFunctions?.length ?? 0) > 0
          ? variables.eicFunctions?.includes(x.eicFunction)
          : true
      );
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        filteredUserRoles: {
          __typename: 'FilteredUserRolesConnection',
          pageInfo: { __typename: 'PageInfo', startCursor: 'startCurser', endCursor: 'endCursor' },
          totalCount: roles.length,
          nodes: roles,
        },
      },
    });
  });
}

function getMarketParticipantUserGetUserAuditLogs() {
  return mockGetUserAuditLogsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: marketParticipantUserGetUserAuditLogs });
  });
}

function getUserRoleAuditLogs() {
  return mockGetUserRoleAuditLogsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: getUserRoleAuditLogsMock });
  });
}

function getActorsAndUserRolesQuery() {
  return mockGetActorsAndUserRolesQuery(async ({ variables }) => {
    const userId = variables.id;
    const user = users.find((user) => user.id === userId);
    await delay(mswConfig.delay);
    if (user) {
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          userById: {
            __typename: 'GetUserResponse',
            actors: user?.actors,
            id: user?.id,
            administratedBy: user?.administratedBy,
          },
        },
      });
    }
    return HttpResponse.json(null, { status: 404 });
  });
}

function getUserDetailsQuery() {
  return mockGetUserDetailsQuery(async ({ variables }) => {
    const userId = variables.id;
    await delay(mswConfig.delay);

    const user = users.find((user) => user.id === userId);

    if (user) {
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          userById: {
            __typename: 'GetUserResponse',
            email: user.email,
            name: user.name,
            id: user.id,
            status: user.status,
            phoneNumber: user.phoneNumber,
          },
        },
      });
    }

    return HttpResponse.json(null, { status: 404 });
  });
}

function updateUserRole() {
  return mockUpdateUserRoleMutation(async () => {
    const maybeErrorState = self.crypto.getRandomValues(new Uint32Array(1))[0] % 2 === 0;

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

function getFilteredPermissions(apiBase: string) {
  return mockGetFilteredPermissionsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: filteredPermissionsMock(apiBase) });
  });
}

const base64Document =
  'PEFnZ3JlZ2F0ZWRQcm9kdWN0aW9uUGVyTUdBRm9yU2V0dGxlbWVudEZvclNldHRsZW1lbnRSZXNwb25zaWJsZSB4bWxucz0idW46dW5lY2U6MjYwOmRhdGE6RUVNLUFnZ3JlZ2F0ZWRQcm9kdWN0aW9uUGVyTUdBRm9yU2V0dGxlbWVudEZvclNldHRsZW1lbnRSZXNwb25zaWJsZSI+CiAgPEhlYWRlcj4KICAgIDxJZGVudGlmaWNhdGlvbj4zNEI3RTQ0NDM1MTI0NkE4QjRDNzlBMEE3NTgzMDg5Qy0wPC9JZGVudGlmaWNhdGlvbj4KICAgIDxEb2N1bWVudFR5cGUgbGlzdEFnZW5jeUlkZW50aWZpZXI9IjI2MCI+RTMxPC9Eb2N1bWVudFR5cGU+CiAgICA8Q3JlYXRpb24+MjAyMy0wNi0xOVQyMDozNDoyMlo8L0NyZWF0aW9uPgogICAgPFNlbmRlckVuZXJneVBhcnR5PgogICAgICA8SWRlbnRpZmljYXRpb24gc2NoZW1lQWdlbmN5SWRlbnRpZmllcj0iOSI+NTc5MDAwMTMzMDU1MjwvSWRlbnRpZmljYXRpb24+CiAgICA8L1NlbmRlckVuZXJneVBhcnR5PgogICAgPFJlY2lwaWVudEVuZXJneVBhcnR5PgogICAgICA8SWRlbnRpZmljYXRpb24gc2NoZW1lQWdlbmN5SWRlbnRpZmllcj0iMzA1Ij40NFgtMDAwMDAwMDAwMDRCPC9JZGVudGlmaWNhdGlvbj4KICAgIDwvUmVjaXBpZW50RW5lcmd5UGFydHk+CiAgPC9IZWFkZXI+CiAgPFByb2Nlc3NFbmVyZ3lDb250ZXh0PgogICAgPEVuZXJneUJ1c2luZXNzUHJvY2VzcyBsaXN0QWdlbmN5SWRlbnRpZmllcj0iMjYwIj5FNDQ8L0VuZXJneUJ1c2luZXNzUHJvY2Vzcz4KICAgIDxFbmVyZ3lCdXNpbmVzc1Byb2Nlc3NSb2xlIGxpc3RBZ2VuY3lJZGVudGlmaWVyPSIzMzAiPkREWDwvRW5lcmd5QnVzaW5lc3NQcm9jZXNzUm9sZT4KICAgIDxFbmVyZ3lJbmR1c3RyeUNsYXNzaWZpY2F0aW9uIGxpc3RBZ2VuY3lJZGVudGlmaWVyPSIzMzAiPjIzPC9FbmVyZ3lJbmR1c3RyeUNsYXNzaWZpY2F0aW9uPgogIDwvUHJvY2Vzc0VuZXJneUNvbnRleHQ+CiAgPFBheWxvYWRFbmVyZ3lUaW1lU2VyaWVzPgogICAgPElkZW50aWZpY2F0aW9uPjIyMzc4ODI2NTk3XzIzNzc5MzIwMDgyPC9JZGVudGlmaWNhdGlvbj4KICAgIDxSZWdpc3RyYXRpb25EYXRlVGltZT4yMDIzLTA2LTE5VDIwOjM0OjIyWjwvUmVnaXN0cmF0aW9uRGF0ZVRpbWU+CiAgICA8T2JzZXJ2YXRpb25QZXJpb2RUaW1lU2VyaWVzUGVyaW9kPgogICAgICA8UmVzb2x1dGlvbkR1cmF0aW9uPlBUMTVNPC9SZXNvbHV0aW9uRHVyYXRpb24+CiAgICAgIDxTdGFydD4yMDIzLTA2LTA2VDIyOjAwOjAwWjwvU3RhcnQ+CiAgICAgIDxFbmQ+MjAyMy0wNi0wN1QyMjowMDowMFo8L0VuZD4KICAgIDwvT2JzZXJ2YXRpb25QZXJpb2RUaW1lU2VyaWVzUGVyaW9kPgogICAgPEJhbGFuY2VTdXBwbGllckludm9sdmVkRW5lcmd5UGFydHk+CiAgICAgIDxJZGVudGlmaWNhdGlvbiBzY2hlbWVBZ2VuY3lJZGVudGlmaWVyPSI5Ij41NzkwMDAyNDE2OTI3PC9JZGVudGlmaWNhdGlvbj4KICAgIDwvQmFsYW5jZVN1cHBsaWVySW52b2x2ZWRFbmVyZ3lQYXJ0eT4KICAgIDxQcm9kdWN0SW5jbHVkZWRQcm9kdWN0Q2hhcmFjdGVyaXN0aWM+CiAgICAgIDxJZGVudGlmaWNhdGlvbiBzY2hlbWVBZ2VuY3lJZGVudGlmaWVyPSI5Ij44NzE2ODY3MDAwMDMwPC9JZGVudGlmaWNhdGlvbj4KICAgICAgPFVuaXRUeXBlIGxpc3RBZ2VuY3lJZGVudGlmaWVyPSIzMzAiPktXSDwvVW5pdFR5cGU+CiAgICA8L1Byb2R1Y3RJbmNsdWRlZFByb2R1Y3RDaGFyYWN0ZXJpc3RpYz4KICAgIDxNUERldGFpbE1lYXN1cmVtZW50TWV0ZXJpbmdQb2ludENoYXJhY3RlcmlzdGljPgogICAgICA8TWV0ZXJpbmdQb2ludFR5cGUgbGlzdEFnZW5jeUlkZW50aWZpZXI9IjI2MCI+RTE4PC9NZXRlcmluZ1BvaW50VHlwZT4KICAgICAgPFNldHRsZW1lbnRNZXRob2RUeXBlIGxpc3RBZ2VuY3lJZGVudGlmaWVyPSIyNjAiPkUwMjwvU2V0dGxlbWVudE1ldGhvZFR5cGU+CiAgICAgIDxCdXNpbmVzc1R5cGUgbGlzdEFnZW5jeUlkZW50aWZpZXI9IjMzMCI+QTAxPC9CdXNpbmVzc1R5cGU+CiAgICAgIDxBc3NldFR5cGUgbGlzdEFnZW5jeUlkZW50aWZpZXI9IjMzMCI+QjIwPC9Bc3NldFR5cGU+CiAgICAgIDxQcm9kdWN0aW9uVHlwZSBsaXN0QWdlbmN5SWRlbnRpZmllcj0iMzMwIj5aMDE8L1Byb2R1Y3Rpb25UeXBlPgogICAgPC9NUERldGFpbE1lYXN1cmVtZW50TWV0ZXJpbmdQb2ludENoYXJhY3RlcmlzdGljPgogICAgPE1ldGVyaW5nR3JpZEFyZWFVc2VkRG9tYWluTG9jYXRpb24+CiAgICAgIDxJZGVudGlmaWNhdGlvbiBzY2hlbWVJZGVudGlmaWVyPSJESyIgc2NoZW1lQWdlbmN5SWRlbnRpZmllcj0iMjYwIj4zODQ8L0lkZW50aWZpY2F0aW9uPgogICAgPC9NZXRlcmluZ0dyaWRBcmVhVXNlZERvbWFpbkxvY2F0aW9uPgogICAgPE9ic2VydmF0aW9uSW50ZXJ2YWxPYnNlcnZhdGlvblBlcmlvZD4KICAgICAgPFNlcXVlbmNlPjE8L1NlcXVlbmNlPgogICAgICA8T2JzZXJ2YXRpb25EZXRhaWxFbmVyZ3lPYnNlcnZhdGlvbj4KICAgICAgICA8RW5lcmd5UXVhbnRpdHk+MC4wMTwvRW5lcmd5UXVhbnRpdHk+CiAgICAgIDwvT2JzZXJ2YXRpb25EZXRhaWxFbmVyZ3lPYnNlcnZhdGlvbj4KICAgIDwvT2JzZXJ2YXRpb25JbnRlcnZhbE9ic2VydmF0aW9uUGVyaW9kPgogICAgPE9ic2VydmF0aW9uSW50ZXJ2YWxPYnNlcnZhdGlvblBlcmlvZD4KICAgICAgPFNlcXVlbmNlPjI8L1NlcXVlbmNlPgogICAgICA8T2JzZXJ2YXRpb25EZXRhaWxFbmVyZ3lPYnNlcnZhdGlvbj4KICAgICAgICA8RW5lcmd5UXVhbnRpdHk+MC4wMDE8L0VuZXJneVF1YW50aXR5PgogICAgICA8L09ic2VydmF0aW9uRGV0YWlsRW5lcmd5T2JzZXJ2YXRpb24+CiAgICA8L09ic2VydmF0aW9uSW50ZXJ2YWxPYnNlcnZhdGlvblBlcmlvZD4KICA8L1BheWxvYWRFbmVyZ3lUaW1lU2VyaWVzPgo8L0FnZ3JlZ2F0ZWRQcm9kdWN0aW9uUGVyTUdBRm9yU2V0dGxlbWVudEZvclNldHRsZW1lbnRSZXNwb25zaWJsZT4=';

function getPermissions(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MarketParticipantPermissions/GetPermissionRelationsCSV`,
    async () => {
      await delay(mswConfig.delay);
      return HttpResponse.arrayBuffer(
        Uint8Array.from(atob(base64Document), (c) => c.charCodeAt(0)).buffer
      );
    }
  );
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

function createUserRole() {
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

function getPermissionEditQuery(apiBase: string) {
  return mockGetPermissionEditQuery(async ({ variables }) => {
    const permission = filteredPermissionsMock(apiBase).filteredPermissions?.nodes?.find(
      (x) => x.id === variables.id
    );
    await delay(mswConfig.delay);
    if (permission) {
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          permissionById: {
            __typename: 'Permission',
            id: permission.id,
            description: permission.description,
            name: permission.name,
          },
        },
      });
    }
    return HttpResponse.json(null, { status: 404 });
  });
}

function updatePermission() {
  return mockUpdatePermissionMutation(async ({ variables }) => {
    const { id } = variables.input;
    await delay(mswConfig.delay);

    const error = maybeError();

    if (error) {
      return HttpResponse.json({
        data: {
          __typename: 'Mutation',
          updatePermission: {
            errors: error,
            __typename: 'UpdatePermissionPayload',
            permission: null,
          },
        },
      });
    }

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

function getUserRolesByEicfunction() {
  return mockGetUserRolesByEicfunctionQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({ data: getUserRolesByEicfunctionQuery });
  });
}

function deactivateUserRole() {
  return mockDeactivateUserRoleMutation(async () => {
    await delay(mswConfig.delay);
    const errors = maybeError();

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        deactivateUserRole: {
          __typename: 'DeactivateUserRolePayload',
          success: errors === null,
          errors,
        },
      },
    });
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

function getUserEditQuery() {
  return mockGetUserEditQuery(async ({ variables }) => {
    const user = users.find((user) => user.id === variables.id);
    await delay(mswConfig.delay);
    if (!user) return HttpResponse.json(null, { status: 404 });
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        userById: {
          __typename: 'GetUserResponse',
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      },
    });
  });
}

function getUsersQuery() {
  return mockGetUsersQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        users: {
          __typename: 'UsersCollectionSegment',
          items: users,
          pageInfo: {
            __typename: 'CollectionSegmentInfo',
            hasNextPage: true,
            hasPreviousPage: false,
          },
          totalCount: users.length,
        },
      },
    });
  });
}
