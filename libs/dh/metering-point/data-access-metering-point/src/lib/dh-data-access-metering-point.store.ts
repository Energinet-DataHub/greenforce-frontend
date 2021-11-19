import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LocalRouterStore } from '@ngworker/router-component-store';
import { switchMap } from 'rxjs';
import {
  MeteringPointDto,
  MeteringPointHttp,
} from '@energinet-datahub/dh/shared/data-access-api';
import { dhMeteringPointIdParam } from '@energinet-datahub/dh/metering-point/routing';

interface MeteringPointState {
  meteringPoint?: MeteringPointDto;
}

const initialState: MeteringPointState = {
  meteringPoint: undefined,
};

@Injectable()
export class DhDataAccessMeteringPointStore extends ComponentStore<MeteringPointState> {
  meteringPoint$ = this.select((state) => state.meteringPoint);

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
}
