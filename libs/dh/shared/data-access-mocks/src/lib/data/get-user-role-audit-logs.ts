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
import parseISO from 'date-fns/parseISO';

import {
  GetUserRoleAuditLogsQuery,
  UserRoleChangeType,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const getUserRoleAuditLogsMock: GetUserRoleAuditLogsQuery = {
  __typename: 'Query',
  userRoleAuditLogs: [
    {
      __typename: 'UserRoleAuditLog',
      changedByUserName: 'Test User 1 (test1@datahub.dk)',
      name: 'Supporter',
      description: null,
      eicFunction: null,
      permissions: [],
      status: UserRoleStatus.Active,
      changeType: UserRoleChangeType.Created,
      timestamp: parseISO('2023-10-04T00:00:00+00:00'),
    },
    {
      __typename: 'UserRoleAuditLog',
      changedByUserName: 'Test User 1 (test1@datahub.dk)',
      name: 'Supporter',
      description: null,
      eicFunction: null,
      permissions: [],
      status: UserRoleStatus.Active,
      changeType: UserRoleChangeType.NameChange,
      timestamp: parseISO('2023-10-04T01:00:00+00:00'),
    },
    {
      __typename: 'UserRoleAuditLog',
      changedByUserName: 'Test User 2 (test2@datahub.dk)',
      name: '',
      eicFunction: null,
      description: 'En beskrivelse',
      permissions: [],
      status: UserRoleStatus.Active,
      changeType: UserRoleChangeType.DescriptionChange,
      timestamp: parseISO('2023-10-04T02:00:00+00:00'),
    },
    {
      __typename: 'UserRoleAuditLog',
      changedByUserName: 'Test User 2 (test2@datahub.dk)',
      name: '',
      description: null,
      eicFunction: null,
      permissions: ['organizations:view', 'organizations:manage', 'users:view', 'users:manage'],
      status: UserRoleStatus.Active,
      changeType: UserRoleChangeType.PermissionAdded,
      timestamp: parseISO('2023-10-04T03:00:00+00:00'),
    },
    {
      __typename: 'UserRoleAuditLog',
      changedByUserName: 'Test User 3 (test3@datahub.dk)',
      name: '',
      description: null,
      eicFunction: null,
      permissions: ['users:view'],
      status: UserRoleStatus.Active,
      changeType: UserRoleChangeType.PermissionRemoved,
      timestamp: parseISO('2023-10-04T04:00:00+00:00'),
    },
    {
      __typename: 'UserRoleAuditLog',
      changedByUserName: 'Test User 3 (test3@datahub.dk)',
      name: '',
      description: null,
      eicFunction: null,
      permissions: [],
      status: UserRoleStatus.Inactive,
      changeType: UserRoleChangeType.StatusChange,
      timestamp: parseISO('2023-10-04T05:00:00+00:00'),
    },
  ],
};
