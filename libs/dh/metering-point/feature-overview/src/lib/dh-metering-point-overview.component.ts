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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { LocalRouterStore } from '@ngworker/router-component-store';
import { CommonModule } from '@angular/common';
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { LetModule } from '@rx-angular/template';
import { map } from 'rxjs';

import { DhBreadcrumbScam } from './breadcrumb/dh-breadcrumb.component';
import { dhMeteringPointIdParam } from './routing/dh-metering-point-id-param';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-overview',
  styleUrls: ['./dh-metering-point-overview.component.scss'],
  templateUrl: './dh-metering-point-overview.component.html',
  providers: [DhMeteringPointDataAccessApiStore, LocalRouterStore],
})
export class DhMeteringPointOverviewComponent {
  meteringPoint$ = this.store.meteringPoint$;

  constructor(
    private route: LocalRouterStore,
    private store: DhMeteringPointDataAccessApiStore
  ) {
    this.loadMeteringPointData();
  }

  private loadMeteringPointData(): void {
    this.route
      .selectRouteParam<string>(dhMeteringPointIdParam)
      .pipe(
        map((meteringPointId) =>
          this.store.loadMeteringPointData(meteringPointId)
        )
      )
      .subscribe();
  }
}

@NgModule({
  declarations: [DhMeteringPointOverviewComponent],
  imports: [CommonModule, LetModule, DhBreadcrumbScam, WattSpinnerModule],
})
export class DhMeteringPointOverviewScam {}
