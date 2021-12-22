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
import { map, Subject, takeUntil } from 'rxjs';
import { LetModule } from '@rx-angular/template';

import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { WattSpinnerModule, WattTabsModule } from '@energinet-datahub/watt';

import { DhSecondaryMasterDataComponentScam } from './secondary-master-data/dh-secondary-master-data.component';
import { DhBreadcrumbScam } from './breadcrumb/dh-breadcrumb.component';
import { DhMeteringPointIdentityScam } from './identity/dh-metering-point-identity.component';
import { dhMeteringPointIdParam } from './routing/dh-metering-point-id-param';
import { DhMeteringPointNotFoundScam } from './not-found/dh-metering-point-not-found.component';
import { DhMeteringPointPrimaryMasterDataScam } from './primary-master-data/dh-metering-point-primary-master-data.component';
import { DhMeteringPointServerErrorScam } from './server-error/dh-metering-point-server-error.component';
import { DhMeteringPointStatusBadgeScam } from './status-badge/dh-metering-point-status-badge.component';
import { DhChildMeteringPointComponentScam } from './child-metering-point/dh-child-metering-point.component';
import {
  ConnectionState,
  MeteringPointSimpleCimDto,
  MeteringPointType,
} from '@energinet-datahub/dh/shared/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';

const TestData: MeteringPointSimpleCimDto[] = [
  {
    gsrnNumber: '570263739584198159',
    effectiveDate: '2020-01-02T00:00:00Z',
    connectionState: ConnectionState.D03,
    meteringPointId: '5678',
    meteringPointType: MeteringPointType.D01,
  },
  {
    gsrnNumber: '910',
    effectiveDate: '2020-04-01T00:00:00Z',
    connectionState: ConnectionState.D02,
    meteringPointId: '546',
    meteringPointType: MeteringPointType.D02,
  },
  {
    gsrnNumber: '678',
    effectiveDate: '2020-01-03T00:00:00Z',
    connectionState: ConnectionState.E22,
    meteringPointId: '125',
    meteringPointType: MeteringPointType.D09,
  },
  {
    gsrnNumber: '345',
    effectiveDate: '2020-02-02T00:00:00Z',
    connectionState: ConnectionState.E23,
    meteringPointId: '558',
    meteringPointType: MeteringPointType.D13,
  },
];

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
    map((mp) => {
      return { ...mp, childMeteringPoints: TestData };
    })
  ); // .pipe(map(mp => {return {...mp, childMeteringPoints: TestData}}))
  isLoading$ = this.store.isLoading$;
  meteringPointNotFound$ = this.store.meteringPointNotFound$;
  hasError$ = this.store.hasError$;

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
    DhMeteringPointStatusBadgeScam,
    LetModule,
    WattSpinnerModule,
    DhSecondaryMasterDataComponentScam,
    WattTabsModule,
    DhChildMeteringPointComponentScam,
    TranslocoModule,
  ],
})
export class DhMeteringPointOverviewScam {}
