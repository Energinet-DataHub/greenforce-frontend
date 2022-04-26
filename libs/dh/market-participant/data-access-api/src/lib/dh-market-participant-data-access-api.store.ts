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
  ActorDto,
  OrganizationDto,
  MarketParticipantHttp,
} from '@energinet-datahub/dh/shared/domain';
import { map, Observable, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface OverviewRow {
  organization: OrganizationDto;
  actor?: ActorDto;
}

interface MarketParticipantState {
  isLoading: boolean;

  // Validation
  validation?: {
    errorMessage: string;
  };
}

const initialState: MarketParticipantState = {
  isLoading: true,
};

@Injectable()
export class DhMarketParticipantOverviewDataAccessApiStore extends ComponentStore<MarketParticipantState> {
  isLoading$ = this.select((state) => state.isLoading);
  overviewList$;
  validationError$ = this.select((state) => state.validation);

  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
    this.overviewList$ = this.setupRefreshListFlow();
  }

  private readonly setupRefreshListFlow = () =>
    this.getOrganizations().pipe(
      tap(() => this.patchState({ isLoading: true, validation: undefined })),
      tapResponse(
        () => this.patchState({ isLoading: false }),
        (error: HttpErrorResponse) =>
          this.patchState({
            isLoading: false,
            validation: { errorMessage: error.error },
          })
      )
    );

  private readonly getOrganizations = (): Observable<OverviewRow[]> => {
    return this.httpClient
      .v1MarketParticipantOrganizationGet()
      .pipe(map(this.mapToRows));
  };

  private readonly mapToRows = (organizations: OrganizationDto[]) => {
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
