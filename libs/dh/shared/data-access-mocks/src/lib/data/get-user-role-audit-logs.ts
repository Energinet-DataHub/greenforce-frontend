import { dayjs } from '@energinet-datahub/watt/date';

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
