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
  AddressDto,
  ChangeOrganizationDto,
  ContactCategory,
  ContactDto,
  CreateContactDto,
  MarketParticipantHttp,
  OrganizationDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  catchError,
  EMPTY,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface OrganizationChanges {
  isValid: boolean;
  name?: string;
  businessRegisterIdentifier?: string;
  address: AddressDto;
}

export interface ContactChanges {
  isValid: boolean;
  category?: ContactCategory;
  name?: string;
  email?: string;
  phone?: string | null;
}

interface ServerErrorDescriptor {
  error: ErrorDescriptor;
}

interface ErrorDescriptor {
  code: string;
  message: string;
  target?: string;
  details: ErrorDescriptor[];
}

interface ClientErrorDescriptor {
  errors: any;
}

interface SaveProgress {
  changes: OrganizationChanges;
  addedContacts: ContactChanges[];
  removedContacts: ContactDto[];

  organizationId: string | undefined;

  organizationSaved: boolean;
  contactsRemoved: boolean;
  contactsAdded: boolean;
}

export interface MarketParticipantEditOrganizationState {
  isLoading: boolean;

  // Input
  organization?: OrganizationDto;
  contacts: ContactDto[];

  // Changes
  changes: OrganizationChanges;
  addedContacts: ContactChanges[];
  removedContacts: ContactDto[];

  // Validation
  validation?: { error: string };
}

const initialState: MarketParticipantEditOrganizationState = {
  isLoading: false,
  changes: { isValid: false, address: { country: 'DK' } },
  contacts: [],
  addedContacts: [],
  removedContacts: [],
};

@Injectable()
export class DhMarketParticipantEditOrganizationDataAccessApiStore extends ComponentStore<MarketParticipantEditOrganizationState> {
  isLoading$ = this.select((state) => state.isLoading);
  isEditing$ = this.select((state) => state.organization !== undefined);
  contacts$ = this.select((state) => state.contacts);
  organization$ = this.select((state) => state.organization);
  validation$ = this.select((state) => state.validation);
  changes$ = this.select(
    (state): SaveProgress => ({
      changes: state.changes,
      removedContacts: state.removedContacts,
      addedContacts: state.addedContacts,

      organizationId: state.organization?.organizationId,

      organizationSaved: false,
      contactsRemoved: false,
      contactsAdded: false,
    })
  );

  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
  }

  private readonly ensureCompletion = of(undefined);

  readonly getOrganizationAndContacts = this.effect((id: Observable<string>) =>
    id.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap((id) => {
        if (!id) return this.ensureCompletion;
        return this.getOrganization(id)
          .pipe(switchMap(() => this.getContacts(id)))
          .pipe(
            catchError((errorResponse: HttpErrorResponse) => {
              this.patchState({
                validation: {
                  error: this.formatErrorMessage(errorResponse.error),
                },
              });
              return EMPTY;
            })
          );
      }),
      tap(() => this.patchState({ isLoading: false }))
    )
  );

  readonly save = this.effect((saveTrigger: Observable<void>) =>
    saveTrigger.pipe(
      tap(() => this.patchState({ isLoading: true, validation: undefined })),
      withLatestFrom(this.changes$),
      switchMap(([, changes]) =>
        of(changes).pipe(
          switchMap((changes) => this.saveOrganization(changes)),
          switchMap((changes) => this.removeContacts(changes)),
          switchMap((changes) => this.addContacts(changes)),
          tapResponse(
            (state) => {
              console.log(state);
              this.patchState({
                isLoading:
                  state.organizationSaved &&
                  state.contactsRemoved &&
                  state.contactsAdded,
              });
            },
            (errorResponse: HttpErrorResponse) => {
              this.patchState({
                isLoading: false,
                validation: {
                  error: this.formatErrorMessage(errorResponse.error),
                },
              });
            }
          )
        )
      )
    )
  );

  readonly saveOrganization = (saveProgress: SaveProgress) => {
    if (saveProgress.organizationId !== undefined) {
      return this.httpClient
        .v1MarketParticipantOrganizationPut(
          saveProgress.organizationId,
          saveProgress.changes as ChangeOrganizationDto
        )
        .pipe(map(() => ({ ...saveProgress, organizationSaved: true })));
    }

    return this.httpClient
      .v1MarketParticipantOrganizationPost(
        saveProgress.changes as ChangeOrganizationDto
      )
      .pipe(
        map((organizationId) => ({
          ...saveProgress,
          organizationSaved: true,
          organizationId,
        }))
      );
  };

  readonly removeContacts = (saveProgress: SaveProgress) => {
    const orgId = saveProgress.organizationId;

    if (saveProgress.removedContacts.length === 0 || orgId === undefined) {
      return of({ ...saveProgress, contactsRemoved: true });
    }

    return from(saveProgress.removedContacts).pipe(
      mergeMap((contact) =>
        this.httpClient.v1MarketParticipantOrganizationOrgIdContactContactIdDelete(
          orgId,
          contact.contactId
        )
      ),
      map(() => ({ ...saveProgress, contactsRemoved: true }))
    );
  };

  readonly addContacts = (saveProgress: SaveProgress) => {
    const orgId = saveProgress.organizationId;

    if (saveProgress.addedContacts.length === 0 || orgId === undefined)
      return of({ ...saveProgress, contactsRemoved: true });

    return from(saveProgress.addedContacts).pipe(
      mergeMap((contact) =>
        this.httpClient.v1MarketParticipantOrganizationOrgIdContactPost(
          orgId,
          contact as CreateContactDto
        )
      ),
      map(() => ({ ...saveProgress, contactsRemoved: true }))
    );
  };

  private readonly getOrganization = (id: string) =>
    of(id).pipe(
      switchMap((organizationId) =>
        this.httpClient
          .v1MarketParticipantOrganizationOrgIdGet(organizationId)
          .pipe(
            tap((organization) =>
              this.patchState({
                organization,
              })
            )
          )
      )
    );

  private readonly getContacts = (id: string) =>
    of(id).pipe(
      switchMap((organizationId) =>
        this.httpClient
          .v1MarketParticipantOrganizationOrgIdContactGet(organizationId)
          .pipe(
            tap((response) =>
              this.patchState({
                contacts: response,
              })
            )
          )
      )
    );

  readonly setMasterDataChanges = (changes: OrganizationChanges) =>
    this.patchState({
      changes,
    });

  readonly setContactChanges = (
    added: ContactChanges[],
    removed: ContactDto[]
  ) =>
    this.patchState({
      addedContacts: added,
      removedContacts: removed,
    });

  readonly beginEditing = (organization: OrganizationDto) =>
    this.patchState({
      organization,
      contacts: [],
      changes: { isValid: true, ...organization },
    });

  readonly beginCreating = () =>
    this.patchState({
      isLoading: true,
    });

  readonly formatErrorMessage = (
    errorDescriptor: ServerErrorDescriptor | ClientErrorDescriptor
  ) => {
    try {
      return this.isServerErrorDescriptor(errorDescriptor)
        ? errorDescriptor.error.details.map((x) => x.message).join(' ')
        : Object.values(errorDescriptor.errors).join(' ');
    } catch {
      return 'Unknown error';
    }
  };

  readonly isServerErrorDescriptor = (
    errorDescriptor: ServerErrorDescriptor | ClientErrorDescriptor
  ): errorDescriptor is ServerErrorDescriptor =>
    (<ServerErrorDescriptor>errorDescriptor).error !== undefined;
}
