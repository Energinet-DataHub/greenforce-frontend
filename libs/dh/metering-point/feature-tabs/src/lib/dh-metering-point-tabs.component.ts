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
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { LetModule } from '@rx-angular/template';
import { TranslocoModule } from '@ngneat/transloco';

import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import { DhIsParentPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

import { DhChargesTabContentScam } from './charges-tab-content/dh-charges-tab-content.component';
import { DhChildMeteringPointsTabContentScam } from './child-metering-points-tab-content/dh-child-metering-points-tab-content.component';
import { DhProcessesTabContentScam } from './processes-tab-content/dh-processes-tab-content.component';

@Component({
  selector: 'dh-metering-point-tabs',
  templateUrl: './dh-metering-point-tabs.template.html',
})
export class DhMeteringPointTabsComponent {
  childMeteringPointsCount = 0;

  meteringPoint$ = this.store.meteringPoint$.pipe(
    tap((meteringPoint) => {
      this.childMeteringPointsCount =
        meteringPoint.childMeteringPoints?.length ?? 0;
    })
  );

  constructor(private store: DhMeteringPointDataAccessApiStore) {}
}

@NgModule({
  declarations: [DhMeteringPointTabsComponent],
  exports: [DhMeteringPointTabsComponent],
  imports: [
    LetModule,
    CommonModule,
    WattTabsModule,
    TranslocoModule,
    DhIsParentPipeScam,
    DhChargesTabContentScam,
    DhProcessesTabContentScam,
    DhChildMeteringPointsTabContentScam,
  ],
})
export class DhMeteringPointTabsScam {}
