import { Injectable } from '@angular/core';

import { GetAuditLogByActorIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

@Injectable()
export class DhActorAuditLogService {
  public auditLogQuery = lazyQuery(GetAuditLogByActorIdDocument);

  public refreshAuditLog(actorId: string): void {
    this.auditLogQuery.refetch({ actorId });
  }
}
