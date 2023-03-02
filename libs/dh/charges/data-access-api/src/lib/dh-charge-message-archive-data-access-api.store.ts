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
import { Observable, switchMap, tap } from 'rxjs';
import {
  MessageArchiveHttp,
  MessageArchiveSearchCriteria,
  MessageArchiveSearchResultItemDto,
} from '@energinet-datahub/dh/shared/domain';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';

interface SearchResultState {
  readonly searchResult?: MessageArchiveSearchResultItemDto;
  readonly searchingState: LoadingState | ErrorState;
}

const initialState: SearchResultState = {
  searchResult: undefined,
  searchingState: LoadingState.INIT,
};

@Injectable()
export class DhChargeMessageArchiveDataAccessStore extends ComponentStore<SearchResultState> {
  constructor(private httpClient: MessageArchiveHttp) {
    super(initialState);
  }

  searchResult$ = this.select((state) => state.searchResult);
  isSearching$ = this.select((state) => state.searchingState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.searchingState === ErrorState.GENERAL_ERROR);

  readonly searchLogs = this.effect((searchCriteria: Observable<MessageArchiveSearchCriteria>) => {
    return searchCriteria.pipe(
      tap(() => {
        this.setLoading(true);
        this.updateSearchResult([]);
      }),
      switchMap((searchCriteria) =>
        this.httpClient.v1MessageArchiveSearchRequestResponseLogsPost(searchCriteria).pipe(
          tapResponse(
            (searchResult) => {
              this.setLoading(false);
              this.updateSearchResult(searchResult.result);
            },
            (error: HttpErrorResponse) => {
              this.setLoading(false);
              this.handleError(error);
            }
          )
        )
      )
    );
  });

  private updateSearchResult = this.updater(
    (
      state: SearchResultState,
      searchResult: Array<MessageArchiveSearchResultItemDto>
    ): SearchResultState => {
      return {
        ...state,
        searchResult: searchResult[0],
      };
    }
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): SearchResultState => ({
      ...state,
      searchingState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
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

  readonly resetState = () => this.setState(initialState);
}
