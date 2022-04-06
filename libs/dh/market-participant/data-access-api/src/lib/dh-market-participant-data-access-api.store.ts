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
  ChangeOrganizationDto,
  ContactCategory,
  ContactDto,
  MarketParticipantHttp,
  OrganizationDto,
} from '@energinet-datahub/dh/shared/domain';
import { forkJoin, map, Observable, of } from 'rxjs';

export interface OrganizationWithActor {
  organization: OrganizationDto;
  actor?: ActorDto;
}

export interface MasterData {
  valid: boolean;
  name: string;
  businessRegistrationIdentifier: string;
  streetName: string;
  streetNumber: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface ContactChanges {
  category?: ContactCategory;
  name?: string;
  email?: string;
  phone?: string | null;
}

interface MarketParticipantState {
  isLoading: boolean;
  isSaving: boolean;
  organizations: OrganizationWithActor[];

  selected?: {
    organization: OrganizationWithActor;
    contacts?: ContactDto[];
  };

  masterData?: MasterData;
  addContacts?: ContactChanges[];
  removeContacts?: ContactDto[];

  validation?: {
    errorMessage: string;
  };
}

const initialState: MarketParticipantState = {
  isLoading: true,
  isSaving: false,
  organizations: [],
};

@Injectable()
export class DhMarketParticipantOverviewDataAccessApiStore extends ComponentStore<MarketParticipantState> {
  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);

    this.select((state) => state.selected).subscribe((selection) => {
      if (selection === undefined || selection.contacts !== undefined) {
        return;
      }

      this.loadContacts(selection.organization.organization);
    });

    this.state$.subscribe((state) => {
      if (!state.isSaving) {
        return;
      }

      this.saveAll(
        state.selected?.organization,
        state.masterData,
        state.addContacts,
        state.removeContacts
      );
    });
  }

  readonly saveAll = (
    organization: OrganizationWithActor | undefined,
    masterData: MasterData | undefined,
    add: ContactChanges[] | undefined,
    remove: ContactDto[] | undefined
  ) => {
    const tasks: Observable<string>[] = [
      this.saveOrganization(organization, masterData),
      this.saveContacts(organization?.organization, add ?? [], remove ?? []),
    ];

    forkJoin(tasks).subscribe({
      complete: () => {
        this.beginLoading();
        this.patchState({
          selected: undefined,
          validation: undefined,
        });
      },
      error: (err) => {
        console.log('notok', err);
        this.patchState({
          isLoading: false,
          validation: { errorMessage: 'we fucked up' },
        });
      },
    });

    this.patchState({ isSaving: false });
  };

  readonly saveOrganization = (
    organization: OrganizationWithActor | undefined,
    masterData: MasterData | undefined
  ): Observable<string> => {
    if (masterData !== undefined) {
      const changedOrg: ChangeOrganizationDto = {
        name: masterData.name,
        businessRegisterIdentifier: masterData.businessRegistrationIdentifier,
        address: {
          streetName: masterData.streetName,
          number: masterData.streetNumber,
          zipCode: masterData.zipCode,
          city: masterData.city,
          country: masterData.country,
        },
      };

      const selectedId = organization?.organization.organizationId;

      return selectedId === undefined
        ? this.httpClient.v1MarketParticipantOrganizationPost(changedOrg)
        : this.httpClient.v1MarketParticipantOrganizationPut(
            selectedId,
            changedOrg
          );
    }

    return of('');
  };

  readonly saveContacts = (
    organization: OrganizationDto | undefined,
    add: ContactChanges[],
    remove: ContactDto[]
  ): Observable<string> => {
    if (organization === undefined) {
      return of('');
    }

    const tasks: Observable<string>[] = [];

    remove.forEach((element) => {
      tasks.push(
        this.httpClient.v1MarketParticipantOrganizationOrgIdContactContactIdDelete(
          organization.organizationId,
          element.contactId
        )
      );
    });

    return forkJoin(tasks).pipe(() => {
      const addTasks: Observable<string>[] = [];

      add.forEach((element) => {
        addTasks.push(
          this.httpClient.v1MarketParticipantOrganizationOrgIdContactPost(
            organization.organizationId,
            {
              category: element.category,
              name: element.name,
              email: element.email,
              phone: element.phone,
            } as ContactDto
          )
        );
      });

      return forkJoin(addTasks).pipe(map(() => ''));
    });
  };

  readonly loadContacts = (organization: OrganizationDto) => {
    this.httpClient
      .v1MarketParticipantOrganizationOrgIdContactGet(
        organization.organizationId
      )
      .subscribe((contacts) => {
        this.setState((state) => {
          const selected =
            state.selected === undefined
              ? undefined
              : { ...state.selected, contacts };

          return { ...state, selected };
        });
      });
  };

  readonly beginLoading = () => {
    this.httpClient
      .v1MarketParticipantOrganizationGet()
      .pipe(map(this.mapActors))
      .subscribe(this.setActors);
  };

  readonly beginSaving = () => {
    this.patchState({ isLoading: true, isSaving: true });
  };

  readonly setActors = (organizations: OrganizationWithActor[]) => {
    this.patchState({ organizations, isLoading: false });
  };

  readonly setSelected = (organization?: OrganizationWithActor) => {
    if (organization === undefined) {
      this.patchState({ selected: undefined });
    } else {
      this.patchState({
        selected: { organization: organization },
      });
    }
  };

  readonly setMasterData = (data?: MasterData) => {
    this.patchState({ masterData: data });
  };

  readonly setContactsChanged = (
    add: ContactChanges[],
    remove: ContactDto[]
  ) => {
    this.patchState({ addContacts: add, removeContacts: remove });
  };

  readonly mapActors = (organizations: OrganizationDto[]) => {
    return organizations.reduce((running, x) => {
      return (
        (x.actors.length > 0 &&
          running.concat(
            x.actors.map((actor) => ({ organization: x, actor }))
          )) ||
        running.concat([{ organization: x, actor: undefined }])
      );
    }, [] as OrganizationWithActor[]);
  };
}
