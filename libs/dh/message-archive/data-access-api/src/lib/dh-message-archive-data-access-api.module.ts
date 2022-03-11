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
import {
  MessageArchiveHttp,
  SearchCriteria,
  SearchResultItemDto,
} from '@energinet-datahub/dh/shared/domain';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorState, SearchingState } from './states';
interface SearchResultState {
  readonly searchResult?: Array<SearchResultItemDto>;
  readonly searchingState: SearchingState | ErrorState;
  readonly continuationToken: string | null | undefined;
}

const initialState: SearchResultState = {
  searchResult: [],
  searchingState: SearchingState.INIT,
  continuationToken: null,
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
  continuationToken$: Observable<string | null | undefined> = this.select(
    (state) => state.continuationToken
  );
  isSearching$ = this.select(
    (state) => state.searchingState === SearchingState.SEARCHING
  );
  hasGeneralError$ = this.select(
    (state) => state.searchingState === ErrorState.GENERAL_ERROR
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly searchLogs = this.effect(
    (searchCriteria: Observable<SearchCriteria>) => {
      return searchCriteria.pipe(
        tap((e) => {
          this.setState({
            searchResult: [],
            searchingState: SearchingState.INIT,
            continuationToken: e.continuationToken,
          });
          this.setLoading(true);
        }),
        switchMap((searchCriteria) =>
          this.httpClient
            .v1MessageArchiveSearchRequestResponseLogsPost(searchCriteria)
            .pipe(
              tapResponse(
                (searchResult) => {
                  this.setLoading(false);
                  if (searchResult && searchResult.result) {
                    this.updateContinuationToken(
                      searchResult.continuationToken
                    );
                    this.updateSearchResult(searchResult.result);
                  } else {
                    this.updateSearchResult(new Array<SearchResultItemDto>());
                  }
                },
                (error: HttpErrorResponse) => {
                  this.setLoading(false);
                  this.handleError(error);
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

  private updateContinuationToken = this.updater(
    (
      state: SearchResultState,
      continuationToken: string | null | undefined
    ): SearchResultState => ({
      ...state,
      continuationToken: continuationToken,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): SearchResultState => ({
      ...state,
      searchingState: isLoading
        ? SearchingState.SEARCHING
        : SearchingState.DONE,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    this.updateSearchResult([]);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ searchingState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
