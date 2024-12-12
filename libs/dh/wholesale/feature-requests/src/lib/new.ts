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
import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  CalculationType,
  GetRequestOptionsDocument,
  GetRequestsDocument,
  MeteringPointType,
  PriceType,
  RequestDocument,
  RequestInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation, MutationStatus, query } from '@energinet-datahub/dh/shared/util-apollo';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import {
  RequestType,
  getMinDate,
  getMaxDate,
  toRequestType,
} from '@energinet-datahub/dh/wholesale/domain';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattRange, dayjs } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { map } from 'rxjs';

type rangeControl = AbstractControl<WattRange<string>>;
const max31DaysDateRangeValidator: ValidatorFn = ({ value }: rangeControl) => {
  if (!value?.end || !value?.start) return null;
  // Since the date range does not include the last millisecond (ends at 23:59:59.999),
  // this condition checks for 30 days, not 31 days (as the diff is in whole days only).
  return dayjs(value.end).diff(value.start, 'days') > 30 ? { max31DaysDateRange: true } : null;
};

const injectToast = () => {
  const transloco = inject(TranslocoService);
  const toast = inject(WattToastService);
  const t = (key: string) => transloco.translate(`wholesale.requests.toast.${key}`);
  return (status: MutationStatus) => {
    switch (status) {
      case MutationStatus.Loading:
        return toast.open({ type: 'loading', message: t('loading') });
      case MutationStatus.Error:
        return toast.update({ type: 'danger', message: t('error') });
      case MutationStatus.Resolved:
        return toast.update({ type: 'success', message: t('success') });
    }
  };
};

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-wholesale-requests-new',
  standalone: true,
  imports: [
    DhDropdownTranslatorDirective,
    MatSelectModule,
    ReactiveFormsModule,
    TranslocoDirective,
    VaterFlexComponent,
    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
    WattDropdownComponent,
    WattFieldErrorComponent,
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
          translateKey="wholesale.shared"
        />
        <watt-datepicker
          [label]="t('period')"
          [range]="true"
          [min]="minDate"
          [max]="maxDate"
          [formControl]="form.controls.period"
          [rangeMonthOnlyMode]="isWholesaleRequest()"
        >
          @if (form.controls.period.errors?.['max31DaysDateRange']) {
            <watt-field-error> {{ t('maxPeriodLength') }} </watt-field-error>
          } @else if (form.controls.period.errors?.['monthOnly']) {
            <watt-field-error> {{ t('monthOnlyError') }} </watt-field-error>
          }
        </watt-datepicker>
        <watt-dropdown
          [label]="t('gridArea')"
          [formControl]="form.controls.gridArea"
          sortDirection="asc"
          [options]="gridAreaOptions()"
          [showResetOption]="!isGridAreaRequired()"
        />
        <watt-dropdown
          translateKey="wholesale.requests.meteringPointTypesAndPriceTypes"
          [label]="includePriceTypes() ? t('meteringPointTypeOrPriceType') : t('meteringPointType')"
          [formControl]="form.controls.meteringPointTypeOrPriceType"
          [options]="meteringPointTypesAndPriceTypes()"
          [showResetOption]="false"
          dhDropdownTranslator
        />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>
        <watt-button variant="primary" formId="request-calculation" type="submit">
          {{ t('request') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhWholesaleRequestsNew {
  modal = viewChild(WattModalComponent);
  toast = injectToast();
  form = new FormGroup({
    calculationType: dhMakeFormControl<CalculationType>(null, Validators.required),
    gridArea: dhMakeFormControl<string>(null),
    meteringPointTypeOrPriceType: dhMakeFormControl<string>(null, Validators.required),
    period: dhMakeFormControl<WattRange<string>>(null, [
      Validators.required,
      WattRangeValidators.required,
      max31DaysDateRangeValidator,
    ]),
  });

  minDate = getMinDate();
  maxDate = getMaxDate();

  calculationType = this.form.controls.calculationType;
  requestType = toSignal(this.calculationType.valueChanges.pipe(exists(), map(toRequestType)));
  isWholesaleRequest = computed(() => this.requestType() === RequestType.WholesaleSettlement);
  includePriceTypes = this.isWholesaleRequest;

  opts = query(GetRequestOptionsDocument, { fetchPolicy: 'no-cache' });
  gridAreaOptions = computed(() => this.opts.data()?.gridAreas ?? []);
  isGridAreaRequired = computed(() => this.opts.data()?.requestOptions.isGridAreaRequired ?? false);
  calculationTypes = computed(() => this.opts.data()?.requestOptions.calculationTypes ?? []);
  meteringPointTypes = computed(() => this.opts.data()?.requestOptions.meteringPointTypes ?? []);
  priceTypes = computed(() => dhEnumToWattDropdownOptions(PriceType));

  meteringPointTypesAndPriceTypes = computed(() =>
    this.includePriceTypes()
      ? [...this.priceTypes(), ...this.meteringPointTypes()]
      : [{ value: 'ALL_ENERGY', displayValue: 'All' }, ...this.meteringPointTypes()]
  );

  updateGridAreaValidatorsEffect = effect(() => {
    this.isGridAreaRequired()
      ? this.form.controls.gridArea.setValidators(Validators.required)
      : this.form.controls.gridArea.removeValidators(Validators.required);
    this.form.controls.gridArea.updateValueAndValidity();
  });

  updateInitialCalculationTypeEffect = effect(() =>
    this.form.controls.calculationType.setValue(this.calculationTypes()[0].value)
  );

  // TODO: Do we need form.valid before ngSubmit?
  request = mutation(RequestDocument, { refetchQueries: [GetRequestsDocument] });
  toastEffect = effect(() => this.toast(this.request.status()));

  handleSubmit = () =>
    this.request.mutate({
      variables: { input: this.getInput() },
      refetchQueries: [GetRequestsDocument],
    });

  getInput = (): RequestInput => {
    const values = this.form.getRawValue();

    // Make TS happy
    if (!values.calculationType || !values.period || !values.meteringPointTypeOrPriceType)
      throw new Error('Invalid input');

    const meteringPointTypeOrPriceType = values.meteringPointTypeOrPriceType;
    const calculationType = values.calculationType;
    const gridArea = values.gridArea;
    const period = {
      start: dayjs(values.period.start).toDate(),
      end: dayjs(values.period.end).toDate(),
    };

    switch (meteringPointTypeOrPriceType) {
      // TODO: Dropdown really needs to accept generic values, not just strings
      case 'ALL_ENERGY':
        return {
          requestAggregatedMeasureData: {
            calculationType,
            period,
            gridArea,
            meteringPointType: null,
          },
        };
      case MeteringPointType.Exchange:
      case MeteringPointType.FlexConsumption:
      case MeteringPointType.NonProfiledConsumption:
      case MeteringPointType.Production:
      case MeteringPointType.TotalConsumption:
        return {
          requestAggregatedMeasureData: {
            calculationType,
            period,
            gridArea,
            meteringPointType: meteringPointTypeOrPriceType,
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
          requestWholesaleSettlement: {
            calculationType,
            period,
            gridArea,
            priceType: meteringPointTypeOrPriceType,
          },
        };
      default:
        throw new Error('Invalid metering point type or price type');
    }
  };

  open = () => this.modal()?.open();
}
