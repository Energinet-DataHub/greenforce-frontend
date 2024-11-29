import {
  ActorAuditedChange,
  GetAuditLogByActorIdQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const getActorAuditLogsMock: GetAuditLogByActorIdQuery = {
  __typename: 'Query',
  actorAuditLogs: [
    {
      __typename: 'ActorAuditedChangeAuditLogDto',
      auditedBy: 'John Doe',
      currentValue: 'Aktørnavn2',
      previousValue: 'Aktørnavn',
      change: ActorAuditedChange.Name,
      isInitialAssignment: false,
      timestamp: new Date('2021-08-14T12:30:01'),
    },
    {
      __typename: 'ActorAuditedChangeAuditLogDto',
      auditedBy: 'John Doe',
      currentValue: 'Active',
      previousValue: 'InActive',
      change: ActorAuditedChange.Status,
      isInitialAssignment: false,
      timestamp: new Date('2021-08-14T12:30:02'),
    },
    {
      __typename: 'ActorAuditedChangeAuditLogDto',
      auditedBy: 'John Doe',
      currentValue: 'MyAndMe',
      previousValue: 'MeAndMy',
      change: ActorAuditedChange.ContactName,
      isInitialAssignment: false,
      timestamp: new Date('2021-08-14T12:32:04'),
    },
    {
      __typename: 'ActorAuditedChangeAuditLogDto',
      auditedBy: 'John Doe',
      currentValue: 'Aktør kontakt 2',
      previousValue: 'Aktør kontakt 1',
      change: ActorAuditedChange.ContactName,
      isInitialAssignment: false,
      timestamp: new Date('2021-08-14T12:32:06'),
    },
    {
      __typename: 'ActorAuditedChangeAuditLogDto',
      auditedBy: 'John Doe',
      currentValue: '(efad0fee-9d7c-49c6-7c16-08da5f28ddb1;2024-03-01;1;RequestWholesaleResults)',
      previousValue: null,
      change: ActorAuditedChange.DelegationStart,
      isInitialAssignment: false,
      timestamp: new Date('2024-02-01T12:32:06'),
    },
    {
      __typename: 'ActorAuditedChangeAuditLogDto',
      auditedBy: 'Jane Doe',
      currentValue:
        '(efad0fee-9d7c-49c6-7c16-08da5f28ddb1;2024-03-01;1;RequestWholesaleResults;2024-04-01)',
      previousValue: null,
      change: ActorAuditedChange.DelegationStop,
      isInitialAssignment: false,
      timestamp: new Date('2024-03-15T12:32:06'),
    },
  ],
};
