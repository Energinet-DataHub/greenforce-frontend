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
  forkJoin,
  map,
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

export interface MarketParticipantEditActorState {
  isLoading: boolean;

  // Input
  organizationId: string;
  actor?: ActorDto;
  gridAreas: GridAreaDto[];

  // Changes
  changes: ActorChanges;

  meteringPointTypeChanges: MeteringPointTypeChanges;
  gridAreaChanges: GridAreaDto[];
  marketRoles: MarketRoleDto[];

  // Validation
  validation?: { error: string };
}

const initialState: MarketParticipantEditActorState = {
  isLoading: false,
  organizationId: '',
  gridAreas: [],
  changes: {
    gln: '',
    status: ActorStatus.New,
  },
  marketRoles: [],
  meteringPointTypeChanges: { meteringPointTypes: [] },
  gridAreaChanges: [],
};

@Injectable()
export class DhMarketParticipantEditActorDataAccessApiStore extends ComponentStore<MarketParticipantEditActorState> {
  isLoading$ = this.select((state) => state.isLoading);
  isEditing$ = this.select((state) => state.actor !== undefined);
  actor$ = this.select((state) => state.actor);
  validation$ = this.select((state) => state.validation);
  changes$ = this.select((state) => state.changes);
  gridAreas$ = this.select((state) => state.gridAreas);
  selectedGridAreas$ = this.select((state) => state.gridAreaChanges);
  marketRolesEicFunctions$ = this.select((state) => state.marketRoles).pipe(
    map((marketRoles) =>
      marketRoles.map((marketRole) => marketRole.eicFunction)
    )
  );

  constructor(
    private httpClient: MarketParticipantHttp,
    private gridAreaHttpClient: MarketParticipantGridAreaHttp
  ) {
    super(initialState);
  }

  readonly save = this.effect((onSaveCompletedFn$: Observable<() => void>) =>
    onSaveCompletedFn$.pipe(
      tap(() => this.patchState({ isLoading: true, validation: undefined })),
      withLatestFrom(this.state$),
      switchMap(([onSaveCompletedFn, state]) =>
        this.saveActor(state).pipe(
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

  readonly loadInitialData = this.effect(
    (routeParams$: Observable<{ organizationId: string; actorId: string }>) =>
      routeParams$.pipe(
        tap(() => this.patchState({ isLoading: true })),
        switchMap((routeParams) =>
          forkJoin({
            gridAreas: this.getGridAreas(),
            actorAndContacts: this.getActorAndContacts(routeParams),
          }).pipe(
            tap((response) =>
              this.patchState({
                isLoading: false,
                gridAreaChanges: response.gridAreas.filter((gridArea) =>
                  response.actorAndContacts?.gridAreas.includes(gridArea.id)
                ),
              })
            )
          )
        )
      )
  );

  readonly getGridAreas = () =>
    this.gridAreaHttpClient
      .v1MarketParticipantGridAreaGet()
      .pipe(
        tap((gridAreas) =>
          this.patchState({
            gridAreas: gridAreas.sort((a, b) => a.code.localeCompare(b.code)),
          })
        )
      )
      .pipe(catchError(this.handleError));

  readonly getActorAndContacts = (routeParams: {
    organizationId: string;
    actorId: string;
  }) =>
    // contacts not implemented yet.
    of(routeParams).pipe(
      switchMap((routeParams) => {
        if (!routeParams.actorId) {
          this.patchState({
            isLoading: false,
            organizationId: routeParams.organizationId,
          });
          return of(undefined);
        }
        return this.getActor(
          routeParams.organizationId,
          routeParams.actorId
        ).pipe(catchError(this.handleError));
      })
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
          marketRoles: state.marketRoles,
          meteringPointTypes: state.meteringPointTypeChanges.meteringPointTypes,
          status: state.changes.status,
          gridAreas: state.gridAreaChanges.map((gridArea) => gridArea.id),
        }
      );
    }

    return this.httpClient.v1MarketParticipantOrganizationOrgIdActorPost(
      state.organizationId,
      {
        gln: { value: state.changes.gln },
        marketRoles: state.marketRoles,
        meteringPointTypes: state.meteringPointTypeChanges.meteringPointTypes,
        gridAreas: state.gridAreaChanges.map((gridArea) => gridArea.id),
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
        tap((actorRes) => {
          this.patchState({
            organizationId,
            actor: {
              ...actorRes,
            },
            marketRoles: actorRes.marketRoles,
          });
        })
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

  readonly setGridAreaChanges = (gridAreas: GridAreaDto[]) => {
    this.patchState({
      gridAreaChanges: gridAreas,
    });
  };

  readonly setMarketRoles = (marketRoles: MarketRoleDto[]) =>
    this.patchState({
      marketRoles,
    });
}
