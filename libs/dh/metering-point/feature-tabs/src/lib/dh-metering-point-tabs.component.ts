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
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';

import { WattTabsComponent, WattTabComponent } from '@energinet-datahub/watt/tabs';
import { DhIsParentPipe } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

import { DhChargesTabContentComponent } from './charges-tab-content/dh-charges-tab-content.component';
import { DhChildMeteringPointsTabContentComponent } from './child-metering-points-tab-content/dh-child-metering-points-tab-content.component';
import { DhProcessesTabContentComponent } from './processes-tab-content/dh-processes-tab-content.component';

@Component({
  selector: 'dh-metering-point-tabs',
  templateUrl: './dh-metering-point-tabs.template.html',
  standalone: true,
  imports: [
    RxLet,
    CommonModule,
    WattTabsComponent,
    WattTabComponent,
    TranslocoModule,
    DhIsParentPipe,
    DhChargesTabContentComponent,
    DhProcessesTabContentComponent,
    DhChildMeteringPointsTabContentComponent,
  ],
})
export class DhMeteringPointTabsComponent {
  private store = inject(DhMeteringPointDataAccessApiStore);
  childMeteringPointsCount = 0;

  meteringPoint$ = this.store.meteringPoint$.pipe(
    tap((meteringPoint) => {
      this.childMeteringPointsCount = meteringPoint.childMeteringPoints?.length ?? 0;
    })
  );
}
