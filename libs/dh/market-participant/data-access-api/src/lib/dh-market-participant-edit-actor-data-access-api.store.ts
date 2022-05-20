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
  MarketParticipantHttp,
  ActorDto,
  MarketRoleDto,
  MarketParticipantMeteringPointType,
  ActorStatus,
  GridAreaDto,
  MarketParticipantGridAreaHttp,
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
  gln: string;
  status: ActorStatus;
}

export interface MeteringPointTypeChanges {
  meteringPointTypes: MarketParticipantMeteringPointType[];
}

export interface GridAreaChanges {
  gridAreas: GridAreaDto[];
}

export interface MarketRoleChanges {
  marketRoles: MarketRoleDto[];
}

export interface MarketParticipantEditActorState {
  isLoadingActor: boolean;
  isLoadingGridAreas: boolean;

  // Input
  organizationId: string;
  actor?: ActorDto;
  gridAreas: GridAreaDto[];

  // Changes
  changes: ActorChanges;

  meteringPointTypeChanges: MeteringPointTypeChanges;
  gridAreaChanges: GridAreaChanges;
  marketRoleChanges: MarketRoleChanges;

  // Validation
  validation?: { error: string };
}

const initialState: MarketParticipantEditActorState = {
  isLoadingActor: false,
  isLoadingGridAreas: false,
  organizationId: '',
  gridAreas: [],
  changes: {
    gln: '',
    status: ActorStatus.New,
  },
  meteringPointTypeChanges: { meteringPointTypes: [] },
  gridAreaChanges: { gridAreas: [] },
  marketRoleChanges: { marketRoles: [] },
};

@Injectable()
export class DhMarketParticipantEditActorDataAccessApiStore extends ComponentStore<MarketParticipantEditActorState> {
  isLoading$ = this.select(
    (state) => state.isLoadingActor || state.isLoadingGridAreas
  );
  isEditing$ = this.select((state) => state.actor !== undefined);
  actor$ = this.select((state) => state.actor);
  validation$ = this.select((state) => state.validation);
  changes$ = this.select((state) => state.changes);
  gridAreas$ = this.select((state) => state.gridAreas);

  constructor(
    private httpClient: MarketParticipantHttp,
    private gridAreaHttpClient: MarketParticipantGridAreaHttp
  ) {
    super(initialState);
  }

  readonly getGridAreas = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoadingGridAreas: true })),
      switchMap(() =>
        this.gridAreaHttpClient
          .v1MarketParticipantGridAreaGet()
          .pipe(
            tap((gridAreas) =>
              this.patchState({
                gridAreas: gridAreas.sort((a, b) =>
                  a.code.localeCompare(b.code)
                ),
              })
            )
          )
          .pipe(catchError(this.handleError))
      ),
      tap(() => this.patchState({ isLoadingGridAreas: false }))
    )
  );

  readonly getActorAndContacts = this.effect(
    (routeParams$: Observable<{ organizationId: string; actorId: string }>) =>
      // contacts not implemented yet.
      routeParams$.pipe(
        tap(() => this.patchState({ isLoadingActor: true })),
        switchMap((routeParams) => {
          if (!routeParams.actorId) {
            this.patchState({
              isLoadingActor: false,
              organizationId: routeParams.organizationId,
            });
            return EMPTY;
          }
          return this.getActor(
            routeParams.organizationId,
            routeParams.actorId
          ).pipe(catchError(this.handleError));
        }),
        tap(() => this.patchState({ isLoadingActor: false }))
      )
  );

  readonly save = this.effect((onSaveCompletedFn$: Observable<() => void>) =>
    onSaveCompletedFn$.pipe(
      tap(() =>
        this.patchState({ isLoadingActor: true, validation: undefined })
      ),
      withLatestFrom(this.state$),
      switchMap(([onSaveCompletedFn, state]) =>
        of(state).pipe(
          switchMap(() => this.saveActor(state)),
          tapResponse(
            () => {
              this.patchState({
                isLoadingActor: false,
              });
              onSaveCompletedFn();
            },
            (errorResponse: HttpErrorResponse) => {
              this.patchState({
                isLoadingActor: false,
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

  readonly handleError = (errorResponse: HttpErrorResponse) => {
    this.patchState({
      validation: {
        error: parseErrorResponse(errorResponse),
      },
    });
    return EMPTY;
  };

  private readonly saveActor = (state: MarketParticipantEditActorState) => {
    if (state.actor !== undefined) {
      return this.httpClient.v1MarketParticipantOrganizationOrgIdActorActorIdPut(
        state.organizationId,
        state.actor.actorId,
        {
          marketRoles: state.marketRoleChanges.marketRoles,
          meteringPointTypes: state.meteringPointTypeChanges.meteringPointTypes,
          status: state.changes.status,
          gridAreas: state.gridAreaChanges.gridAreas.map((x) => x.id),
        }
      );
    }

    return this.httpClient.v1MarketParticipantOrganizationOrgIdActorPost(
      state.organizationId,
      {
        gln: { value: state.changes.gln },
        marketRoles: state.marketRoleChanges.marketRoles,
        meteringPointTypes: state.meteringPointTypeChanges.meteringPointTypes,
        gridAreas: state.gridAreaChanges.gridAreas.map((x) => x.id),
      }
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

  readonly setMeteringPoinTypeChanges = (
    meteringPointTypeChanges: MeteringPointTypeChanges
  ) =>
    this.patchState({
      meteringPointTypeChanges,
    });

  readonly setGridAreaChanges = (gridAreaChanges: GridAreaChanges) =>
    this.patchState({
      gridAreaChanges,
    });

  readonly setMarketRoleChanges = (marketRoleChanges: MarketRoleChanges) =>
    this.patchState({
      marketRoleChanges,
    });
}
