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
  MarketParticipantGridAreaOverviewHttp,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseErrorResponse } from './dh-market-participant-error-handling';

interface MarketParticipantGridAreaOverviewState {
  isLoading: boolean;
  rows: GridAreaOverviewRow[];

  // Validation
  validation?: {
    errorMessage: string;
  };
}

export interface GridAreaOverviewRow {
  id: string;
  name: string;
  code: string;
  priceAreaCode: PriceAreaCode;
  validFrom: string;
  validTo?: string | null;
  actorNumber?: string | null;
  actorName?: string | null;
  fullFlexDate?: string | null;
}

const initialState: MarketParticipantGridAreaOverviewState = {
  isLoading: false,
  rows: [],
};

@Injectable()
export class DhMarketParticipantGridAreaOverviewDataAccessApiStore extends ComponentStore<MarketParticipantGridAreaOverviewState> {
  isLoading$ = this.select((state) => state.isLoading);
  rows$ = this.select((state) => state.rows);
  validationError$ = this.select((state) => state.validation);

  constructor(private gridAreaOverviewClient: MarketParticipantGridAreaOverviewHttp) {
    super(initialState);
  }

  readonly init = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true, rows: [], validation: undefined })),
      switchMap(() => this.getOverview()),
      tap(() => this.patchState({ isLoading: false }))
    )
  );

  private readonly getOverview = () =>
    this.gridAreaOverviewClient.v1MarketParticipantGridAreaOverviewGetAllGridAreasGet().pipe(
      tapResponse(
        (rows) =>
          this.patchState({
            rows: rows
              .map((row) => ({
                ...row,
                priceAreaCode: row.priceAreaCode,
              }))
              .sort((a, b) => a.code.localeCompare(b.code)),
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
