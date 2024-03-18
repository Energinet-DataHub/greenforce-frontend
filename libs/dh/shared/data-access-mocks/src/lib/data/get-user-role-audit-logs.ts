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
import { dayjs } from '@energinet-datahub/watt/utils/date';

import {
  GetUserRoleAuditLogsQuery,
  UserRoleAuditedChange,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const getUserRoleAuditLogsMock: GetUserRoleAuditLogsQuery = {
  __typename: 'Query',
  userRoleAuditLogs: [
    {
      __typename: 'UserRoleAuditedChangeAuditLogDto',
      auditedBy: 'Test User 1 (test1@datahub.dk)',
      currentValue: 'Supporter',
      previousValue: null,
      isInitialAssignment: true,
      change: UserRoleAuditedChange.Name,
      timestamp: dayjs('2023-10-04T01:00:00+00:00').toDate(),
      affectedPermissionName: null,
    },
    {
      __typename: 'UserRoleAuditedChangeAuditLogDto',
      auditedBy: 'Test User 2 (test2@datahub.dk)',
      currentValue: 'En beskrivelse',
      previousValue: null,
      isInitialAssignment: true,
      change: UserRoleAuditedChange.Description,
      timestamp: dayjs('2023-10-04T02:00:00+00:00').toDate(),
      affectedPermissionName: null,
    },
    {
      __typename: 'UserRoleAuditedChangeAuditLogDto',
      auditedBy: 'Test User 2 (test2@datahub.dk)',
      currentValue: 'organizations:view',
      affectedPermissionName: 'organizations:view',
      previousValue: null,
      isInitialAssignment: true,
      change: UserRoleAuditedChange.PermissionAdded,
      timestamp: dayjs('2023-10-04T03:00:00+00:00').toDate(),
    },
    {
      __typename: 'UserRoleAuditedChangeAuditLogDto',
      auditedBy: 'Test User 3 (test3@datahub.dk)',
      currentValue: 'users:view',
      affectedPermissionName: 'users:view',
      previousValue: null,
      isInitialAssignment: true,
      change: UserRoleAuditedChange.PermissionRemoved,
      timestamp: dayjs('2023-10-04T04:00:00+00:00').toDate(),
    },
    {
      __typename: 'UserRoleAuditedChangeAuditLogDto',
      auditedBy: 'Test User 3 (test3@datahub.dk)',
      currentValue: 'Inactive',
      previousValue: 'Active',
      isInitialAssignment: true,
      affectedPermissionName: null,
      change: UserRoleAuditedChange.Status,
      timestamp: dayjs('2023-10-04T05:00:00+00:00').toDate(),
    },
  ],
};
