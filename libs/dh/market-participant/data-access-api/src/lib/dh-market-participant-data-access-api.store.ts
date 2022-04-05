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
import { firstValueFrom, map } from 'rxjs';

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
  organizations: OrganizationWithActor[];
  selected?: OrganizationWithActor;
  selectedContacts: ContactDto[];
  masterData?: MasterData;
}

const initialState: MarketParticipantState = {
  isLoading: true,
  organizations: [],
  selectedContacts: [],
};

@Injectable()
export class DhMarketParticipantOverviewDataAccessApiStore extends ComponentStore<MarketParticipantState> {
  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
  }

  readonly beginLoading = () => {
    this.httpClient
      .v1MarketParticipantOrganizationGet()
      .pipe(map(this.mapActors))
      .subscribe(this.setActors);
  };

  readonly saveSelected = async () => {
    this.patchState({ isLoading: true });

    const state = await firstValueFrom(this.state$);
    const masterData = state.masterData;
    if (masterData === undefined) {
      return;
    }

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

    const selectedId = state.selected?.organization.organizationId;

    if (selectedId === undefined) {
      await firstValueFrom(
        this.httpClient.v1MarketParticipantOrganizationPost(changedOrg)
      );
    } else {
      await firstValueFrom(
        this.httpClient.v1MarketParticipantOrganizationPut(
          selectedId,
          changedOrg
        )
      );
    }

    this.patchState({ selected: undefined, masterData: undefined });

    const actors = await firstValueFrom(
      this.httpClient
        .v1MarketParticipantOrganizationGet()
        .pipe(map(this.mapActors))
    );

    this.setActors(actors);
  };

  readonly setActors = (organizations: OrganizationWithActor[]) => {
    this.patchState({ organizations, isLoading: false });
  };

  readonly setSelected = (organization?: OrganizationWithActor) => {
    this.patchState({ selected: organization });
  };

  readonly setMasterData = (data?: MasterData) => {
    this.patchState({ masterData: data });
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
