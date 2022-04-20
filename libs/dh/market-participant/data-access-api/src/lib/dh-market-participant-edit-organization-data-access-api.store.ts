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
  ContactCategory,
  ContactDto,
  MarketParticipantHttp,
  OrganizationDto,
} from '@energinet-datahub/dh/shared/domain';
import { map, Observable, of, switchMap, tap } from 'rxjs';
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

interface MarketParticipantEditOrganizationState {
  isLoading: boolean;

  // Input
  organization?: OrganizationDto;
  contacts: ContactDto[];

  // Changes
  changes: OrganizationChanges;
  addedContacts: ContactChanges[];
  removedContacts: ContactDto[];
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
          (response) => this.patchState({
            isLoading: false,
            contacts: response,
          }),
          (error: HttpErrorResponse) => this.patchState({
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
    console.log("begin editing")
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
}
