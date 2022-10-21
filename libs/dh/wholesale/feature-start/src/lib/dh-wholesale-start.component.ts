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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattFormFieldModule,
  WattRangeValidators,
} from '@energinet-datahub/watt';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import { WattDropdownModule, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dh-wholesale-start',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-wholesale-start.component.html',
  styleUrls: ['./dh-wholesale-start.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
})
export class DhWholesaleStartComponent {
  constructor(private store: DhWholesaleBatchDataAccessApiStore) {}

  optionsGridAreas: WattDropdownOption[] = Object.keys({
    805: '805',
    806: '806',
  }).map((key) => ({
    displayValue: key,
    value: key,
  }));

  formControlGridArea = new FormControl<string[] | null>(
    null,
    Validators.required
  );

  formControlRange = new FormControl<{ start: string; end: string } | null>(
    null,
    [WattRangeValidators.required()]
  );

  createBatch() {
    if (
      this.formControlRange.value != null &&
      this.formControlGridArea.value != null
    ) {
      this.store.createBatch({
        gridAreas: this.formControlGridArea.value,
        dateRange: this.formControlRange.value,
      });
    }
  }
}

@NgModule({
  imports: [
    WattButtonModule,
    WattDatepickerModule,
    WattFormFieldModule,
    TranslocoModule,
    DhFeatureFlagDirectiveModule,
    ReactiveFormsModule,
    CommonModule,
    WattDropdownModule,
  ],
  declarations: [DhWholesaleStartComponent],
})
export class DhWholesaleStartScam {}
