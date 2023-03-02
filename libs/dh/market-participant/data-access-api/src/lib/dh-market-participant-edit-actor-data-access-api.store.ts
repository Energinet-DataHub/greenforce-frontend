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
  ActorMarketRoleDto,
  MarketParticipantMeteringPointType,
  ActorStatus,
  GridAreaDto,
  MarketParticipantGridAreaHttp,
  ActorContactDto,
  ContactCategory,
  CreateActorContactDto,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain';
import {
  catchError,
  EMPTY,
  filter,
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

export interface MarketRoleChanges {
  isValid: boolean;
  marketRoles: MarketRole[];
}

export interface MarketRole {
  marketRole: EicFunction;
  gridAreas: MarketRoleGridArea[];
  comment?: string | null;
}

export interface MarketRoleGridArea {
  id: string;
  meteringPointTypes: MarketParticipantMeteringPointType[];
}

export interface ActorChanges {
  existingActor: boolean;
  actorNumber: string;
  status: ActorStatus;
  name: string;
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
  isEditing: boolean;

  // Input
  organizationId: string;
  actorId?: string;
  status: ActorStatus;

  gridAreas: GridAreaDto[];
  contacts: ActorContactDto[];
  marketRoles: ActorMarketRoleDto[];

  // Changes
  changes: ActorChanges;

  meteringPointTypeChanges: MeteringPointTypeChanges;
  gridAreaChanges: GridAreaDto[];
  marketRoleChanges: {
    isValid: boolean;
    marketRoles: ActorMarketRoleDto[];
  };

  contactChanges: {
    isValid: boolean;
    addedContacts: ActorContactChanges[];
    removedContacts: ActorContactDto[];
  };
  actorSaved: boolean;
  contactsRemoved: boolean;
  contactsAdded: boolean;

  // Validation
  validation?: { translate: boolean; error: string };
}

const initialState: MarketParticipantEditActorState = {
  status: ActorStatus.New,
  isLoading: false,
  isEditing: false,
  organizationId: '',
  gridAreas: [],
  contacts: [],
  marketRoles: [],
  changes: {
    existingActor: false,
    actorNumber: '',
    status: ActorStatus.New,
    name: '',
  },
  marketRoleChanges: { isValid: true, marketRoles: [] },
  meteringPointTypeChanges: { meteringPointTypes: [] },
  gridAreaChanges: [],
  contactChanges: {
    isValid: true,
    addedContacts: [],
    removedContacts: [],
  },
  actorSaved: false,
  contactsAdded: false,
  contactsRemoved: false,
};

@Injectable()
export class DhMarketParticipantEditActorDataAccessApiStore extends ComponentStore<MarketParticipantEditActorState> {
  isLoading$ = this.select((state) => state.isLoading);
  isEditing$ = this.select((state) => state.isEditing);
  marketRoles$ = this.select((state) => state.marketRoles);
  validation$ = this.select((state) => state.validation);
  changes$ = this.select((state) => state.changes);
  status$ = this.select((state) => state.status);
  gridAreas$ = this.select((state) => state.gridAreas);
  contacts$ = this.select((state) => state.contacts);

  constructor(
    private httpClient: MarketParticipantHttp,
    private gridAreaHttpClient: MarketParticipantGridAreaHttp
  ) {
    super(initialState);
  }

  readonly save = this.effect((onSaveCompletedFn$: Observable<() => void>) => {
    return onSaveCompletedFn$.pipe(
      tap(() => this.patchState({ isLoading: true, validation: undefined })),
      withLatestFrom(this.state$),
      filter(([, state]) => {
        if (!state.contactChanges.isValid) {
          this.patchState({
            isLoading: false,
            validation: {
              translate: true,
              error: `marketParticipant.actor.create.contacts.invalidConfiguration`,
            },
          });
        }
        return state.contactChanges.isValid;
      }),
      filter(([, state]) => {
        if (!state.marketRoleChanges.isValid) {
          this.patchState({
            isLoading: false,
            validation: {
              translate: true,
              error: `marketParticipant.actor.create.marketRoles.invalidConfiguration`,
            },
          });
        }
        return state.marketRoleChanges.isValid;
      }),
      switchMap(([onSaveCompletedFn, state]) => {
        return this.saveActor(state).pipe(
          switchMap((actorId) =>
            this.removeContacts(actorId, state).pipe(
              switchMap(() => this.addContacts(actorId, state))
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
                  translate: false,
                  error: parseErrorResponse(errorResponse),
                },
              });
            }
          )
        );
      })
    );
  });

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
            tap(() =>
              this.patchState({
                isLoading: false,
              })
            )
          )
        )
      )
  );

  readonly getGridAreas = () =>
    this.gridAreaHttpClient
      .v1MarketParticipantGridAreaGetAllGridAreasGet()
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
        status: ActorStatus.New,
        organizationId: organizationId,
        changes: {
          existingActor: false,
          actorNumber: '',
          status: ActorStatus.New,
          name: '',
        },
      });
      return of(undefined);
    }
    return this.httpClient
      .v1MarketParticipantOrganizationGetActorGet(actorId)
      .pipe(
        tap((response) => {
          this.patchState({
            isEditing: true,
            status: response.status,
            organizationId: organizationId,
            actorId: response.actorId,
            marketRoles: response.marketRoles,
            changes: {
              existingActor: true,
              actorNumber: response.actorNumber.value,
              status: response.status,
              name: response.name.value,
            },
            marketRoleChanges: {
              isValid: true,
              marketRoles: response.marketRoles,
            },
          });
        })
      )
      .pipe(catchError(this.handleError));
  };

  private readonly getContacts = ({ actorId }: { organizationId: string; actorId: string }) => {
    if (!actorId) {
      return of([]);
    }
    return this.httpClient.v1MarketParticipantOrganizationGetContactsGet(actorId).pipe(
      tap((response) => this.patchState({ contacts: response })),
      catchError(this.handleError)
    );
  };

  private readonly removeContacts = (actorId: string, state: MarketParticipantEditActorState) => {
    if (state.contactChanges.removedContacts.length === 0) {
      return of({ ...state, contactsRemoved: true });
    }

    return forkJoin(
      state.contactChanges.removedContacts.map((contact) =>
        this.httpClient.v1MarketParticipantOrganizationDeleteContactDelete(
          actorId,
          contact.contactId
        )
      )
    ).pipe(map(() => ({ ...state, contactsRemoved: true })));
  };

  private readonly addContacts = (actorId: string, state: MarketParticipantEditActorState) => {
    if (state.contactChanges.addedContacts.length === 0) {
      return of({ ...state, contactsAdded: true });
    }

    return forkJoin(
      state.contactChanges.addedContacts.map((c) =>
        this.httpClient.v1MarketParticipantOrganizationCreateContactPost(
          actorId,
          c as CreateActorContactDto
        )
      )
    ).pipe(map(() => ({ ...state, contactsAdded: true })));
  };

  readonly handleError = (errorResponse: HttpErrorResponse) => {
    this.patchState({
      validation: {
        translate: false,
        error: parseErrorResponse(errorResponse),
      },
    });
    return EMPTY;
  };

  private readonly saveActor = (state: MarketParticipantEditActorState) => {
    const actorId = state.actorId;
    if (actorId !== undefined) {
      return this.httpClient
        .v1MarketParticipantOrganizationUpdateActorPut(actorId, {
          marketRoles: state.marketRoleChanges.marketRoles,
          status: state.changes.status,
          name: { value: state.changes.name },
        })
        .pipe(map(() => actorId));
    }

    return this.httpClient
      .v1MarketParticipantOrganizationCreateActorPost({
        organizationId: state.organizationId,
        actorNumber: { value: state.changes.actorNumber },
        name: { value: state.changes.name },
        marketRoles: state.marketRoleChanges.marketRoles,
      })
      .pipe(map((id) => id));
  };

  readonly setMasterDataChanges = (changes: ActorChanges) =>
    this.patchState({
      changes,
    });

  readonly setMarketRoleChanges = (changes: MarketRoleChanges) =>
    this.patchState({
      marketRoleChanges: {
        isValid: changes.isValid,
        marketRoles: changes.marketRoles.map((mrc) => ({
          eicFunction: mrc.marketRole,
          gridAreas: mrc.gridAreas,
          comment: mrc.comment,
        })),
      },
    });

  readonly setContactChanges = (
    isValid: boolean,
    added: ActorContactChanges[],
    removed: ActorContactDto[]
  ) =>
    this.patchState({
      contactChanges: {
        isValid: isValid,
        addedContacts: added,
        removedContacts: removed,
      },
    });
}
