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
import { ActivatedRoute } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { map, Observable } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { DhChargeLinksDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import { ChargeLinkV1Dto } from '@energinet-datahub/dh/shared/domain';
import { dhMeteringPointIdParam } from '@energinet-datahub/dh/metering-point/routing';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

import { DhChargeItemScam } from './dh-charge-item/dh-charge-item.component';
import { DhChargesNotFoundScam } from './dh-charges-not-found/dh-charges-not-found.component';
import { DhChargesGeneralErrorScam } from './dh-charges-general-error/dh-charges-general-error.component';

@Component({
  selector: 'dh-charges-tab-content',
  templateUrl: './dh-charges-tab-content.component.html',
  styleUrls: ['./dh-charges-tab-content.component.scss'],
  providers: [DhChargeLinksDataAccessApiStore],
})
export class DhChargesTabContentComponent {
  meteringPointId$ = this.route.params.pipe(
    map((params) => params[dhMeteringPointIdParam] as string)
  );

  constructor(private route: ActivatedRoute, private store: DhChargeLinksDataAccessApiStore) {
    this.loadChargesData();
  }

  tariffs$: Observable<Array<ChargeLinkV1Dto>> = this.store.tariffs$;
  subscriptions$: Observable<Array<ChargeLinkV1Dto>> = this.store.subscriptions$;
  fees$: Observable<Array<ChargeLinkV1Dto>> = this.store.fees$;
  isLoading$ = this.store.isLoading$;
  chargesNotFound$ = this.store.chargesNotFound$;
  hasGeneralError$ = this.store.hasGeneralError$;

  loadChargesData(): void {
    this.store.loadChargeLinksData(this.meteringPointId$);
  }
}

@NgModule({
  declarations: [DhChargesTabContentComponent],
  imports: [
    CommonModule,
    WattSpinnerModule,
    LetModule,
    TranslocoModule,
    DhChargeItemScam,
    DhChargesNotFoundScam,
    DhChargesGeneralErrorScam,
  ],
  exports: [DhChargesTabContentComponent],
})
export class DhChargesTabContentScam {}
