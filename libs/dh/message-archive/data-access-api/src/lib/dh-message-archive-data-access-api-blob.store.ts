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
import { ComponentStore } from '@ngrx/component-store';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MessageArchiveHttp, Stream } from '@energinet-datahub/dh/shared/domain';
import { LoadingState, ErrorState } from '@energinet-datahub/dh/shared/data-access-api';
import { filter, Observable, tap } from 'rxjs';

interface DownloadBlobResultState {
  readonly blobContent?: Stream | null;
  readonly loadingState: LoadingState | ErrorState;
}

const initialState: DownloadBlobResultState = {
  blobContent: null,
  loadingState: LoadingState.INIT,
};

@Injectable()
export class DhMessageArchiveDataAccessBlobApiStore extends ComponentStore<DownloadBlobResultState> {
  constructor(private httpClient: MessageArchiveHttp) {
    super(initialState);
  }

  blobContent$: Observable<Stream> = this.select((state) => state.blobContent as Stream).pipe(
    filter((searchResult) => !!searchResult));
  isDownloading$ = this.select((state) => state.loadingState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.loadingState === ErrorState.GENERAL_ERROR);

  readonly downloadLog = this.effect((logName$: Observable<string>) => {
    return logName$.pipe(
      tap(() => {
        this.resetState();
        this.setLoading(true);
      })
    );
  });

  GetDocument(id: string, document: Document) {
    return this.httpClient.v1MessageArchiveIdDocumentGet(id).subscribe({
      next: (data) => {
        const blobPart = data as unknown as BlobPart;
        const blob = new Blob([blobPart], { type: 'application/zip' });
        const basisData = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = basisData;
        link.download = `${id}.zip`;
        link.click();
        link.remove();
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error);
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private updateDownloadResult = this.updater(
    (state: DownloadBlobResultState, downloadResult: Stream | null): DownloadBlobResultState => ({
      ...state,
      blobContent: downloadResult,
    })
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private setLoading = this.updater(
    (state, isLoading: boolean): DownloadBlobResultState => ({
      ...state,
      loadingState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    this.updateDownloadResult(null);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ loadingState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
