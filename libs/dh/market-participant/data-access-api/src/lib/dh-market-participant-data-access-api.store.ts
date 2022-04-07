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
import { ComponentStore } from '@ngrx/component-store';
import {
  ActorDto,
  AddressDto,
  ChangeOrganizationDto,
  ContactCategory,
  ContactDto,
  MarketParticipantHttp,
  OrganizationDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  concat,
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

export interface OverviewRow {
  organization: OrganizationDto;
  actor?: ActorDto;
}

export interface MasterDataChanges {
  isValid: boolean;
  name?: string;
  businessRegisterIdentifier?: string;
  address: AddressDto;
}

export interface ContactChanges {
  category?: ContactCategory;
  name?: string;
  email?: string;
  phone?: string | null;
}

interface MarketParticipantState {
  isLoading: boolean;

  // Overview
  isListRefreshRequired: boolean;
  overviewList: OverviewRow[];

  // Edit
  selection?: {
    organization: OrganizationDto | undefined;
    contacts: ContactDto[];
  };

  // Validation
  validation?: {
    errorMessage: string;
  };
}

const initialState: MarketParticipantState = {
  isLoading: false,
  isListRefreshRequired: true,
  overviewList: [],
};

@Injectable()
export class DhMarketParticipantOverviewDataAccessApiStore extends ComponentStore<MarketParticipantState> {
  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
    this.setupRefreshListFlow();
  }

  readonly setupRefreshListFlow = () => {
    this.state$
      .pipe(filter((state) => state.isListRefreshRequired))
      .pipe(
        tap(() =>
          this.patchState({
            isListRefreshRequired: false,
            isLoading: true,
            overviewList: [],
          })
        )
      )
      .pipe(switchMap(this.getOrganizations))
      .subscribe({
        next: (rows) =>
          this.patchState({
            isLoading: false,
            isListRefreshRequired: false,
            overviewList: rows,
          }),
        error: (err) =>
          this.patchState({
            isLoading: false,
            isListRefreshRequired: false,
            validation: err,
          }),
      });
  };

  readonly getOrganizations = (): Observable<OverviewRow[]> => {
    return this.httpClient
      .v1MarketParticipantOrganizationGet()
      .pipe(map(this.mapToRows));
  };

  readonly mapToRows = (organizations: OrganizationDto[]) => {
    const rows: OverviewRow[] = [];

    for (const organization of organizations) {
      if (organization.actors.length > 0) {
        for (const actor of organization.actors) {
          rows.push({ organization, actor });
        }
      } else {
        rows.push({ organization });
      }
    }

    return rows;
  };

  readonly setSelection = (row: OverviewRow) => {
    of(row)
      .pipe(tap(() => this.patchState({ isLoading: true })))
      .pipe(switchMap(this.getSelectionInfo))
      .subscribe({
        next: (selection) =>
          this.patchState({
            isLoading: false,
            selection,
          }),
        error: this.setError,
      });
  };

  readonly getSelectionInfo = (row: OverviewRow) => {
    return this.httpClient
      .v1MarketParticipantOrganizationOrgIdContactGet(
        row.organization.organizationId
      )
      .pipe(
        map((contacts) => ({
          organization: row.organization,
          contacts,
        }))
      );
  };

  readonly saveChanges = (
    organization: {
      original: OrganizationDto | undefined;
      changes: ChangeOrganizationDto;
    },
    contacts: {
      add: ContactDto[];
      remove: ContactDto[];
    }
  ) => {
    this.patchState({ isLoading: true });

    this.saveOrganization(organization)
      .pipe(switchMap(() => this.saveContacts(organization.original, contacts)))
      .subscribe({
        complete: () =>
          this.patchState({
            isLoading: false,
            isListRefreshRequired: true,
            selection: undefined,
          }),
        error: this.setError,
      });
  };

  readonly saveOrganization = (organization: {
    original: OrganizationDto | undefined;
    changes: ChangeOrganizationDto;
  }) => {
    return organization.original === undefined
      ? this.httpClient.v1MarketParticipantOrganizationPost(
          organization.changes
        )
      : this.httpClient.v1MarketParticipantOrganizationPut(
          organization.original.organizationId,
          organization.changes
        );
  };

  readonly saveContacts = (
    organization: OrganizationDto | undefined,
    contacts: {
      add: ContactDto[];
      remove: ContactDto[];
    }
  ) => {
    const removeOld = from(contacts.remove).pipe(
      switchMap((contact) => {
        return this.removeContact(organization as OrganizationDto, contact);
      })
    );

    const addNew = from(contacts.add).pipe(
      switchMap((contact) => {
        return this.addContact(organization as OrganizationDto, contact);
      })
    );

    return concat(removeOld, addNew);
  };

  readonly removeContact = (
    organization: OrganizationDto,
    contact: ContactDto
  ) => {
    return this.httpClient.v1MarketParticipantOrganizationOrgIdContactContactIdDelete(
      organization.organizationId,
      contact.contactId
    );
  };

  readonly addContact = (
    organization: OrganizationDto,
    contact: ContactDto
  ) => {
    return this.httpClient.v1MarketParticipantOrganizationOrgIdContactPost(
      organization.organizationId,
      {
        name: contact.name,
        category: contact.category,
        email: contact.email,
        phone: contact.phone,
      }
    );
  };

  readonly discardChanges = () => {
    this.patchState({ selection: undefined });
  };

  readonly createOrganization = () => {
    this.patchState({ selection: { organization: undefined, contacts: [] } });
  };

  readonly setError = () => {
    this.patchState({ isLoading: false, validation: { errorMessage: "Der opstod en fejl på serveren." } });
  };
}
