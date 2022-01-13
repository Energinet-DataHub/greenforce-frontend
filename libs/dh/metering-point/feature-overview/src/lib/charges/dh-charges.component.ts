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
import { Component, NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DhChargesDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import { ChargeLinkDto } from '@energinet-datahub/dh/shared/data-access-api';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { LetModule } from '@rx-angular/template';
import { ActivatedRoute } from '@angular/router';
import { dhMeteringPointIdParam } from '../..';
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { DhChargeItemScam } from './dh-charge-item/dh-charge-item.component';
import { DhChargesNotFoundScam } from './dh-charges-not-found/dh-charges-not-found.component';
import { DhChargesServerErrorScam } from './dh-charges-server-error/dh-charges-server-error.component';

@Component({
  selector: 'dh-charges',
  templateUrl: './dh-charges.component.html',
  styleUrls: ['./dh-charges.component.scss'],
  providers: [DhChargesDataAccessApiStore],
})
export class DhChargesComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  meteringPointId$ = this.route.params.pipe(
    map((params) => params[dhMeteringPointIdParam] as string)
  );

  constructor(
    private route: ActivatedRoute,
    private store: DhChargesDataAccessApiStore
  ) {
    this.loadChargesData();
  }

  tariffs$: Observable<Array<ChargeLinkDto>> = this.store.tariffs$;
  subscriptions$: Observable<Array<ChargeLinkDto>> = this.store.subscriptions$;
  fees$: Observable<Array<ChargeLinkDto>> = this.store.fees$;
  isLoading$ = this.store.isLoading$;
  chargesNotFound$ = this.store.chargesNotFound$;
  hasGeneralError$ = this.store.hasGeneralError$;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  loadChargesData(): void {
    this.meteringPointId$
      .pipe(
        takeUntil(this.destroy$),
        map((meteringPointId) => this.store.loadChargesData(meteringPointId))
      )
      .subscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    WattSpinnerModule,
    LetModule,
    TranslocoModule,
    DhChargeItemScam,
    DhChargesNotFoundScam,
    DhChargesServerErrorScam,
  ],
  declarations: [DhChargesComponent],
  exports: [DhChargesComponent],
})
export class DhChargesScam {}
