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
  OnInit,
  NgModule,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { ChargeTypes } from '@energinet-datahub/dh/charges/domain';

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
export class DhChargesPricesComponent implements OnInit {
  chargeTypeOptions: WattDropdownOptions = this.buildChargeTypeOptions();
  searchCriteria: any = {
    chargeTypes: '',
  };

  constructor() {}

  private buildChargeTypeOptions() {
    return Object.entries(ChargeTypes).map((entry) => {
      return {
        value: entry[0],
        displayValue: entry[0],
      };
    });
  }

  ngOnInit(): void {}

  onSubmit() {}

  resetSearchCriteria() {}
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
