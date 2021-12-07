import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

export interface MeteringPointOverviewTranslationKeys {
  settlementMethod: string;
  meteringMethod: string;
  meteringPointType: string;
}

@Injectable()
export class DhMeteringPointPresenter {
  translationKeys$: Observable<MeteringPointOverviewTranslationKeys> =
    this.store.meteringPoint$.pipe(
      map((meteringPoint) => {
        const settlementMethod = `meteringPoint.settlementMethodCode.${meteringPoint?.settlementMethod}`;
        const meteringPointType = `meteringPoint.meteringPointTypeCode.${meteringPoint?.meteringPointType}`;
        const meteringMethod = `meteringPoint.meteringPointSubTypeCode.${meteringPoint?.meteringMethod}`;

        return {
          meteringPointType,
          meteringMethod,
          settlementMethod,
        };
      })
    );

  constructor(private store: DhMeteringPointDataAccessApiStore) {}
}
