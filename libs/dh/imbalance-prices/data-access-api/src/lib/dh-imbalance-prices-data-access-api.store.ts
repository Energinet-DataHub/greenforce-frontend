import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Observable, exhaustMap, finalize, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ApiErrorCollection } from '@energinet-datahub/dh/market-participant/data-access-api';

interface ImbalancePricesState {
  uploadInProgress: boolean;
}

const initialState: ImbalancePricesState = {
  uploadInProgress: false,
};

@Injectable()
export class DhImbalancePricesDataAccessApiStore extends ComponentStore<ImbalancePricesState> {
  private readonly httpClient = inject(HttpClient);

  readonly uploadInProgress$ = this.select((state) => state.uploadInProgress);

  readonly uploadCSV = this.effect(
    (
      trigger$: Observable<{
        file: File;
        uploadUrl: string;
        onSuccess: () => void;
        onError: (apiErrorCollection: ApiErrorCollection) => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ uploadInProgress: true })),
        exhaustMap(({ file, uploadUrl, onSuccess, onError }) => {
          const formData = new FormData();
          formData.append('csvFile', file);

          return this.httpClient.post(uploadUrl, formData).pipe(
            tapResponse(
              () => onSuccess(),
              (errorResponse: HttpErrorResponse) =>
                onError(this.createApiErrorCollection(errorResponse))
            ),
            finalize(() => this.patchState({ uploadInProgress: false }))
          );
        })
      )
  );

  constructor() {
    super(initialState);
  }

  createApiErrorCollection = (errorResponse: HttpErrorResponse): ApiErrorCollection => {
    return { apiErrors: errorResponse.error?.errors ?? [] };
  };
}
