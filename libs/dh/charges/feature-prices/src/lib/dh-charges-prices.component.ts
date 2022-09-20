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

@Component({
  selector: 'dh-charges-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-charges-prices.component.html',
  styleUrls: ['./dh-charges-prices.component.scss'],
})
export class DhChargesPricesComponent implements OnInit, OnDestroy {
  chargeTypeOptions: WattDropdownOptions = this.buildChargeTypeOptions();
  validityOptions: WattDropdownOptions = [];
  searchCriteria: any = {
    chargeTypes: '',
  };

  private destroy$ = new Subject<void>();

  constructor(private translocoService: TranslocoService) {}

  ngOnInit() {
    this.translocoService
      .selectTranslateObject('charges.prices.search')
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private buildChargeTypeOptions() {
    return Object.entries(ChargeTypes).map((entry) => {
      return {
        value: entry[0],
        displayValue: entry[0],
      };
    });
  }

  onValidityDropdownChanged() {
    console.log('changed');
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
  ],
})
export class DhChargesPricesScam {}
