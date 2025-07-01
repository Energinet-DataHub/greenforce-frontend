//#region License
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
//#endregion
import { Component, computed, effect, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { dayjs } from '@energinet-datahub/watt/date';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';

import {
  GetRequestOptionsDocument,
  GetRequestsDocument,
  MeteringPointType,
  PriceType,
  RequestDocument,
  RequestInput,
  RequestCalculationType,
  PeriodInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhFormControlToSignal,
  dhMakeFormControl,
  setControlRequired,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

import { getMinDate, getMaxDate } from '@energinet-datahub/dh/wholesale/domain';
import {
  DhCalculationsGridAreasDropdown,
  DhCalculationsPeriodField,
} from '@energinet-datahub/dh/wholesale/shared';

/** Validate that the interval is less than or equal to `maxDays`. */
const maxDaysValidator =
  (maxDays: number): ValidatorFn =>
  ({ value }: AbstractControl<PeriodInput | null>) => {
    if (!value?.interval) return null;
    if (!value.interval.end) return null;
    // Since the date range does not include the last millisecond (ends at 23:59:59.999),
    // this condition checks for `maxDays` - 1 (as the diff is in whole days only).
    return dayjs(value.interval.end).diff(value.interval.start, 'days') > maxDays - 1
      ? { maxDays }
      : null;
  };

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-wholesale-requests-new',
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    TranslocoDirective,
    VaterFlexComponent,
    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattFieldErrorComponent,
    DhCalculationsGridAreasDropdown,
    DhCalculationsPeriodField,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <watt-modal
      *transloco="let t; read: 'wholesale.requests.new'"
      #modal
      size="small"
      [title]="t('title')"
    >
      <form
        id="request-calculation"
        [formGroup]="form"
        (ngSubmit)="handleSubmit()"
        vater-flex
        direction="column"
        gap="s"
        offset="m"
      >
        <watt-dropdown
          [label]="t('calculationType')"
          [formControl]="form.controls.calculationType"
          [options]="calculationTypes()"
          [showResetOption]="false"
          dhDropdownTranslator
          translateKey="shared.calculationTypes"
          data-testid="requestcalculation.calculationTypes"
        />
        @if (calculationType(); as calculationType) {
          <dh-calculations-period-field
            [formControl]="form.controls.period"
            [calculationType]="calculationType"
            [min]="minDate"
            [max]="maxDate"
            data-testid="requestcalculation.datePeriod"
          >
            @if (form.controls.period.errors?.maxDays) {
              <watt-field-error>
                {{ t('maxDaysError', { days: form.controls.period.errors?.maxDays }) }}
              </watt-field-error>
            }
          </dh-calculations-period-field>
        }
        <dh-calculations-grid-areas-dropdown
          [period]="period()"
          [control]="form.controls.gridArea"
          [showResetOption]="!isGridAreaRequired()"
          [multiple]="false"
        />
        <watt-dropdown
          translateKey="wholesale.requests.meteringPointTypesAndPriceTypes"
          [label]="includePriceTypes() ? t('meteringPointTypeOrPriceType') : t('meteringPointType')"
          [formControl]="form.controls.type"
          [options]="meteringPointTypesAndPriceTypes()"
          [showResetOption]="false"
          data-testid="requestcalculation.meteringpointTypes"
          dhDropdownTranslator
        />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>
        <watt-button
          variant="primary"
          formId="request-calculation"
          type="submit"
          [disabled]="!form.valid"
        >
          {{ t('request') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhWholesaleRequestsNew {
  form = new FormGroup({
    calculationType: dhMakeFormControl<RequestCalculationType>(null, Validators.required),
    gridArea: dhMakeFormControl<string>(null),
    type: dhMakeFormControl<MeteringPointType | PriceType>(MeteringPointType.All),
    period: dhMakeFormControl<PeriodInput>(null, [Validators.required, maxDaysValidator(31)]),
  });

  calculationType = dhFormControlToSignal(this.form.controls.calculationType);
  period = dhFormControlToSignal(this.form.controls.period);
  isWholesaleRequest = computed(() => {
    switch (this.calculationType()) {
      case null:
      case RequestCalculationType.Aggregation:
      case RequestCalculationType.BalanceFixing:
        return false;
      case RequestCalculationType.WholesaleFixing:
      case RequestCalculationType.FirstCorrectionSettlement:
      case RequestCalculationType.SecondCorrectionSettlement:
      case RequestCalculationType.ThirdCorrectionSettlement:
      case RequestCalculationType.LatestCorrectionSettlement:
        return true;
    }
  });

  // alias for readability
  includePriceTypes = this.isWholesaleRequest;

  modal = viewChild(WattModalComponent);
  open = () => this.modal()?.open();
  close = (result: boolean) => this.modal()?.close(result);

  minDate = getMinDate();
  maxDate = getMaxDate();

  // Options for form controls
  opts = query(GetRequestOptionsDocument, { fetchPolicy: 'no-cache' });
  isGridAreaRequired = computed(() => this.opts.data()?.requestOptions.isGridAreaRequired ?? false);
  calculationTypes = computed(() => this.opts.data()?.requestOptions.calculationTypes ?? []);
  meteringPointTypes = computed(() => this.opts.data()?.requestOptions.meteringPointTypes ?? []);
  priceTypes = computed(() => dhEnumToWattDropdownOptions(PriceType));
  meteringPointTypesAndPriceTypes = computed(() =>
    this.includePriceTypes()
      ? this.priceTypes().concat(this.meteringPointTypes())
      : this.meteringPointTypes()
  );

  // Update form controls based on options
  gridArea = this.form.controls.gridArea;
  setGridAreaRequired = effect(() => setControlRequired(this.gridArea, this.isGridAreaRequired()));
  firstCalculationType = computed(() => this.calculationTypes().find(Boolean)?.value ?? null);
  updateCalculationType = effect(() => this.calculationType.set(this.firstCalculationType()));

  // Request mutation handling
  request = mutation(RequestDocument, { refetchQueries: [GetRequestsDocument] });
  toast = injectToast('wholesale.requests.toast');
  toastEffect = effect(() => this.toast(this.request.status()));
  handleSubmit = () => {
    if (!this.form.valid) return;
    this.close(true);
    this.request.mutate({
      variables: { input: this.makeRequestInput() },
      refetchQueries: [GetRequestsDocument],
    });
  };

  makeRequestInput = (): RequestInput => {
    const { calculationType, gridArea, type, period } = this.form.value;

    // Satisfy the type checker, since fields should be defined at this point (due to validators)
    assertIsDefined(calculationType);
    assertIsDefined(period);
    assertIsDefined(type);

    // Pick the right request type based on the selected metering point type or price type
    switch (type) {
      case MeteringPointType.All:
      case MeteringPointType.Exchange:
      case MeteringPointType.FlexConsumption:
      case MeteringPointType.NonProfiledConsumption:
      case MeteringPointType.Production:
      case MeteringPointType.TotalConsumption:
        return {
          requestCalculatedEnergyTimeSeries: {
            calculationType,
            period,
            gridArea,
            meteringPointType: type,
          },
        };
      case PriceType.Fee:
      case PriceType.MonthlyFee:
      case PriceType.MonthlySubscription:
      case PriceType.MonthlyTariff:
      case PriceType.MonthlyTariffSubscriptionAndFee:
      case PriceType.Subscription:
      case PriceType.Tariff:
      case PriceType.TariffSubscriptionAndFee:
        return {
          requestCalculatedWholesaleServices: {
            calculationType,
            period,
            gridArea,
            priceType: type,
          },
        };
    }
  };
}
