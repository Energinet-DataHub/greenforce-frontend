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
import { Injectable, inject } from '@angular/core';
import {
  GetActorEditableFieldsDocument,
  GetActorsDocument,
  GetAuditLogByActorIdDocument,
  UpdateActorDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { Apollo } from 'apollo-angular';
import { Subject, switchMap } from 'rxjs';

export interface ActorEditableFields {
  actorId: string;
  actorName: string;
  departmentName: string;
  departmentPhone: string;
  departmentEmail: string;
}

@Injectable()
export class DhMarketParticipantActorsEditActorDataAccessApiStore {
  private readonly apollo = inject(Apollo);
  private readonly getActorEditableFieldsQuery = this.apollo.watchQuery({
    returnPartialData: true,
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorEditableFieldsDocument,
  });

  private isReady$ = new Subject<boolean>();

  readonly actorEditableFields$ = this.isReady$.pipe(
    switchMap(() => this.getActorEditableFieldsQuery.valueChanges)
  );

  load(actorId: string) {
    this.getActorEditableFieldsQuery.refetch({ actorId: actorId });
    this.isReady$.next(true);
    this.isReady$.complete();
  }

  update(actor: ActorEditableFields) {
    return this.apollo.mutate({
      useMutationLoading: true,
      mutation: UpdateActorDocument,
      variables: {
        input: actor,
      },
      refetchQueries: [GetActorsDocument, GetActorEditableFieldsDocument, GetAuditLogByActorIdDocument],
    });
  }
}
