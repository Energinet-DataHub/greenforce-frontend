import { inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable, tap } from 'rxjs';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  UpdateUserRoleDto,
} from '@energinet-datahub/dh/shared/domain';

import { DhAdminUserRolesManagementDataAccessApiStore } from './dh-admin-user-roles-management-data-access-api.store';

interface DhEditUserRoleState {
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhEditUserRoleState = {
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserRoleEditDataAccessApiStore extends ComponentStore<DhEditUserRoleState> {
  private readonly userRolesStore = inject(
    DhAdminUserRolesManagementDataAccessApiStore
  );

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly updateUserRole = this.effect(
    (
      trigger$: Observable<{
        userRoleId: string;
        updatedUserRole: UpdateUserRoleDto;
        onSuccessFn: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => {
          this.patchState({ requestState: LoadingState.LOADING });
        }),
        exhaustMap(({ userRoleId, updatedUserRole, onSuccessFn }) =>
          this.httpClient
            .v1MarketParticipantUserRoleUpdatePut(userRoleId, updatedUserRole)
            .pipe(
              tapResponse(
                () => {
                  this.patchState({ requestState: LoadingState.LOADED });

                  this.userRolesStore.updateRoleById({
                    id: userRoleId,
                    name: updatedUserRole.name,
                  });

                  onSuccessFn();
                },
                () => {
                  this.patchState({ requestState: ErrorState.GENERAL_ERROR });
                }
              )
            )
        )
      )
  );
}
