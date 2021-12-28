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
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { LetModule } from '@rx-angular/template';
import { TranslocoModule } from '@ngneat/transloco';

import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { WattSpinnerModule, WattTabsModule } from '@energinet-datahub/watt';

import { DhSecondaryMasterDataComponentScam } from './secondary-master-data/dh-secondary-master-data.component';
import { DhBreadcrumbScam } from './breadcrumb/dh-breadcrumb.component';
import { DhMeteringPointIdentityScam } from './identity/dh-metering-point-identity.component';
import { dhMeteringPointIdParam } from './routing/dh-metering-point-id-param';
import { DhMeteringPointNotFoundScam } from './not-found/dh-metering-point-not-found.component';
import { DhMeteringPointPrimaryMasterDataScam } from './primary-master-data/dh-metering-point-primary-master-data.component';
import { DhMeteringPointServerErrorScam } from './server-error/dh-metering-point-server-error.component';
import { DhChildMeteringPointComponentScam } from './child-metering-point/dh-child-metering-point.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-overview',
  styleUrls: ['./dh-metering-point-overview.component.scss'],
  templateUrl: './dh-metering-point-overview.component.html',
  providers: [DhMeteringPointDataAccessApiStore],
})
export class DhMeteringPointOverviewComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  meteringPointId$ = this.route.params.pipe(
    map((params) => params[dhMeteringPointIdParam] as string)
  );
  meteringPoint$ = this.store.meteringPoint$.pipe(
    tap((meteringPoint) => {
      this.childMeteringPointsCount =
        meteringPoint.childMeteringPoints?.length ?? 0;
    })
  );
  isLoading$ = this.store.isLoading$;
  meteringPointNotFound$ = this.store.meteringPointNotFound$;
  hasError$ = this.store.hasError$;
  childMeteringPointsCount = 0;

  constructor(
    private route: ActivatedRoute,
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
    CommonModule,
    DhBreadcrumbScam,
    DhMeteringPointIdentityScam,
    DhMeteringPointNotFoundScam,
    DhMeteringPointPrimaryMasterDataScam,
    DhMeteringPointServerErrorScam,
    LetModule,
    WattSpinnerModule,
    DhSecondaryMasterDataComponentScam,
    WattTabsModule,
    DhChildMeteringPointComponentScam,
    TranslocoModule,
  ],
})
export class DhMeteringPointOverviewScam {}
