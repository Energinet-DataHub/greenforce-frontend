import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/domain';
import {
  ApiErrorDescriptor,
  GetUserRoleAuditLogsDocument,
  GetUserRolesDocument,
  UpdateUserRoleDocument,
  UpdateUserRoleDtoInput,
} from '@energinet-datahub/dh/shared/domain/graphql';

interface DhEditUserRoleState {
  readonly requestState: LoadingState | ErrorState;
  readonly errorCode: string | null;
}

const initialState: DhEditUserRoleState = {
  requestState: LoadingState.INIT,
  errorCode: null,
};

@Injectable()
export class DhAdminUserRoleEditDataAccessApiStore extends ComponentStore<DhEditUserRoleState> {
  private readonly apollo = inject(Apollo);

  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  validationError$ = this.select((state) =>
    state.requestState === ErrorState.VALIDATION_EXCEPTION ? { errorCode: state.errorCode } : null
  );

  constructor() {
    super(initialState);
  }

  readonly updateUserRole = this.effect(
    (
      trigger$: Observable<{
        userRoleId: string;
        updatedUserRole: UpdateUserRoleDtoInput;
        onSuccessFn: () => void;
        onErrorFn: (statusCode: HttpStatusCode) => void;
      }>
    ) =>
      trigger$.pipe(
        exhaustMap(({ userRoleId, updatedUserRole, onSuccessFn, onErrorFn }) =>
          this.apollo
            .mutate({
              mutation: UpdateUserRoleDocument,
              variables: {
                input: {
                  userRoleId,
                  userRole: updatedUserRole,
                },
              },
              refetchQueries: (result) => {
                if (result.data?.updateUserRole.success) {
                  return [GetUserRolesDocument, GetUserRoleAuditLogsDocument];
                }

                return [];
              },
            })
            .pipe(
              tap(({ loading }) => {
                if (loading) {
                  this.patchState({ requestState: LoadingState.LOADING });
                }
              }),
              tapResponse(
                ({ loading, data }) => {
                  if (loading) {
                    return;
                  }

                  this.patchState({ requestState: LoadingState.LOADED });

                  if (data?.updateUserRole.success) {
                    onSuccessFn();
                  }

                  if (data?.updateUserRole.errors?.length) {
                    const [firstError] = data.updateUserRole.errors;
                    const [firstApiError] = firstError.apiErrors;

                    this.handleError(firstError.statusCode, firstApiError);

                    onErrorFn(firstError.statusCode);
                  }
                },
                (error: HttpErrorResponse) => {
                  onErrorFn(error.status);
                }
              )
            )
        )
      )
  );

  private handleError(statusCode: number, firstApiError: ApiErrorDescriptor): void {
    this.patchState({
      requestState:
        statusCode === HttpStatusCode.BadRequest
          ? ErrorState.VALIDATION_EXCEPTION
          : ErrorState.GENERAL_ERROR,
      errorCode: statusCode === HttpStatusCode.BadRequest ? firstApiError.code : null,
    });
  }
}
