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
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { filter, Observable, tap, switchMap } from 'rxjs';

import {
  MessageArchiveHttp,
  ArchivedMessage,
  ArchivedMessageSearchCriteria,
} from '@energinet-datahub/dh/shared/domain';
import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
interface SearchResultState {
  readonly searchResult: Array<ArchivedMessage>;
  readonly loadingState: LoadingState | ErrorState;
  readonly continuationToken: string | null | undefined;
}

const initialState: SearchResultState = {
  searchResult: [],
  loadingState: LoadingState.INIT,
  continuationToken: null,
};

@Injectable()
export class DhMessageArchiveDataAccessApiStore extends ComponentStore<SearchResultState> {
  constructor(private httpClient: MessageArchiveHttp) {
    super(initialState);
  }

  isInit$ = this.select((state) => state.loadingState === LoadingState.INIT);

  searchResult$: Observable<Array<ArchivedMessage>> = this.select(
    (state) => state.searchResult as Array<ArchivedMessage>
  ).pipe(filter((searchResult) => !!searchResult));

  continuationToken$: Observable<string | null | undefined> = this.select(
    (state) => state.continuationToken
  );
  isSearching$ = this.select((state) => state.loadingState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.loadingState === ErrorState.GENERAL_ERROR);

  readonly searchLogs = this.effect((searchCriteria: Observable<ArchivedMessageSearchCriteria>) => {
    return searchCriteria.pipe(
      tap(() => {
        this.setLoading(true);
        this.updateSearchResult([]);
      }),
      switchMap((searchCriteria) => {
        return this.httpClient.v1MessageArchiveSearchRequestResponseLogsPost(searchCriteria).pipe(
          tapResponse(
            (searchResult) => {
              this.setLoading(false);
              this.updateSearchResult(searchResult?.messages ?? []);
            },
            (error: HttpErrorResponse) => {
              this.setLoading(false);
              this.handleError(error);
            }
          )
        );
      })
    );
  });

  private updateSearchResult = this.updater(
    (state: SearchResultState, searchResult: Array<ArchivedMessage> | []): SearchResultState => {
      return {
        ...state,
        searchResult: state.continuationToken
          ? state.searchResult.concat(searchResult)
          : searchResult,
      };
    }
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
      loadingState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    this.updateSearchResult([]);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ loadingState: requestError });
  };

  readonly resetState = () => this.setState(initialState);
}
