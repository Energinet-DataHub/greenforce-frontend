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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { LocalRouterStore } from '@ngworker/router-component-store';
import { map } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattBadgeModule,
  WattButtonModule,
  WattSpinnerModule,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

import { DhBreadcrumbScam } from './breadcrumb/dh-breadcrumb.component';
import { dhMeteringPointIdParam } from './routing/dh-metering-point-id-param';
import { DhMeteringPointOverviewPresenter } from './dh-metering-point-overview.presenter';

import { dhMeteringPointPath } from './routing/dh-metering-point-path';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-overview',
  styleUrls: ['./dh-metering-point-overview.component.scss'],
  templateUrl: './dh-metering-point-overview.component.html',
  viewProviders: [
    LocalRouterStore,
    DhMeteringPointOverviewPresenter,
    DhMeteringPointDataAccessApiStore,
  ],
})
export class DhMeteringPointOverviewComponent {
  meteringPointId$ = this.route.selectRouteParam<string>(
    dhMeteringPointIdParam
  );
  meteringPoint$ = this.store.meteringPoint$;
  meteringPointStatus$ = this.presenter.meteringPointStatus$;
  isLoading$ = this.store.isLoading$;
  meteringPointNotFound$ = this.store.meteringPointNotFound$;
  hasError$ = this.store.hasError$;

  emDash = '—';

  constructor(
    private router: Router,
    private route: LocalRouterStore,
    private store: DhMeteringPointDataAccessApiStore,
    private presenter: DhMeteringPointOverviewPresenter
  ) {
    this.loadMeteringPointData();
  }

  goToSearch(): void {
    const url = this.router.createUrlTree([dhMeteringPointPath, 'search']);

    this.router.navigateByUrl(url);
  }

  tryAgain(): void {
    this.loadMeteringPointData();
  }

  private loadMeteringPointData(): void {
    this.meteringPointId$
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
  imports: [
    CommonModule,
    LetModule,
    TranslocoModule,
    DhBreadcrumbScam,
    WattBadgeModule,
    WattButtonModule,
    WattSpinnerModule,
    WattEmptyStateModule,
  ],
})
export class DhMeteringPointOverviewScam {}
