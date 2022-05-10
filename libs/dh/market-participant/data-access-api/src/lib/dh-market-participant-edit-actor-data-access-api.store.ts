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
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  ChangeActorDto,
  MarketParticipantHttp,
  ActorDto,
  CreateActorDto,
  MarketRoleDto,
  MarketParticipantMeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import {
  catchError,
  EMPTY,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseErrorResponse } from './dh-market-participant-error-handling';

export interface ActorChanges {
  gln?: string;
  marketRoles: MarketRoleDto[];
  meteringPointTypes: MarketParticipantMeteringPointType[];
}

export interface MarketParticipantEditActorState {
  isLoading: boolean;

  // Input
  organizationId: string;
  actor?: ActorDto;

  // Changes
  changes: ActorChanges;

  // Validation
  validation?: { error: string };
}

const initialState: MarketParticipantEditActorState = {
  isLoading: false,
  organizationId: '',
  changes: { gln: '', marketRoles: [], meteringPointTypes: [] },
};

@Injectable()
export class DhMarketParticipantEditActorDataAccessApiStore extends ComponentStore<MarketParticipantEditActorState> {
  isLoading$ = this.select((state) => state.isLoading);
  isEditing$ = this.select((state) => state.actor !== undefined);
  actor$ = this.select((state) => state.actor);
  validation$ = this.select((state) => state.validation);
  changes$ = this.select((state) => state.changes);

  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
  }

  readonly getActorAndContacts = this.effect(
    (routeParams$: Observable<{ organizationId: string; actorId: string }>) =>
      // contacts not implemented yet.
      routeParams$.pipe(
        tap(() => this.patchState({ isLoading: true })),
        switchMap((input) => {
          if (!input.actorId) {
            this.patchState({
              isLoading: false,
              organizationId: input.organizationId,
            });
            return EMPTY;
          }
          return this.getActor(input.organizationId, input.actorId).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
              this.patchState({
                validation: {
                  error: parseErrorResponse(errorResponse),
                },
              });
              return EMPTY;
            })
          );
        }),
        tap(() => this.patchState({ isLoading: false }))
      )
  );

  readonly save = this.effect((onSaveCompletedFn$: Observable<() => void>) =>
    onSaveCompletedFn$.pipe(
      tap(() => this.patchState({ isLoading: true, validation: undefined })),
      withLatestFrom(this.state$),
      switchMap(([onSaveCompletedFn, state]) =>
        of(state).pipe(
          switchMap(() => this.saveActor(state)),
          tapResponse(
            () => {
              this.patchState({
                isLoading: false,
              });
              onSaveCompletedFn();
            },
            (errorResponse: HttpErrorResponse) => {
              this.patchState({
                isLoading: false,
                validation: {
                  error: parseErrorResponse(errorResponse),
                },
              });
            }
          )
        )
      )
    )
  );

  private readonly saveActor = (state: MarketParticipantEditActorState) => {
    if (state.actor !== undefined) {
      return this.httpClient.v1MarketParticipantOrganizationOrgIdActorActorIdPut(
        state.organizationId,
        state.actor.actorId,
        state.changes as ChangeActorDto
      );
    }

    return this.httpClient.v1MarketParticipantOrganizationOrgIdActorPost(
      state.organizationId,
      {
        ...state.changes,
        gln: { value: state.changes.gln },
      } as CreateActorDto
    );
  };

  private readonly getActor = (organizationId: string, actorId: string) =>
    this.httpClient
      .v1MarketParticipantOrganizationOrgIdActorActorIdGet(
        organizationId,
        actorId
      )
      .pipe(
        tap((actor) =>
          this.patchState({
            organizationId,
            actor,
          })
        )
      );

  readonly setMasterDataChanges = (changes: ActorChanges) =>
    this.patchState({
      changes,
    });
}
