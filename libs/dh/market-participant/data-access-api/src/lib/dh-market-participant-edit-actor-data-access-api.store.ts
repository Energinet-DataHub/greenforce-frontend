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
  ActorContactDto,
  ContactCategory,
  CreateActorContactDto,
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
  actorId?: string;
  actorNumber: string;
  status: ActorStatus;
}

export interface MeteringPointTypeChanges {
  meteringPointTypes: MarketParticipantMeteringPointType[];
}

export interface ActorContactChanges {
  category?: ContactCategory;
  name?: string;
  email?: string;
  phone?: string | null;
}

export interface MarketParticipantEditActorState {
  isLoading: boolean;

  // Input
  organizationId: string;
  actor?: ActorDto;
  gridAreas: GridAreaDto[];
  contacts: ActorContactDto[];

  // Changes
  changes: ActorChanges;

  meteringPointTypeChanges: MeteringPointTypeChanges;
  gridAreaChanges: GridAreaDto[];
  marketRoles: MarketRoleDto[];

  addedContacts: ActorContactChanges[];
  removedContacts: ActorContactDto[];
  actorSaved: boolean;
  contactsRemoved: boolean;
  contactsAdded: boolean;

  // Validation
  validation?: { error: string };
}

const initialState: MarketParticipantEditActorState = {
  isLoading: false,
  organizationId: '',
  gridAreas: [],
  contacts: [],
  changes: {
    actorNumber: '',
    status: ActorStatus.New,
  },
  marketRoles: [],
  meteringPointTypeChanges: { meteringPointTypes: [] },
  gridAreaChanges: [],
  addedContacts: [],
  removedContacts: [],
  actorSaved: false,
  contactsAdded: false,
  contactsRemoved: false,
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
  contacts$ = this.select((state) => state.contacts);

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
          switchMap((actorId) =>
            this.removeContacts(state.organizationId, actorId, state).pipe(
              switchMap(() =>
                this.addContacts(state.organizationId, actorId, state)
              )
            )
          ),
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
            actor: this.getActorInfo(routeParams),
            contacts: this.getContacts(routeParams),
          }).pipe(
            tap((response) =>
              this.patchState({
                isLoading: false,
                gridAreaChanges: response.gridAreas.filter((gridArea) =>
                  response.actor?.gridAreas.includes(gridArea.id)
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

  readonly getActorInfo = ({
    organizationId,
    actorId,
  }: {
    organizationId: string;
    actorId: string;
  }) => {
    if (!actorId) {
      this.patchState({
        organizationId: organizationId,
      });
      return of(undefined);
    }
    return this.httpClient
      .v1MarketParticipantOrganizationOrgIdActorActorIdGet(
        organizationId,
        actorId
      )
      .pipe(
        tap((response) => {
          this.patchState({
            organizationId: organizationId,
            actor: {
              ...response,
            },
            changes: {
              actorId: response.actorId,
              actorNumber: response.actorNumber.value,
              status : response.status
            },
            marketRoles: response.marketRoles,
          });
        })
      )
      .pipe(catchError(this.handleError));
  };

  private readonly getContacts = ({
    organizationId,
    actorId,
  }: {
    organizationId: string;
    actorId: string;
  }) => {
    if (!actorId) {
      return of([]);
    }
    return this.httpClient
      .v1MarketParticipantOrganizationOrgIdActorActorIdContactGet(
        organizationId,
        actorId
      )
      .pipe(
        tap((response) => this.patchState({ contacts: response })),
        catchError(this.handleError)
      );
  };

  private readonly removeContacts = (
    organizationId: string,
    actorId: string,
    state: MarketParticipantEditActorState
  ) => {
    if (state.removedContacts.length === 0) {
      return of({ ...state, contactsRemoved: true });
    }

    return forkJoin(
      state.removedContacts.map((contact) =>
        this.httpClient.v1MarketParticipantOrganizationOrgIdActorActorIdContactContactIdDelete(
          organizationId,
          actorId,
          contact.contactId
        )
      )
    ).pipe(map(() => ({ ...state, contactsRemoved: true })));
  };

  private readonly addContacts = (
    organizationId: string,
    actorId: string,
    state: MarketParticipantEditActorState
  ) => {
    if (state.addedContacts.length === 0) {
      return of({ ...state, contactsAdded: true });
    }

    return forkJoin(
      state.addedContacts.map((c) =>
        this.httpClient.v1MarketParticipantOrganizationOrgIdActorActorIdContactPost(
          organizationId,
          actorId,
          c as CreateActorContactDto
        )
      )
    ).pipe(map(() => ({ ...state, contactsAdded: true })));
  };

  readonly handleError = (errorResponse: HttpErrorResponse) => {
    this.patchState({
      validation: {
        error: parseErrorResponse(errorResponse),
      },
    });
    return EMPTY;
  };

  private readonly saveActor = (state: MarketParticipantEditActorState) => {
    const actor = state.actor;
    if (actor !== undefined) {
      return this.httpClient
        .v1MarketParticipantOrganizationOrgIdActorActorIdPut(
          state.organizationId,
          actor.actorId,
          {
            marketRoles: state.marketRoles,
            meteringPointTypes:
              state.meteringPointTypeChanges.meteringPointTypes,
            status: state.changes.status,
            gridAreas: state.gridAreaChanges.map((gridArea) => gridArea.id),
          }
        )
        .pipe(map(() => actor.actorId));
    }

    return this.httpClient
      .v1MarketParticipantOrganizationOrgIdActorPost(state.organizationId, {
        actorNumber: { value: state.changes.actorNumber },
        marketRoles: state.marketRoles,
        meteringPointTypes: state.meteringPointTypeChanges.meteringPointTypes,
        gridAreas: state.gridAreaChanges.map((gridArea) => gridArea.id),
      })
      .pipe(map((id) => id));
  };

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

  readonly setContactChanges = (
    added: ActorContactChanges[],
    removed: ActorContactDto[]
  ) =>
    this.patchState({
      addedContacts: added,
      removedContacts: removed,
    });
}
