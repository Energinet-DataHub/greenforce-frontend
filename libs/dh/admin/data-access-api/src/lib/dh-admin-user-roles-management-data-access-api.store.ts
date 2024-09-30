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
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, combineLatestWith, filter, map, of, switchMap } from 'rxjs';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Apollo } from 'apollo-angular';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { GetUserRolesDocument, UserRoleStatus } from '@energinet-datahub/dh/shared/domain/graphql';

type UserRoleItem = ResultOf<typeof GetUserRolesDocument>['userRoles'][0];

interface DhUserRolesManagementState {
  readonly roles: UserRoleItem[];
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserRolesManagementState = {
  roles: [],
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserRolesManagementDataAccessApiStore
  extends ComponentStore<DhUserRolesManagementState>
  implements OnStoreInit
{
  private readonly transloco = inject(TranslocoService);
  private readonly apollo = inject(Apollo);

  private getUserRolesQuery = this.apollo.watchQuery({
    query: GetUserRolesDocument,
  });

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);

  activeUserRoleOptions$: Observable<WattDropdownOptions> = of([]);

  constructor() {
    super(initialState);
  }

  readonly getRoles = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      switchMap(() =>
        this.getUserRolesQuery.valueChanges.pipe(
          tapResponse(
            (response) => {
              if (response.loading) {
                this.setLoading(LoadingState.LOADING);
                this.updateUserRoles([]);
                return;
              }

              if (response.data?.userRoles) {
                this.setLoading(LoadingState.LOADED);
                this.updateUserRoles(response.data?.userRoles ?? []);
              }

              if (response?.error || response?.errors) {
                this.handleError();
              }
            },
            () => {
              this.setLoading(LoadingState.LOADED);
              this.handleError();
            }
          )
        )
      )
    )
  );

  private updateUserRoles = this.updater(
    (state: DhUserRolesManagementState, response: UserRoleItem[]): DhUserRolesManagementState => ({
      ...state,
      roles: response,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): DhUserRolesManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateUserRoles([]);
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  ngrxOnStoreInit(): void {
    this.activeUserRoleOptions$ = this.transloco
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(
        combineLatestWith(this.select((state) => state.roles)),
        filter(([, roles]) => roles.length > 0),
        // eslint-disable-next-line @ngrx/avoid-mapping-component-store-selectors
        map(([keys, roles]) =>
          roles
            .filter((x) => x.status === UserRoleStatus.Active)
            .map((role: UserRoleItem) => ({
              displayValue: `${role.name} (${keys[role.eicFunction]})`,
              value: role.id,
            }))
        )
      );

    this.getRoles();
  }
}
