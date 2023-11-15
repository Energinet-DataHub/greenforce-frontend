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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoModule } from '@ngneat/transloco';

import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { DhMeteringPointSearchFormComponent } from './form/dh-metering-point-search-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search',
  styleUrls: ['./dh-metering-point-search.component.scss'],
  templateUrl: './dh-metering-point-search.component.html',
  providers: [DhMeteringPointDataAccessApiStore],
  standalone: true,
  imports: [
    DhMeteringPointSearchFormComponent,
    WattEmptyStateComponent,
    TranslocoModule,
    RxPush,
    CommonModule,
  ],
})
export class DhMeteringPointSearchComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(DhMeteringPointDataAccessApiStore);
  isLoading$ = this.store.isLoading$;
  notFound$ = this.store.meteringPointNotFound$;
  hasGeneralError$ = this.store.hasGeneralError$;
  meteringPointLoaded$ = this.store.meteringPoint$.pipe(take(1));

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
