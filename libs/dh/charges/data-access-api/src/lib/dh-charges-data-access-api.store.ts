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
import {
  ChargeV1Dto,
  ChargesHttp,
  SearchCriteriaV1Dto,
} from '@energinet-datahub/dh/shared/domain';
import { Observable, switchMap, tap } from 'rxjs';
import { ErrorState, LoadingState } from './states';

interface ChargesState {
  readonly charges?: Array<ChargeV1Dto>;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: ChargesState = {
  charges: undefined,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhChargesDataAccessApiStore extends ComponentStore<ChargesState> {
  all$ = this.select((state) => state.charges);

  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  chargesNotFound$ = this.select(
    (state) => state.requestState === ErrorState.NOT_FOUND_ERROR
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: ChargesHttp) {
    super(initialState);
  }

  readonly searchCharges = this.effect(
    (searchCriteria: Observable<SearchCriteriaV1Dto>) => {
      return searchCriteria.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(true);
        }),
        switchMap((searchCriteria) =>
          this.httpClient.v1ChargesSearchAsyncPost(searchCriteria).pipe(
            tapResponse(
              (chargesData) => {
                this.setLoading(false);

                this.updateChargesData(chargesData);
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

  private updateChargesData = this.updater(
    (
      state: ChargesState,
      chargesData: Array<ChargeV1Dto> | undefined
    ): ChargesState => ({
      ...state,
      charges: chargesData || [],
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): ChargesState => ({
      ...state,
      requestState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    const chargesData = undefined;
    this.updateChargesData(chargesData);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
