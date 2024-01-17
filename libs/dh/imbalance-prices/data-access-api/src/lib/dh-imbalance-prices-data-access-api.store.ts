import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, exhaustMap, finalize, tap } from 'rxjs';

import { ImbalancePricesHttp } from '@energinet-datahub/dh/shared/domain';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorCollection } from '@energinet-datahub/dh/market-participant/data-access-api';

interface ImbalancePricesState {
  uploadInProgress: boolean;
}

const initialState: ImbalancePricesState = {
  uploadInProgress: false,
};

@Injectable()
export class DhImbalancePricesDataAccessApiStore extends ComponentStore<ImbalancePricesState> {
  private readonly httpClient = inject(ImbalancePricesHttp);

  readonly uploadInProgress$ = this.select((state) => state.uploadInProgress);

  readonly uploadCSV = this.effect(
    (
      trigger$: Observable<{
        file: File;
        onSuccess: () => void;
        onError: (apiErrorCollection: ApiErrorCollection) => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ uploadInProgress: true })),
        exhaustMap(({ file, onSuccess, onError }) =>
          this.httpClient.v1ImbalancePricesUploadImbalanceCSVPost(file).pipe(
            tapResponse(
              () => onSuccess(),
              (errorResponse: HttpErrorResponse) =>
                onError(this.createApiErrorCollection(errorResponse))
            ),
            finalize(() => this.patchState({ uploadInProgress: false }))
          )
        )
      )
  );

  constructor() {
    super(initialState);
  }

  createApiErrorCollection = (errorResponse: HttpErrorResponse): ApiErrorCollection => {
    return { apiErrors: errorResponse.error?.errors ?? [] };
  };
}
