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
  MarketParticipantHttp,
  OrganizationDto,
} from '@energinet-datahub/dh/shared/domain';
import { map } from 'rxjs';

export interface OrganizationWithActor {
  organization: Partial<OrganizationDto>;
  actor?: Partial<ActorDto>;
}

interface MarketParticipantState {
  isLoading: boolean;
  organizations: OrganizationWithActor[];
}

const initialState: MarketParticipantState = {
  isLoading: true,
  organizations: [],
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

  readonly setActors = (organizations: OrganizationWithActor[]) => {
    this.patchState({ organizations, isLoading: false });
  };

  readonly mapActors = (organizations: OrganizationDto[]) => {
    return organizations.reduce((running, x) => {
      return (
        (x.actors.length > 0 &&
          running.concat(
            x.actors.map((a) => ({ organization: x, actor: a }))
          )) ||
        running.concat([{ organization: x, actor: undefined }])
      );
    }, [] as OrganizationWithActor[]);
  };
}
