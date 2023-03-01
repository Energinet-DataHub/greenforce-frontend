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
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';
import { TranslocoModule } from '@ngneat/transloco';

import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';

import { DhMeteringPointSearchFormScam } from './form/dh-metering-point-search-form.component';
import { labels } from '@energinet-datahub/dh/globalization/assets-localization';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search',
  styleUrls: ['./dh-metering-point-search.component.scss'],
  templateUrl: './dh-metering-point-search.component.html',
  providers: [DhMeteringPointDataAccessApiStore],
})
export class DhMeteringPointSearchComponent {
  isLoading$ = this.store.isLoading$;
  notFound$ = this.store.meteringPointNotFound$;
  hasGeneralError$ = this.store.hasGeneralError$;
  meteringPointLoaded$ = this.store.meteringPoint$.pipe(take(1));
  labels = labels;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: DhMeteringPointDataAccessApiStore
  ) {}

  onSubmit(id: string) {
    this.store.loadMeteringPointData(id);

    this.meteringPointLoaded$.subscribe((meteringPoint) => {
      this.onMeteringPointLoaded(meteringPoint?.gsrnNumber);
    });
  }

  private onMeteringPointLoaded(meteringPointId?: string) {
    this.router.navigate([`../${meteringPointId}`], { relativeTo: this.route });
  }
}

@NgModule({
  imports: [
    DhMeteringPointSearchFormScam,
    WattEmptyStateModule,
    TranslocoModule,
    PushModule,
    CommonModule,
  ],
  declarations: [DhMeteringPointSearchComponent],
})
export class DhMeteringPointSearchScam {}
