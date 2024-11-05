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
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Observable, exhaustMap, finalize, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ApiErrorCollection } from '@energinet-datahub/dh/market-participant/data-access-api';

interface EsettState {
  uploadInProgress: boolean;
}

const initialState: EsettState = {
  uploadInProgress: false,
};

@Injectable()
export class DhEsettDataAccessApiStore extends ComponentStore<EsettState> {
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
