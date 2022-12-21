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
  MarketParticipantGridAreaHttp,
  GridAreaDto,
} from '@energinet-datahub/dh/shared/domain';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseErrorResponse } from './dh-market-participant-error-handling';

export interface OrganizationWithActorRow {
  organization: OrganizationDto;
  actor?: ActorDto;
}

interface MarketParticipantState {
  isLoading: boolean;
  rows: OrganizationWithActorRow[];
  gridAreas: GridAreaDto[];

  // Validation
  validation?: {
    errorMessage: string;
  };
}

const initialState: MarketParticipantState = {
  isLoading: true,
  rows: [],
  gridAreas: [],
};

@Injectable()
export class DhMarketParticipantOverviewDataAccessApiStore extends ComponentStore<MarketParticipantState> {
  isLoading$ = this.select((state) => state.isLoading);
  overviewList$ = this.select((state) => state.rows);
  gridAreas$ = this.select((state) => state.gridAreas);
  validationError$ = this.select((state) => state.validation);

  constructor(
    private httpClient: MarketParticipantHttp,
    private gridAreaHttpClient: MarketParticipantGridAreaHttp
  ) {
    super(initialState);
  }

  readonly loadOverviewRows = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() =>
        this.patchState({ isLoading: true, rows: [], validation: undefined })
      ),
      switchMap(() =>
        forkJoin([this.getOrganizations(), this.getGridAreas()]).pipe(
          tap(() => this.patchState({ isLoading: false }))
        )
      )
    )
  );

  private readonly mapToRows = (organizations: OrganizationDto[]) => {
    const rows: OrganizationWithActorRow[] = [];

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

  private readonly getOrganizations = () =>
    this.httpClient
      .v1MarketParticipantOrganizationGetAllOrganizationsGet()
      .pipe(map(this.mapToRows))
      .pipe(tapResponse((rows) => this.patchState({ rows }), this.handleError));

  private readonly getGridAreas = () =>
    this.gridAreaHttpClient
      .v1MarketParticipantGridAreaGetAllGridAreasGet()
      .pipe(
        tapResponse(
          (gridAreas) =>
            this.patchState({
              gridAreas: gridAreas.sort((a, b) => a.code.localeCompare(b.code)),
            }),
          this.handleError
        )
      );

  private readonly handleError = (errorResponse: HttpErrorResponse) =>
    this.patchState({
      validation: {
        errorMessage: parseErrorResponse(errorResponse),
      },
    });
}
