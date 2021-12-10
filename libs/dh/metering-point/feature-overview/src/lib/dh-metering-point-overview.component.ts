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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Subject, takeUntil } from 'rxjs';
import { LetModule } from '@rx-angular/template';
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { LocalRouterStore } from '@ngworker/router-component-store';

import { DhBreadcrumbScam } from './breadcrumb/dh-breadcrumb.component';
import { dhMeteringPointIdParam } from './routing/dh-metering-point-id-param';
import { DhMeteringPointNotFoundScam } from './not-found/dh-metering-point-not-found.component';
import { DhMeteringPointServerErrorScam } from './server-error/dh-metering-point-server-error.component';
import { DhMeteringPointStatusBadgeScam } from './status-badge/dh-metering-point-status-badge.component';
import { DhMeteringPointIdentityScam } from './identity/dh-metering-point-identity.component';
import { DhMeteringPointPresenter } from './dh-metering-point-overview.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-overview',
  styleUrls: ['./dh-metering-point-overview.component.scss'],
  templateUrl: './dh-metering-point-overview.component.html',
  viewProviders: [
    LocalRouterStore,
    DhMeteringPointDataAccessApiStore,
    DhMeteringPointPresenter,
  ],
})
export class DhMeteringPointOverviewComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  meteringPointId$ = this.route.selectRouteParam<string>(
    dhMeteringPointIdParam
  );
  meteringPoint$ = this.store.meteringPoint$;
  isLoading$ = this.store.isLoading$;
  meteringPointNotFound$ = this.store.meteringPointNotFound$;
  hasError$ = this.store.hasError$;

  constructor(
    private route: LocalRouterStore,
    private store: DhMeteringPointDataAccessApiStore
  ) {
    this.loadMeteringPointData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  loadMeteringPointData(): void {
    this.meteringPointId$
      .pipe(
        takeUntil(this.destroy$),
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
    LetModule,
    CommonModule,
    DhBreadcrumbScam,
    DhMeteringPointIdentityScam,
    DhMeteringPointNotFoundScam,
    DhMeteringPointServerErrorScam,
    DhMeteringPointStatusBadgeScam,
    WattSpinnerModule,
  ],
})
export class DhMeteringPointOverviewScam {}
