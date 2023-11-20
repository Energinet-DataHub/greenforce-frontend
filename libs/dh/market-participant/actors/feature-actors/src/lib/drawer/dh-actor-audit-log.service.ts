import { Injectable, inject } from '@angular/core';
import { GetAuditLogByActorIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { Apollo } from 'apollo-angular';

@Injectable()
export class DhActorAuditLogService {
  private readonly apollo = inject(Apollo);

  public getActorAuditLogByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetAuditLogByActorIdDocument,
  });

  public refreshAuditLog(actorId: string): void {
    this.getActorAuditLogByIdQuery$.refetch({
      actorId,
    });
  }
}
