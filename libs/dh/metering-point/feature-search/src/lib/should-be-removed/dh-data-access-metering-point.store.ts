import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LocalRouterStore } from '@ngworker/router-component-store';
import { map, Observable, switchMap } from 'rxjs';
import {
  MeteringPointDto,
  MeteringPointHttp,
} from '@energinet-datahub/dh/shared/data-access-api';
import { dhMeteringPointIdParam } from '@energinet-datahub/dh/metering-point/routing';
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

  constructor(
    private httpClient: MeteringPointHttp,
  ) {
    super(initialState);
  }

  readonly loadMeteringPointData = this.effect((meteringPointId: Observable<string>) => {
    return meteringPointId.pipe(
      switchMap(
        (id) => this.httpClient.v1MeteringPointGetByGsrnGet(id).pipe(
          tapResponse(
            (meteringPointData) =>
              this.updateMeteringPointData(meteringPointData),
            (error: HttpErrorResponse) => this.handleError(error)
          )
        )
      ),
    );
  });

  private handleError = this.updater(
    (
      _: MeteringPointState,
      error: HttpErrorResponse
    ): MeteringPointState => {
      if(error.status === 404) {
        return {
          meteringPoint: undefined,
          hasError: false,
          notFound: true,
          isLoading: false,
        }
      } else {
        return {
          meteringPoint: undefined,
          hasError: true,
          notFound: false,
          isLoading: false,
        }
      }
    }
  )

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
