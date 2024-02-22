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
  GetUserAuditLogsQuery,
  UserAuditedChange,
} from '@energinet-datahub/dh/shared/domain/graphql';

const createdAt = new Date('2023-01-01T12:00:38.0587304+00:00');
const affectedActorName = 'Test Actor';
const affectedUserRoleName = 'Test Role';

export const marketParticipantUserGetUserAuditLogs: GetUserAuditLogsQuery = {
  __typename: 'Query',
  userAuditLogs: [
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'Adgang til CPR visning',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: new Date('2023-01-03T12:48:38.0587304+00:00'),
      change: UserAuditedChange.UserRoleRemoved,
      affectedActorName,
      affectedUserRoleName,
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'Adgang til CPR visning',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: new Date('2023-01-02T12:47:03.4871748+00:00'),
      change: UserAuditedChange.UserRoleAssigned,
      affectedActorName,
      affectedUserRoleName,
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'Test name',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: createdAt,
      change: UserAuditedChange.InvitedIntoActor,
      affectedActorName,
      affectedUserRoleName,
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'Invited',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: createdAt,
      change: UserAuditedChange.Status,
      affectedActorName: null,
      affectedUserRoleName: null,
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'Active',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: createdAt,
      change: UserAuditedChange.Status,
      affectedActorName: null,
      affectedUserRoleName: null,
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'Inactive',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: createdAt,
      change: UserAuditedChange.Status,
      affectedActorName: null,
      affectedUserRoleName: null,
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'InviteExpired',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: createdAt,
      change: UserAuditedChange.Status,
      affectedActorName: null,
      affectedUserRoleName: null,
    },
  ],
};
