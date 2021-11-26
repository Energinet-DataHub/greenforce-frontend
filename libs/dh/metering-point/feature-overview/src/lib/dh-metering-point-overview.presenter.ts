import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { connectionStateToBadgeType } from '@energinet-datahub/dh/metering-point/domain';
import { WattBadgeType } from '@energinet-datahub/watt';

export interface MeteringPointStatus {
  badgeType: WattBadgeType;
  text: string;
}

@Injectable()
export class DhMeteringPointOverviewPresenter {
  meteringPointStatus$: Observable<MeteringPointStatus> =
    this.store.meteringPoint$.pipe(
      map((meteringPoint) => meteringPoint?.connectionState),
      map((connectionState) => connectionState as string),
      map((connectionState) => ({
        badgeType: connectionStateToBadgeType(connectionState),
        text: connectionState,
      }))
    );

  constructor(private store: DhMeteringPointDataAccessApiStore) {}
}
