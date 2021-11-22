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

interface MeteringPointState {
  meteringPoint?: MeteringPointDto;
}

export interface MeteringPointStatus {
  badgeType: WattBadgeType;
  value: string;
}

enum ConnectionState {
  'NotUsed' = 'Not used',
  'ClosedDown' = 'Closed down',
  'New' = 'New',
  'Connected' = 'Connected',
  'Disconnected' = 'Disconnected',
}

const initialState: MeteringPointState = {
  meteringPoint: undefined,
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
      badgeType: this.connectionStateToBadgeType(connectionState),
      value: connectionState,
    }))
  );

  constructor(
    private httpClient: MeteringPointHttp,
    private route: LocalRouterStore
  ) {
    super(initialState);
  }

  loadMeteringPointData = this.effect(() => {
    return this.route.selectRouteParam<string>(dhMeteringPointIdParam).pipe(
      switchMap((meteringPointId: string) =>
        this.httpClient.v1MeteringPointGetByGsrnGet(meteringPointId).pipe(
          tapResponse(
            (meteringPointData) =>
              this.updateMeteringPointData(meteringPointData),
            () => this.updateMeteringPointData(undefined)
          )
        )
      )
    );
  });

  private updateMeteringPointData = this.updater(
    (
      state: MeteringPointState,
      meteringPointData: MeteringPointDto | undefined
    ): MeteringPointState => ({
      ...state,
      meteringPoint: meteringPointData,
    })
  );

  private connectionStateToBadgeType(connectionState: string): WattBadgeType {
    switch (connectionState) {
      case ConnectionState['ClosedDown']:
      case ConnectionState['Disconnected']:
      case ConnectionState['NotUsed']:
        return 'warning';
      case ConnectionState['Connected']:
      case ConnectionState['New']:
        return 'success';
      default:
        throw new Error('Connection state cannot be empty');
    }
  }
}
