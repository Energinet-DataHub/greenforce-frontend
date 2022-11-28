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
import {
  WattDropdownModule,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import { Subject, take, takeUntil } from 'rxjs';
import {
  ChargeTypes,
  ResolutionOptions,
} from '@energinet-datahub/dh/charges/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCheckboxModule } from '@energinet-datahub/watt/checkbox';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import {
  DhChargesDataAccessApiStore,
  DhMarketParticipantDataAccessApiStore,
} from '@energinet-datahub/dh/charges/data-access-api';
import {
  ChargeType,
  MarketParticipantV1Dto,
  Resolution,
  VatClassification,
} from '@energinet-datahub/dh/shared/domain';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { PushModule } from '@rx-angular/template';
import { Router } from '@angular/router';
import {
  dhChargesPath,
  dhChargesPricesPath,
} from '@energinet-datahub/dh/charges/routing';
import { add } from 'date-fns';

@Component({
  selector: 'dh-charges-create-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-charges-create-prices.component.html',
  styleUrls: ['./dh-charges-create-prices.component.scss'],
  providers: [
    DhMarketParticipantDataAccessApiStore,
    DhChargesDataAccessApiStore,
  ],
})
export class DhChargesCreatePricesComponent implements OnInit, OnDestroy {
  chargeTypeOptions: WattDropdownOptions = [];
  resolutionOptions: WattDropdownOptions = [];
  marketParticipantsOptions: WattDropdownOptions = [];

  charge = new FormGroup({
    senderProvidedChargeId: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    chargeType: new FormControl('', Validators.required),
    chargeName: new FormControl('', [
      Validators.required,
      Validators.maxLength(132),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(2048),
    ]),
    resolution: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    effectiveDate: new FormControl(
      add(new Date(), { days: 31 }).toISOString(),
      Validators.required
    ),
    vatClassification: new FormControl(true, Validators.required),
    transparentInvoicing: new FormControl(false, Validators.required),
    taxIndicator: new FormControl(false, Validators.required),
    senderMarketParticipantId: new FormControl('', Validators.required),
  });
  selectedSenderMarketParticipant?: MarketParticipantV1Dto;

  isTariff = false;
  isFormValid = false;
  marketParticipants = this.marketParticipantStore.all$;
  hasSubmitted = false;

  isLoading = this.chargesStore.isCreateRequestLoading$;

  private destroy$ = new Subject<void>();

