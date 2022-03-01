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
 import { filter, map, Observable, switchMap, tap } from 'rxjs';
 import { MessageArchiveHttp, SearchCriteria, SearchResultItemDto } from '@energinet-datahub/dh/shared/data-access-api';
 import { HttpErrorResponse } from '@angular/common/http';
 import { SearchingState } from './states';
interface SearchResultState {
  readonly searchResult?: Array<SearchResultItemDto>;
  readonly searchingState: SearchingState;
}

const initialState: SearchResultState = {
  searchResult: [],
  searchingState: SearchingState.INIT,
};

@Injectable()
export class DhMessageArchiveDataAccessApiModule extends ComponentStore<SearchResultState> {
  constructor(private httpClient: MessageArchiveHttp) {
    super(initialState);
  }

  searchResult$: Observable<Array<SearchResultItemDto>> = this.select(
    (state) => state.searchResult
  ).pipe(
    filter((searchResult) => !!searchResult),
    map((searchResult) => searchResult as Array<SearchResultItemDto>)
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly searchLogs = this.effect(
    (searchCriteria: Observable<SearchCriteria>) => {
      return searchCriteria.pipe(
        tap(() => {
          console.log("tap tap ?? ");
        }),
        switchMap((searchCriteria) =>
          this.httpClient.v1MessageArchiveSearchRequestResponseLogsPost(searchCriteria).pipe(
            tapResponse(
              (searchResult) => {
                if(searchResult && searchResult.result) {
                  this.updateSearchResult(searchResult.result);
                }
                else {
                  this.updateSearchResult(new Array<SearchResultItemDto>());
                }
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
  private updateSearchResult = this.updater(
    (
      state: SearchResultState,
      searchResult: Array<SearchResultItemDto> | []
    ): SearchResultState => ({
      ...state,
      searchResult: searchResult,
    })
  );

}
