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
  ChargePricesSearchCriteriaV1Dto,
  ChargePriceV1Dto,
  ChargesHttp,
} from '@energinet-datahub/dh/shared/domain';
import { Observable, switchMap, tap } from 'rxjs';
import { ErrorState, LoadingState } from './states';

interface ChargePricesState {
  readonly chargePrices?: Array<ChargePriceV1Dto>;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: ChargePricesState = {
  chargePrices: undefined,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhChargePricesDataAccessApiStore extends ComponentStore<ChargePricesState> {
  all$ = this.select((state) => state.chargePrices);

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  chargePricesNotFound$ = this.select(
    (state) => state.requestState === ErrorState.NOT_FOUND_ERROR
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: ChargesHttp) {
    super(initialState);
  }

  readonly searchChargePrices = this.effect(
    (searchCriteria: Observable<ChargePricesSearchCriteriaV1Dto>) => {
      return searchCriteria.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(LoadingState.LOADING);
        }),
        switchMap((searchCriteria) =>
          this.httpClient
            .v1ChargesSearchChargePricesAsyncPost(searchCriteria)
            .pipe(
              tapResponse(
                (chargePrices) => {
                  this.setLoading(LoadingState.LOADED);

                  this.updateChargePrices(chargePrices);
                },
                (error: HttpErrorResponse) => {
                  this.setLoading(LoadingState.LOADED);
                  this.handleError(error);
                }
              )
            )
        )
      );
    }
  );

  private updateChargePrices = this.updater(
    (
      state: ChargePricesState,
      chargePrices: Array<ChargePriceV1Dto> | undefined
    ): ChargePricesState => ({
      ...state,
      chargePrices: chargePrices || [],
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): ChargePricesState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    const chargesPrices = undefined;
    this.updateChargePrices(chargesPrices);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  readonly clearChargePrices = () => {
    this.setLoading(LoadingState.INIT);
    this.updateChargePrices([]);
  };
  private resetState = () => this.setState(initialState);
}