  constructor(
    private chargesStore: DhChargesDataAccessApiStore,
    private marketParticipantStore: DhMarketParticipantDataAccessApiStore,
    private toastService: WattToastService,
    private translocoService: TranslocoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.marketParticipantStore.loadMarketParticipants();

    this.buildMarketParticipantOptions();
    this.buildChargeTypeOptions();
    this.buildValidityOptions();

    this.chargesStore.createRequestHasError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasError) => {
        if (hasError) {
          this.toastService.open({
            message: this.translocoService.translate(
              'charges.createPrices.createPriceError'
            ),
            type: 'danger',
          });

          this.enableFormGroup();
        }
      });

    this.chargesStore.createRequestHasSucceeded$
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSucceded) => {
        if (hasSucceded) {
          this.toastService.open({
            message: this.translocoService.translate(
              'charges.createPrices.createPriceSuccess'
            ),
            type: 'success',
          });

          setTimeout(() => {
            this.router.navigateByUrl(
              `${dhChargesPath}/${dhChargesPricesPath}`
            );
          }, 1000);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  ownerChanged(marketParticipantId: string) {
    this.marketParticipantStore.all$
      .pipe(take(1))
      .subscribe((marketParticipants) => {
        this.selectedSenderMarketParticipant = marketParticipants?.find(
          (mp) => mp.id == marketParticipantId
        );
      });
  }

  chargeTypeChanged(chargeType: number) {
    this.isTariff = chargeType == Number(ChargeTypes.Tariff);

    // Building options because it's different depending on the chargetype.
    this.buildValidityOptions();
    this.enableFormGroup();

    switch (Number(chargeType)) {
      case ChargeTypes.Tariff: {
        this.charge.controls['resolution'].setValue('');
        this.charge.controls['transparentInvoicing'].setValue(false);
        break;
      }
      case ChargeTypes.Subscription: {
        this.charge.controls['transparentInvoicing'].setValue(false);
        this.disableResolutionWithValue();
        this.disableTaxIndicator();
        break;
      }
      case ChargeTypes.Fee: {
        this.disableTaxIndicator();
        this.disableTransparentInvoicing();
        this.disableResolutionWithValue();
        break;
      }
      default:
        break;
    }
  }

  createPrice() {
    this.hasSubmitted = true;

    if (!this.charge.valid) return;

    this.disableFormGroup();
    const charge = this.charge.value;

    const resolution = this.charge.controls['resolution'].value;

    this.chargesStore.createCharge({
      chargeType: charge.chargeType as ChargeType,
      effectiveDate: charge.effectiveDate as string,
      resolution: ResolutionOptions[Number(resolution)] as Resolution,
      chargeName: charge.chargeName as string,
      taxIndicator: charge.taxIndicator as boolean,
      transparentInvoicing: charge.transparentInvoicing as boolean,
      vatClassification: charge.vatClassification
        ? VatClassification.Vat25
        : VatClassification.NoVat,
      description: charge.description as string,
      senderProvidedChargeId: charge.senderProvidedChargeId as string,
      senderMarketParticipant: this.selectedSenderMarketParticipant,
    });

    this.toastService.open({
      message: this.translocoService.translate(
        'charges.createPrices.loadingRequestText'
      ),
      type: 'loading',
    });
  }

  disableFormGroup() {
    this.charge.controls['chargeType'].disable();
    this.charge.controls['senderProvidedChargeId'].disable();
    this.charge.controls['chargeName'].disable();
    this.charge.controls['senderMarketParticipantId'].disable();
    this.charge.controls['description'].disable();
    this.charge.controls['taxIndicator'].disable();
    this.charge.controls['transparentInvoicing'].disable();
    this.charge.controls['resolution'].disable();
    this.charge.controls['effectiveDate'].disable();
    this.charge.controls['vatClassification'].disable();
  }

  enableFormGroup() {
    this.charge.controls['taxIndicator'].enable();
    this.charge.controls['transparentInvoicing'].enable();
    this.charge.controls['chargeType'].enable();
    this.charge.controls['senderProvidedChargeId'].enable();
    this.charge.controls['chargeName'].enable();
    this.charge.controls['senderMarketParticipantId'].enable();
    this.charge.controls['description'].enable();
    this.charge.controls['effectiveDate'].enable();
    this.charge.controls['vatClassification'].enable();

    const chargeType = Number(this.charge.controls['chargeType'].value);
    if (chargeType === ChargeTypes.Tariff)
      this.charge.controls['resolution'].enable();
  }

  disableTaxIndicator() {
    this.charge.controls['taxIndicator'].setValue(false);
    this.charge.controls['taxIndicator'].disable();
  }

  disableTransparentInvoicing() {
    this.charge.controls['transparentInvoicing'].setValue(false);
    this.charge.controls['transparentInvoicing'].disable();
  }

  disableResolutionWithValue() {
    this.charge.controls['resolution'].setValue(
      Number(ResolutionOptions.P1M).toString()
    );
    this.charge.controls['resolution'].disable();
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
          this.resolutionOptions = Object.keys(ResolutionOptions)
            .filter(
              (key) =>
                ResolutionOptions[Number(key)] != null &&
                Number(key) != ResolutionOptions.Unknown &&
                Number(key) != ResolutionOptions.PT15M
            )
            .map((chargeTypeKey) => {
              return {
                value: chargeTypeKey,
                displayValue:
                  translationKeys[ResolutionOptions[Number(chargeTypeKey)]],
              };
            });

          if (this.isTariff)
            this.resolutionOptions = this.resolutionOptions.filter(
              (option) => Number(option.value) != ResolutionOptions.P1M
            );
        },
      });
  }
}

@NgModule({
  declarations: [DhChargesCreatePricesComponent],
  imports: [
    CommonModule,
    FormsModule,
    PushModule,
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
