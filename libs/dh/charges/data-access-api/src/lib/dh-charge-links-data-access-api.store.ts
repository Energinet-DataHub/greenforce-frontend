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
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import { ChargeLinkV1Dto, ChargeLinksHttp, ChargeType } from '@energinet-datahub/dh/shared/domain';

interface ChargeLinksState {
  readonly chargeLinks?: Array<ChargeLinkV1Dto>;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: ChargeLinksState = {
  chargeLinks: undefined,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhChargeLinksDataAccessApiStore extends ComponentStore<ChargeLinksState> {
  tariffs$: Observable<Array<ChargeLinkV1Dto>> = this.select((state) => state.chargeLinks).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkV1Dto>),
    map((charges) => charges.filter((charge) => charge.chargeType === ChargeType.D03))
  );

  subscriptions$: Observable<Array<ChargeLinkV1Dto>> = this.select(
    (state) => state.chargeLinks
  ).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkV1Dto>),
    map((charges) => charges.filter((charge) => charge.chargeType === ChargeType.D01))
  );

  fees$: Observable<Array<ChargeLinkV1Dto>> = this.select((state) => state.chargeLinks).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkV1Dto>),
    map((charges) => charges.filter((charge) => charge.chargeType === ChargeType.D02))
  );

  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  chargesNotFound$ = this.select((state) => state.requestState === ErrorState.NOT_FOUND_ERROR);
  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);

  constructor(private httpClient: ChargeLinksHttp) {
    super(initialState);
  }

  readonly loadChargeLinksData = this.effect((meteringPointId$: Observable<string>) => {
    return meteringPointId$.pipe(
      tap(() => {
        this.resetState();

        this.setLoading(true);
      }),
      switchMap((id) =>
        this.httpClient.v1ChargeLinksGet(id).pipe(
          tapResponse(
            (chargesData) => {
              this.setLoading(false);

              this.updateChargeLinksData(chargesData);
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

  private updateChargeLinksData = this.updater(
    (
      state: ChargeLinksState,
      chargeLinksData: Array<ChargeLinkV1Dto> | undefined
    ): ChargeLinksState => ({
      ...state,
      chargeLinks: chargeLinksData,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): ChargeLinksState => ({
      ...state,
      requestState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    const chargeLinksData = undefined;
    this.updateChargeLinksData(chargeLinksData);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
