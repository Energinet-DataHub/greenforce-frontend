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
import { map } from 'rxjs';

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
    contacts: ContactDto[];
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

    this.state$.subscribe((state) => {
      const masterData = state.masterData;
      if (masterData === undefined || !state.isSaving) {
        return;
      }

      this.saveOrganization(state.selected?.organization, masterData);
    });
  }

  readonly saveOrganization = (
    organization: OrganizationWithActor | undefined,
    masterData: MasterData
  ) => {
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

    const result =
      selectedId === undefined
        ? this.httpClient.v1MarketParticipantOrganizationPost(changedOrg)
        : this.httpClient.v1MarketParticipantOrganizationPut(
            selectedId,
            changedOrg
          );

    result.subscribe({
      complete: () => {
        this.beginLoading();
        this.patchState({
          selected: undefined,
          validation: undefined,
        });
      },
      error: () => {
        this.patchState({
          isLoading: false,
          validation: {
            errorMessage:
              'En fejl opstod under forsøg på at gemme organisationen',
          },
        });
      },
    });

    this.patchState({ isSaving: false });
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
      this.patchState({ selected: undefined, validation: undefined });
    } else {
      this.patchState({
        selected: { organization: organization, contacts: [] },
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
