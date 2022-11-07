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
import { CommonModule } from '@angular/common';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattInputModule } from '@energinet-datahub/watt/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import {
  WattDropdownModule,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { ChargeTypes, Resolution } from '@energinet-datahub/dh/charges/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCheckboxModule } from '@energinet-datahub/watt/checkbox';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';

@Component({
  selector: 'dh-charges-create-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-charges-create-prices.component.html',
  styleUrls: ['./dh-charges-create-prices.component.scss'],
})
export class DhChargesCreatePricesComponent implements OnInit, OnDestroy {
  chargeTypeOptions: WattDropdownOptions = [];
  resolutionOptions: WattDropdownOptions = [];

  charge = new FormGroup({
    priceId: new FormControl('', Validators.required),
    chargeType: new FormControl('', Validators.required),
    priceName: new FormControl('', Validators.required),
    priceDescription: new FormControl('', Validators.required),
    priceOwner: new FormControl('', Validators.required),
    resolution: new FormControl('', Validators.required),
    effectiveDate: new FormControl(undefined, Validators.required),
    vatClassification: new FormControl(true, Validators.required),
    transparentInvoicing: new FormControl(true, Validators.required),
    taxIndicator: new FormControl(false, Validators.required),
  });

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

  createPrice() {
    console.log(this.charge.controls['effectiveDate']);

    if (!this.charge.valid) return;

    console.log('VALID!');
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

  private buildValidityOptions() {
    this.translocoService
      .selectTranslateObject('charges.resolutionType')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (translationKeys) => {
          this.resolutionOptions = Object.keys(Resolution)
            .filter(
              (key) =>
                Resolution[Number(key)] != null &&
                Number(key) != Resolution.Unknown
            )
            .map((chargeTypeKey) => {
              return {
                value: chargeTypeKey,
                displayValue:
                  translationKeys[Resolution[Number(chargeTypeKey)]],
              };
            });
        },
      });
  }
}

@NgModule({
  declarations: [DhChargesCreatePricesComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    ReactiveFormsModule,
    WattButtonModule,
    WattCardModule,
    WattCheckboxModule,
    WattDatepickerModule,
    WattFormFieldModule,
    WattInputModule,
    WattDropdownModule,
  ],
})
export class DhChargesCreatePricesScam {}
