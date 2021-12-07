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
import { map, Observable } from 'rxjs';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

export interface MeteringPointOverviewTranslationKeys {
  settlementMethod: string;
  meteringMethod: string;
  meteringPointType: string;
  readingOccurrence: string;
}

@Injectable()
export class DhMeteringPointPresenter {
  translationKeys$: Observable<MeteringPointOverviewTranslationKeys> =
    this.store.meteringPoint$.pipe(
      map((meteringPoint) => {
        const settlementMethod = `meteringPoint.settlementMethodCode.${meteringPoint?.settlementMethod}`;
        const meteringPointType = `meteringPoint.meteringPointTypeCode.${meteringPoint?.meteringPointType}`;
        const meteringMethod = `meteringPoint.meteringPointSubTypeCode.${meteringPoint?.meteringMethod}`;
        const readingOccurrence = `meteringPoint.readingOccurrenceCode.${meteringPoint?.readingOccurrence}`;

        return {
          meteringPointType,
          meteringMethod,
          settlementMethod,
          readingOccurrence,
        };
      })
    );

  constructor(private store: DhMeteringPointDataAccessApiStore) {}
}
