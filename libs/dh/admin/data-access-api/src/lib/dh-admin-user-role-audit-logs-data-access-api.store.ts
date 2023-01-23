import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  UserRoleAuditLogDto,
  UserRoleAuditLogsDto,
} from '@energinet-datahub/dh/shared/domain';

export interface DhRoleAuditLogEntry {
  readonly timestamp: string;
  readonly entry: UserRoleAuditLogDto;
}

interface DhUserRoleAuditLogsState {
  readonly auditLogs: DhRoleAuditLogEntry[];
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserRoleAuditLogsState = {
  auditLogs: [],
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserRoleAuditLogsDataAccessApiStore extends ComponentStore<DhUserRoleAuditLogsState> {
  readonly isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );

  readonly hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  readonly auditLogs$ = this.select((state) => state.auditLogs);
  readonly auditLogCount$ = this.select((state) => state.auditLogs.length);

  constructor(private httpClient: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly getAuditLogs = this.effect((userRoleId$: Observable<string>) =>
    userRoleId$.pipe(
      tap(() => {
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap((userRoleId) =>
        this.httpClient
          .v1MarketParticipantUserRoleGetUserRoleAuditLogsGet(userRoleId)
          .pipe(
            tapResponse(
              () => {
                const response = { auditLogs: [] };

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

  private assignAuditLogs = (response: UserRoleAuditLogsDto) => {
    const auditLogs = response.auditLogs.map((entry) => ({
      entry,
      timestamp: entry.timestamp,
    }));

    this.patchState({ auditLogs });
  };

  private setLoading = (state: LoadingState) => {
    this.patchState({ requestState: state });
  };

  private handleError = () => {
    this.assignAuditLogs({ auditLogs: [] });
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };
}
