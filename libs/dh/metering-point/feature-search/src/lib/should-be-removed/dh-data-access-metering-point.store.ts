/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { map, Observable, switchMap } from 'rxjs';
import {
  MeteringPointDto,
  MeteringPointHttp,
} from '@energinet-datahub/dh/shared/data-access-api';
import { WattBadgeType } from '@energinet-datahub/watt';

import { connectionStateToBadgeType } from './connection-state-to-badge-type';
import { HttpErrorResponse } from '@angular/common/http';

interface MeteringPointState {
  meteringPoint?: MeteringPointDto;
  isLoading: boolean;
  hasError: boolean;
  notFound: boolean;
}

export interface MeteringPointStatus {
  badgeType: WattBadgeType;
  value: string;
}

const initialState: MeteringPointState = {
  meteringPoint: undefined,
  isLoading: false,
  hasError: false,
  notFound: false,
};

@Injectable()
export class DhDataAccessMeteringPointStore extends ComponentStore<MeteringPointState> {
  meteringPoint$ = this.select((state) => state.meteringPoint);
  meteringPointStatus$: Observable<MeteringPointStatus> = this.select(
    (state) => state.meteringPoint
  ).pipe(
    map((meteringPoint) => meteringPoint?.connectionState),
    map((connectionState) => connectionState as string),
    map((connectionState) => ({
      badgeType: connectionStateToBadgeType(connectionState),
      value: connectionState,
    }))
  );

  constructor(private httpClient: MeteringPointHttp) {
    super(initialState);
  }

  readonly loadMeteringPointData = this.effect(
    (meteringPointId: Observable<string>) => {
      return meteringPointId.pipe(
        switchMap((id) =>
          this.httpClient.v1MeteringPointGetByGsrnGet(id).pipe(
            tapResponse(
              (meteringPointData) =>
                this.updateMeteringPointData(meteringPointData),
              (error: HttpErrorResponse) => this.handleError(error)
            )
          )
        )
      );
    }
  );

  private handleError = this.updater(
    (_: MeteringPointState, error: HttpErrorResponse): MeteringPointState => {
      if (error.status === 404) {
        return {
          meteringPoint: undefined,
          hasError: false,
          notFound: true,
          isLoading: false,
        };
      } else {
        return {
          meteringPoint: undefined,
          hasError: true,
          notFound: false,
          isLoading: false,
        };
      }
    }
  );

  private updateMeteringPointData = this.updater(
    (
      state: MeteringPointState,
      meteringPointData: MeteringPointDto | undefined
    ): MeteringPointState => ({
      ...state,
      meteringPoint: meteringPointData,
      isLoading: false,
      hasError: false,
      notFound: false,
    })
  );
}
