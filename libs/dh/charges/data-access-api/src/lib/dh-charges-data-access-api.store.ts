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
import { ChargeV1Dto, ChargesHttp } from '@energinet-datahub/dh/shared/domain';
import { Observable, switchMap, tap, map, filter } from 'rxjs';

interface ChargesState {
  readonly charges?: Array<ChargeV1Dto>;
  readonly isLoading: boolean;
}

const initialState: ChargesState = {
  charges: undefined,
  isLoading: false,
};

@Injectable()
export class DhChargesDataAccessApiStore extends ComponentStore<ChargesState> {
  all$ = this.select((state) => state.charges);
  isLoading$ = this.select((state) => state.isLoading);

  constructor(private httpClient: ChargesHttp) {
    super(initialState);
  }

  readonly loadChargesData = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => {
        this.resetState();

        this.setLoading(true);
      }),
      switchMap(() =>
        this.httpClient.v1ChargesGet().pipe(
          tapResponse(
            (chargesData) => {
              this.setLoading(false);

              this.updateChargesData(chargesData);
            },
            (error: HttpErrorResponse) => {
              this.setLoading(false);
            }
          )
        )
      )
    );
  });

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
      isLoading: isLoading,
    })
  );

  private resetState = () => this.setState(initialState);
}
