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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import {
  ChargeTypes,
  ValidityOptions,
} from '@energinet-datahub/dh/charges/domain';

import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import {
  WattDropdownModule,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import { WattCheckboxModule } from '@energinet-datahub/watt/checkbox';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattTopBarComponent } from 'libs/ui-watt/src/lib/components/shell/top-bar';

import { PushModule } from '@rx-angular/template';
import { DhChargesPricesResultScam } from './search-result/dh-charges-prices-result.component';
import {
  DhChargesDataAccessApiStore,
  DhMarketParticipantDataAccessApiStore,
} from '@energinet-datahub/dh/charges/data-access-api';
import { ChargeSearchCriteriaV1Dto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-charges-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-charges-prices.component.html',
  styleUrls: ['./dh-charges-prices.component.scss'],
  providers: [
    DhChargesDataAccessApiStore,
    DhMarketParticipantDataAccessApiStore,
  ],
})
export class DhChargesPricesComponent implements OnInit, OnDestroy {
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

  private destroy$ = new Subject<void>();

  constructor(
    private translocoService: TranslocoService,
    private chargesStore: DhChargesDataAccessApiStore,
    private marketParticipantStore: DhMarketParticipantDataAccessApiStore
  ) {}

  ngOnInit() {
    this.marketParticipantStore.loadMarketParticipants();

    this.buildMarketParticipantOptions();
    this.buildChargeTypeOptions();
    this.buildValidityOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private buildMarketParticipantOptions() {
    this.marketParticipants.pipe(takeUntil(this.destroy$)).subscribe({
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
      .pipe(takeUntil(this.destroy$))
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (translationKeys) => {
          this.chargeTypeOptions = Object.keys(ChargeTypes)
            .filter((key) => ChargeTypes[Number(key)] != null)
            .map((chargeTypeKey) => {
              return {
                value: chargeTypeKey,
                displayValue:
                  translationKeys[ChargeTypes[Number(chargeTypeKey)]],
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

@NgModule({
  declarations: [DhChargesPricesComponent],
  imports: [
    CommonModule,
    DhChargesPricesResultScam,
    FormsModule,
    PushModule,
    TranslocoModule,
    WattBadgeModule,
    WattButtonModule,
    WattCheckboxModule,
    WattDatepickerModule,
    WattDropdownModule,
    WattFormFieldModule,
    WattInputModule,
    WattSpinnerModule,
    WattTopBarComponent,
  ],
})
export class DhChargesPricesScam {}
