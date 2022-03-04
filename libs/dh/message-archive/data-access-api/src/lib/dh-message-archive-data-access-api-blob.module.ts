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
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageArchiveHttp, Stream,  } from '@energinet-datahub/dh/shared/data-access-api';
import { DownloadingState } from './states';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

interface DownloadBlobResultState {
  readonly blobContent?: Stream | null;
  readonly downloadingState: DownloadingState;
}

const initialState: DownloadBlobResultState = {
  blobContent: null,
  downloadingState: DownloadingState.INIT,
};

@Injectable()
export class DhMessageArchiveDataAccessBlobApiModule extends ComponentStore<DownloadBlobResultState> {
  constructor(private httpClient: MessageArchiveHttp) {
    super(initialState);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly downloadLog = this.effect(
    (blobName: Observable<string>) => {
      return blobName.pipe(
        tap(() => {
          console.log("tap tap ?? ");
        }),
        switchMap((blobName) =>
          this.httpClient.v1MessageArchiveDownloadRequestResponseLogContentPost(blobName, "body", false, { httpHeaderAccept: "text/plain" }).pipe(
            tapResponse(
              (blobContent) => {
                alert(blobContent);
                this.updateDownloadResult(blobContent);
            },
              (error: HttpErrorResponse) => {
                //this.setLoading(false);
                console.error(error);
                //this.handleError(error);
              }
            )
          )
        )
      );
    }
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private updateDownloadResult = this.updater(
    (
      state: DownloadBlobResultState,
      downloadResult: Stream | null
    ): DownloadBlobResultState => ({
      ...state,
      blobContent: downloadResult,
    })
  );
}
