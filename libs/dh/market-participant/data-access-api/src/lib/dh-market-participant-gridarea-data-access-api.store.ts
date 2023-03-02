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
  GridAreaAuditLogEntryDto,
  MarketParticipantGridAreaHttp,
} from '@energinet-datahub/dh/shared/domain';
import { exhaustMap, Observable, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseErrorResponse } from './dh-market-participant-error-handling';

interface MarketParticipantGridAreaState {
  isLoading: boolean;
  isLoadingAuditLog: boolean;
  auditLog: GridAreaAuditLogEntryDto[];

  // Validation
  validation?: {
    errorMessage: string;
  };
}

export interface GridAreaChanges {
  id: string;
  name: string;
}

const initialState: MarketParticipantGridAreaState = {
  isLoading: false,
  isLoadingAuditLog: false,
  auditLog: [],
};

@Injectable()
export class DhMarketParticipantGridAreaDataAccessApiStore extends ComponentStore<MarketParticipantGridAreaState> {
  isLoading$ = this.select((state) => state.isLoading);
  isLoadingAuditLog$ = this.select((state) => state.isLoadingAuditLog);
  auditLog$ = this.select((state) => state.auditLog);

  constructor(private gridAreaClient: MarketParticipantGridAreaHttp) {
    super(initialState);
  }

  readonly getAuditLog = this.effect((trigger$: Observable<string>) =>
    trigger$.pipe(
      tap(() =>
        this.patchState({
          isLoadingAuditLog: true,
          auditLog: [],
          validation: undefined,
        })
      ),
      switchMap((gridAreaId) =>
        this.gridAreaClient
          .v1MarketParticipantGridAreaGetGridAreaAuditLogEntriesGet(gridAreaId)
          .pipe(
            tapResponse(
              (rows) =>
                this.patchState({
                  auditLog: rows,
                }),
              this.handleError
            )
          )
      ),
      tap(() => this.patchState({ isLoadingAuditLog: false }))
    )
  );

  readonly saveGridAreaChanges = this.effect(
    (
      trigger: Observable<{
        gridAreaChanges: GridAreaChanges;
        onCompleted: () => void;
      }>
    ) => {
      return trigger.pipe(
        tap(() => this.patchState({ isLoading: true })),
        exhaustMap((changes) =>
          this.gridAreaClient
            .v1MarketParticipantGridAreaUpdateGridAreaNamePut({
              id: changes.gridAreaChanges.id,
              name: changes.gridAreaChanges.name,
            })
            .pipe(tapResponse(() => this.gridAreaUpdated(changes.onCompleted), this.handleError))
        )
      );
    }
  );

  private readonly gridAreaUpdated = (onCompleted: () => void) => {
    this.patchState({ isLoading: false });
    onCompleted();
  };

  private readonly handleError = (errorResponse: HttpErrorResponse) => {
    this.patchState({
      validation: {
        errorMessage: parseErrorResponse(errorResponse),
      },
      isLoading: false,
    });
  };
}
