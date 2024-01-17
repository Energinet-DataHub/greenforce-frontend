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
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'Active',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: createdAt,
      change: UserAuditedChange.Status,
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'Inactive',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: createdAt,
      change: UserAuditedChange.Status,
    },
    {
      __typename: 'UserAuditedChangeAuditLogDto',
      currentValue: 'InviteExpired',
      previousValue: null,
      isInitialAssignment: false,
      auditedBy: 'Test User',
      timestamp: createdAt,
      change: UserAuditedChange.Status,
    },
  ],
};
