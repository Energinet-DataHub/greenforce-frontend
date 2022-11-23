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
  MarketParticipantV1Dto,
  ChargesHttp,
} from '@energinet-datahub/dh/shared/domain';
import { Observable, switchMap, tap } from 'rxjs';
import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';

interface MarketParticipantState {
  readonly marketParticipants?: Array<MarketParticipantV1Dto>;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: MarketParticipantState = {
  marketParticipants: undefined,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhMarketParticipantDataAccessApiStore extends ComponentStore<MarketParticipantState> {
  all$ = this.select((state) => state.marketParticipants);

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: ChargesHttp) {
    super(initialState);
  }

  readonly loadMarketParticipants = this.effect(
    (trigger$: Observable<void>) => {
      return trigger$.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(LoadingState.LOADING);
        }),
        switchMap(() =>
          this.httpClient.v1ChargesGetMarketParticipantsAsyncGet().pipe(
            tapResponse(
              (marketParticipants) => {
                this.setLoading(LoadingState.LOADED);

                this.updateMarketParticipantsData(marketParticipants);
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

  private updateMarketParticipantsData = this.updater(
    (
      state: MarketParticipantState,
      marketParticipants: Array<MarketParticipantV1Dto> | undefined
    ): MarketParticipantState => ({
      ...state,
      marketParticipants: marketParticipants || [],
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): MarketParticipantState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    this.updateMarketParticipantsData(undefined);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
