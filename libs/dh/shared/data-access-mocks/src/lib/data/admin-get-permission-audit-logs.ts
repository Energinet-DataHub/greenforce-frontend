import {
  PermissionAuditedChange,
  PermissionAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs } from '@energinet-datahub/watt/date';

export const adminPermissionAuditLogsMock: PermissionAuditedChangeAuditLogDto[] = [
  {
    __typename: 'PermissionAuditedChangeAuditLogDto',
    auditedBy: 'datahub',
    change: PermissionAuditedChange.Claim,
    timestamp: dayjs('2023-03-17').toDate(),
    currentValue: 'val1',
    previousValue: null,
    isInitialAssignment: true,
  },
  {
    __typename: 'PermissionAuditedChangeAuditLogDto',
    auditedBy: 'datahub',
    change: PermissionAuditedChange.Description,
    timestamp: dayjs('2023-03-18').toDate(),
    currentValue: 'val2',
    previousValue: null,
    isInitialAssignment: false,
  },
  {
    __typename: 'PermissionAuditedChangeAuditLogDto',
    auditedBy: 'datahub',
    change: PermissionAuditedChange.Claim,
    timestamp: dayjs('2023-03-17').toDate(),
    currentValue: 'val3',
    previousValue: null,
    isInitialAssignment: false,
  },
];
