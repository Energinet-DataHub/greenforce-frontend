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
  OrganizationDto,
  MarketParticipantHttp,
} from '@energinet-datahub/dh/shared/domain';
import {
  filter,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

export interface OverviewRow {
  organization: OrganizationDto;
  actor?: ActorDto;
}

interface MarketParticipantState {
  isLoading: boolean;

  // Overview
  isListRefreshRequired: boolean;
  overviewList: OverviewRow[];

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
}
