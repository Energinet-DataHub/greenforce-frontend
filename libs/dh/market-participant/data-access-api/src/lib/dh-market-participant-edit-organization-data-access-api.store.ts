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
  concat,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
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
  contacts$;
  organization$ = this.select((state) => state.organization);
  validation$ = this.select((state) => state.validation);

  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
    this.contacts$ = this.setupFetchContactsFlow();
  }

  private readonly ensureCompletion = of(undefined);

  readonly save = this.effect(
    (
      state$: Observable<{
        state: MarketParticipantEditOrganizationState;
        onSaveCompleted: () => void;
      }>
    ) => {
      return state$.pipe(
        tap(() => this.patchState({ isLoading: true, validation: undefined })),
        switchMap((state) => {
          return this.saveOrganization(
            state.state.organization,
            state.state.changes
          ).pipe(
            switchMap((id) =>
              this.saveContacts(
                id,
                state.state.addedContacts,
                state.state.removedContacts
              )
            ),
            tapResponse(
              () => {
                this.patchState({ isLoading: false });
                state.onSaveCompleted();
              },
              (errorResponse: HttpErrorResponse) => {
                this.patchState({
                  validation: {
                    error: this.formatErrorMessage(errorResponse.error),
                  },
                  isLoading: false,
                });
              }
            )
          );
        })
      );
    }
  );

  private readonly setupFetchContactsFlow = () =>
    this.select((state) => state.organization).pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(this.getContacts),
      tapResponse(
        (response) =>
          this.patchState({
            isLoading: false,
            contacts: response,
          }),
        (errorResponse: HttpErrorResponse) =>
          this.patchState({
            isLoading: false,
            validation: {
              error: this.formatErrorMessage(errorResponse.error),
            },
          })
      )
    );

  private readonly getContacts = (
    organization?: OrganizationDto
  ): Observable<ContactDto[]> =>
    organization
      ? this.httpClient.v1MarketParticipantOrganizationOrgIdContactGet(
          organization.organizationId
        )
      : of([]);

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

  private readonly saveOrganization = (
    organization: OrganizationDto | undefined,
    organizationChanges: OrganizationChanges
  ) =>
    organization !== undefined
      ? this.httpClient
          .v1MarketParticipantOrganizationPut(
            organization.organizationId,
            organizationChanges as ChangeOrganizationDto
          )
          .pipe(map(() => organization.organizationId))
      : this.httpClient.v1MarketParticipantOrganizationPost(
          organizationChanges as ChangeOrganizationDto
        );

  private readonly addContacts = (
    organizationId: string,
    addedContacts: ContactChanges[]
  ) =>
    from(addedContacts).pipe(
      mergeMap((x) =>
        this.httpClient.v1MarketParticipantOrganizationOrgIdContactPost(
          organizationId,
          x as CreateContactDto
        )
      )
    );

  private readonly removeContacts = (
    organizationId: string,
    removedContacts: ContactDto[]
  ) =>
    from(removedContacts).pipe(
      mergeMap((x) =>
        this.httpClient.v1MarketParticipantOrganizationOrgIdContactContactIdDelete(
          organizationId,
          x.contactId
        )
      )
    );

  private readonly saveContacts = (
    organizationId: string,
    addedContacts: ContactChanges[],
    removedContacts: ContactDto[]
  ) =>
    forkJoin([
      concat(
        this.removeContacts(organizationId, removedContacts),
        this.addContacts(organizationId, addedContacts),
        this.ensureCompletion
      ),
    ]);

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
