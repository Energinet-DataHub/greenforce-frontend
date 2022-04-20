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
  mergeAll,
  Observable,
  of,
  Subscription,
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

interface ErrorDescriptor {
  code: string;
  message: string;
  target?: string;
  details: ErrorDescriptor[];
}

interface MarketParticipantEditOrganizationState {
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
  contacts$;
  organization$ = this.select((state) => state.organization);
  validation$ = this.select((state) => state.validation);

  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
    this.contacts$ = this.setupFetchContactsFlow();
  }

  private readonly setupFetchContactsFlow = () =>
    this.select((state) => state.organization)
      .pipe(tap(() => this.patchState({ isLoading: true })))
      .pipe(switchMap(this.getContacts))
      .pipe(
        tapResponse(
          (response) =>
            this.patchState({
              isLoading: false,
              contacts: response,
            }),
          (error: HttpErrorResponse) =>
            this.patchState({
              isLoading: false,
            })
        )
      );

  private readonly getContacts = (
    organization?: OrganizationDto
  ): Observable<ContactDto[]> => {
    if (!organization) {
      return of([]);
    }

    return this.httpClient.v1MarketParticipantOrganizationOrgIdContactGet(
      organization.organizationId
    );
  };

  readonly setMasterDataChanges = (changes: OrganizationChanges) => {
    this.patchState({
      changes,
    });
  };

  readonly setContactChanges = (
    added: ContactChanges[],
    removed: ContactDto[]
  ) => {
    this.patchState({
      addedContacts: added,
      removedContacts: removed,
    });
  };

  readonly beginEditing = (organization: OrganizationDto) => {
    this.patchState({
      organization,
      contacts: [],
      changes: { isValid: true, ...organization },
    });
  };

  readonly beginCreating = () => {
    this.patchState({
      isLoading: true,
    });
  };

  readonly saveOrganization = (
    organization: OrganizationDto | undefined,
    organizationChanges: OrganizationChanges
  ) => {
    if (organization !== undefined) {
      return this.httpClient
        .v1MarketParticipantOrganizationPut(
          organization.organizationId,
          organizationChanges as ChangeOrganizationDto
        )
        .pipe(map(() => organization.organizationId));
    }
    return this.httpClient.v1MarketParticipantOrganizationPost(
      organizationChanges as ChangeOrganizationDto
    );
  };

  readonly saveContacts = (
    organizationId: string,
    addedContacts: ContactChanges[],
    removedContacts: ContactDto[]
  ) => {
    const removed = from(removedContacts)
      .pipe(
        map((x) =>
          this.httpClient.v1MarketParticipantOrganizationOrgIdContactContactIdDelete(
            organizationId,
            x.contactId
          )
        )
      )
      .pipe(mergeAll());

    const added = from(addedContacts)
      .pipe(
        map((x) =>
          this.httpClient.v1MarketParticipantOrganizationOrgIdContactPost(
            organizationId,
            x as CreateContactDto
          )
        )
      )
      .pipe(mergeAll());

    return forkJoin([concat(removed, added)]);
  };

  readonly save = (onSaveCompleted: () => void) => {
    this.patchState({ isLoading: true });
    const x: Subscription = this.select((state) => state)
      .pipe(
        switchMap((state) =>
          this.saveOrganization(state.organization, state.changes).pipe(
            map((x) => ({
              organizationId: x,
              added: state.addedContacts,
              removed: state.removedContacts,
            }))
          )
        )
      )
      .pipe(
        switchMap((x) =>
          this.saveContacts(x.organizationId, x.added, x.removed)
        )
      )
      .pipe(
        tapResponse(
          () => {
            this.patchState({ isLoading: false });
            onSaveCompleted();
          },
          (errorResponse: HttpErrorResponse) => {
            this.patchState({
              validation: {
                error: this.formatErrorMessage(
                  errorResponse.error.error as ErrorDescriptor
                ),
              },
              isLoading: false,
            });
          }
        )
      )
      .subscribe(() => x.unsubscribe());
  };

  readonly formatErrorMessage = (errorDescriptor: ErrorDescriptor) =>
    errorDescriptor.details.map((x) => x.message).join(' ');
}
