import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  GetActorByIdDocument,
  GetActorsDocument,
  GetAuditLogByActorIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhActor = ResultOf<typeof GetActorsDocument>['actors'][0];
export type DhActorExtended = ResultOf<typeof GetActorByIdDocument>['actorById'];
export type dhActorAuditLogEntry = ResultOf<
  typeof GetAuditLogByActorIdDocument
>['actorAuditLogs'][0];
