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
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { ChargeTypes, ValidityOptions } from '@energinet-datahub/dh/charges/domain';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextFieldTDComponent } from '@energinet-datahub/watt/text-field';

import { RxPush } from '@rx-angular/template/push';
import { DhChargesPricesResultComponent } from './search-result/dh-charges-prices-result.component';
import {
  DhChargesDataAccessApiStore,
  DhMarketParticipantDataAccessApiStore,
} from '@energinet-datahub/dh/charges/data-access-api';
import { ChargeSearchCriteriaV1Dto } from '@energinet-datahub/dh/shared/domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RxPush,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonComponent,
    WattCheckboxComponent,
    WattDatepickerComponent,
    WattDropdownComponent,
    WattSpinnerComponent,
    WattTextFieldTDComponent,
    TranslocoModule,
    FormsModule,
    DhChargesPricesResultComponent,
    WattDatepickerComponent,
    RxPush,
  ],
  selector: 'dh-charges-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-charges-prices.component.html',
  styleUrls: ['./dh-charges-prices.component.scss'],
  providers: [DhChargesDataAccessApiStore, DhMarketParticipantDataAccessApiStore],
})
export class DhChargesPricesComponent implements OnInit {
  private translocoService = inject(TranslocoService);
  private chargesStore = inject(DhChargesDataAccessApiStore);
  private marketParticipantStore = inject(DhMarketParticipantDataAccessApiStore);
  private _destroyRef = inject(DestroyRef);

  chargeTypeOptions: WattDropdownOptions = [];
  validityOptions: WattDropdownOptions = [];
  validityOption: string | undefined;
  searchCriteria: ChargeSearchCriteriaV1Dto = {};
  marketParticipantsOptions: WattDropdownOptions = [];

  all$ = this.chargesStore.all$;
  isLoading$ = this.chargesStore.isLoading$;
  isInit$ = this.chargesStore.isInit$;
  hasLoadingError$ = this.chargesStore.hasGeneralError$;
  marketParticipants = this.marketParticipantStore.all$;

  ngOnInit() {
    this.marketParticipantStore.loadMarketParticipants();

    this.buildMarketParticipantOptions();
    this.buildChargeTypeOptions();
    this.buildValidityOptions();
  }

  private buildMarketParticipantOptions() {
    this.marketParticipants.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: (marketParticipants) => {
        if (marketParticipants == null) return;
        this.marketParticipantsOptions = marketParticipants.map((mp) => {
          return {
            value: mp.id,
            displayValue: mp.marketParticipantId || '',
          };
        });
      },
    });
  }

  private buildValidityOptions() {
    this.translocoService
      .selectTranslateObject('charges.prices.validityOptions')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (keys) => {
          this.validityOptions = Object.keys(ValidityOptions).map((entry) => {
            return {
              value: entry[0],
              displayValue: keys[entry[0]],
            };
          });
        },
      });
  }

  private buildChargeTypeOptions() {
    this.translocoService
      .selectTranslateObject('charges.prices.chargeTypes')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (translationKeys) => {
          this.chargeTypeOptions = Object.keys(ChargeTypes)
            .filter((key) => ChargeTypes[Number(key)] != null)
            .map((chargeTypeKey) => {
              return {
                value: chargeTypeKey,
                displayValue: translationKeys[ChargeTypes[Number(chargeTypeKey)]],
              };
            });
        },
      });
  }

  onSubmit() {
    this.chargesStore.searchCharges(this.searchCriteria);
  }

  resetSearchCriteria() {
    this.chargesStore.clearCharges();
  }
}
