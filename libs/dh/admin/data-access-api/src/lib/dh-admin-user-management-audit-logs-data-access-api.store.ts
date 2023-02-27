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
import { Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserHttp,
  UserAuditLogsDto,
  UserAuditLogDto,
} from '@energinet-datahub/dh/shared/domain';

export interface DhUserAuditLogEntry {
  readonly timestamp: string;
  readonly entry: UserAuditLogDto;
}

interface DhUserManagementAuditLogsState {
  readonly auditLogs: DhUserAuditLogEntry[];
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserManagementAuditLogsState = {
  auditLogs: [],
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserManagementAuditLogsDataAccessApiStore extends ComponentStore<DhUserManagementAuditLogsState> {
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);

  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);

  auditLogs$ = this.select((state) => state.auditLogs);
  auditLogCount$ = this.select((state) => state.auditLogs.length);

  constructor(private httpClient: MarketParticipantUserHttp) {
    super(initialState);
  }

  readonly getAuditLogs = this.effect((userId$: Observable<string>) =>
    userId$.pipe(
      withLatestFrom(this.state$),
      tap(() => {
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap(([userId]) =>
        this.httpClient.v1MarketParticipantUserGetUserAuditLogsGet(userId).pipe(
          tapResponse(
            (response) => {
              this.assignAuditLogs(response);
              this.setLoading(LoadingState.LOADED);
            },
            () => {
              this.handleError();
            }
          )
        )
      )
    )
  );

  private assignAuditLogs = (response: UserAuditLogsDto) => {
    const auditLogs = response.userAuditLogs.map((entry) => ({
      entry,
      timestamp: entry.timestamp,
    }));

    this.patchState({ auditLogs });
  };

  private setLoading = (state: LoadingState) => {
    this.patchState({ requestState: state });
  };

  private handleError = () => {
    this.assignAuditLogs({ userAuditLogs: [] });
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };
}
