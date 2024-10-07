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
import { inject, Injectable } from '@angular/core';
import { Observable, exhaustMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Apollo, MutationResult } from 'apollo-angular';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/domain';
import {
  CreateUserRoleDocument,
  CreateUserRoleDtoInput,
  CreateUserRoleMutation,
  GetUserRolesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

interface DhCreateUserRoleState {
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhCreateUserRoleState = {
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhCreateUserRoleStore extends ComponentStore<DhCreateUserRoleState> {
  private readonly apollo = inject(Apollo);

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);

  constructor() {
    super(initialState);
  }

  readonly createUserRole = this.effect(
    (
      trigger$: Observable<{
        createUserRoleDto: CreateUserRoleDtoInput;
        onSuccessFn: () => void;
        onErrorFn: () => void;
      }>
    ) => {
      return trigger$.pipe(
        tap(() => {
          this.setLoading(LoadingState.INIT);
        }),
        exhaustMap(({ createUserRoleDto, onSuccessFn, onErrorFn }) => {
          return this.apollo
            .mutate({
              mutation: CreateUserRoleDocument,
              variables: {
                input: {
                  userRole: createUserRoleDto,
                },
              },
              refetchQueries: (result) => {
                if (this.isUpdateSuccessful(result.data)) {
                  return [GetUserRolesDocument];
                }

                return [];
              },
            })
            .pipe(
              tapResponse(
                ({ loading, data }) => {
                  if (loading) {
                    this.setLoading(LoadingState.LOADING);
                    return;
                  }

                  if (data?.createUserRole.success) {
                    this.setLoading(LoadingState.LOADED);

                    onSuccessFn();
                  }

                  if (data?.createUserRole.errors?.length) {
                    this.setLoading(ErrorState.GENERAL_ERROR);

                    onErrorFn();
                  }
                },
                () => {
                  this.setLoading(ErrorState.GENERAL_ERROR);

                  onErrorFn();
                }
              )
            );
        })
      );
    }
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState | ErrorState): DhCreateUserRoleState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private isUpdateSuccessful(
    mutationResult: MutationResult<CreateUserRoleMutation>['data']
  ): boolean {
    return !mutationResult?.createUserRole.errors?.length;
  }
}
