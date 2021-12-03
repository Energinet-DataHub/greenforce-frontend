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
import { ConnectionState } from '@energinet-datahub/dh/shared/data-access-api';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { connectionStateToBadgeType } from '@energinet-datahub/dh/metering-point/domain';
import { WattBadgeType } from '@energinet-datahub/watt';

export interface MeteringPointStatus {
  badgeType: WattBadgeType;
  translationKey: string;
}

@Injectable()
export class DhMeteringPointOverviewPresenter {
  meteringPointStatus$: Observable<MeteringPointStatus> =
    this.store.meteringPoint$.pipe(
      map((meteringPoint) => meteringPoint?.connectionState),
      map((connectionState) => connectionState as ConnectionState),
      map((connectionState) => ({
        badgeType: connectionStateToBadgeType(connectionState),
        translationKey: `meteringPoint.physicalStatusCode.${connectionState}`,
      }))
    );

  constructor(private store: DhMeteringPointDataAccessApiStore) {}
}
