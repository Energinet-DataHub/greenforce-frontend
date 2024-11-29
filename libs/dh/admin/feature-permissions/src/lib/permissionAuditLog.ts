import type { ResultOf } from '@graphql-typed-document-node/core';

import { GetPermissionLogsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type PermissionAuditLog = ResultOf<typeof GetPermissionLogsDocument>['permissionLogs'][0];
