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

import {
  WattButtonModule,
  WattFormFieldModule,
  WattInputModule,
  WattCheckboxModule,
  WattBadgeModule,
  WattDropdownModule,
  WattSpinnerModule,
  WattDropdownOptions,
} from '@energinet-datahub/watt';

import { DhChargesPricesResultScam } from './search-result/dh-charges-prices-result.component';

@Component({
  selector: 'dh-charges-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-charges-prices.component.html',
  styleUrls: ['./dh-charges-prices.component.scss'],
})
export class DhChargesPricesComponent implements OnInit, OnDestroy {
  chargeTypeOptions: WattDropdownOptions = [];
  validityOptions: WattDropdownOptions = [];
  searchCriteria: any = {
    chargeTypes: '',
  };

  private destroy$ = new Subject<void>();

  constructor(private translocoService: TranslocoService) {}

  ngOnInit() {
    this.buildChargeTypeOptions();
    this.buildValidityOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private buildValidityOptions() {
    this.translocoService
      .selectTranslateObject('charges.domain.validityOptions')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (keys) => {
          this.validityOptions = Object.entries(ValidityOptions).map(
            (entry) => {
              return {
                value: entry[0],
                displayValue: keys[entry[0]],
              };
            }
          );
        },
      });
  }

  private buildChargeTypeOptions() {
    this.translocoService
    .selectTranslateObject('charges.domain.chargeTypes')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (keys) => {
        this.chargeTypeOptions = Object.entries(ChargeTypes).map(
          (chargeType) => {
            return {
              value: chargeType[0],
              displayValue: keys[chargeType[0]],
            };
          }
        );
      },
    });
  }

  onSubmit() {
    console.log('submit');
  }

  resetSearchCriteria() {
    console.log('reset');
  }
}

@NgModule({
  declarations: [DhChargesPricesComponent],
  imports: [
    CommonModule,
    WattButtonModule,
    WattFormFieldModule,
    WattInputModule,
    WattCheckboxModule,
    WattBadgeModule,
    WattDropdownModule,
    WattSpinnerModule,
    TranslocoModule,
    FormsModule,
    DhChargesPricesResultScam,
  ],
})
export class DhChargesPricesScam {}
