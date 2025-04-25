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
import { Component, computed, effect, inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  WattFieldComponent,
  WattFieldErrorComponent,
  WattFieldHintComponent,
} from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattDateTimeField } from '@energinet-datahub/watt/datetime-field';
import { WattDatePipe, WattRange, dayjs } from '@energinet-datahub/watt/date';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattYearMonthField } from '@energinet-datahub/watt/yearmonth-field';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { Range } from '@energinet-datahub/dh/shared/domain';
import {
  CreateCalculationDocument,
  StartCalculationType,
  CalculationExecutionType,
  GetLatestCalculationDocument,
  GetCalculationsDocument,
  CreateCalculationInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { getMinDate } from '@energinet-datahub/dh/wholesale/domain';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { DhCalculationsGridAreasDropdownComponent } from '../grid-areas/dropdown.component';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { toSignal } from '@angular/core/rxjs-interop';
import { lazyQuery, mutation, MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

interface FormValues {
  executionType: FormControl<CalculationExecutionType | null>;
  calculationType: FormControl<StartCalculationType>;
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<WattRange<Date> | null>;
  yearMonth: FormControl<string | null>;
  isScheduled: FormControl<boolean>;
  scheduledAt: FormControl<Date | null>;
}

/** Helper function for displaying a toast message based on MutationStatus. */
const injectToast = () => {
  const transloco = inject(TranslocoService);
  const toast = inject(WattToastService);
  const t = (key: string) => transloco.translate(`wholesale.calculations.create.toast.${key}`);
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

@Component({
  selector: 'dh-calculations-create',
  templateUrl: './create.component.html',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattDatePipe,
    WattDatepickerComponent,
    WattDateTimeField,
    WattDropdownComponent,
    WattFieldComponent,
    WattFilterChipComponent,
    WattValidationMessageComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,
    WattRadioComponent,
    WattTextFieldComponent,
    WattYearMonthField,
    VaterFlexComponent,
    VaterStackComponent,
    DhCalculationsGridAreasDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
})
export class DhCalculationsCreateComponent {
  // `refetchQueries` currently doesn't have the intended effect due to newly created calculations
  // not being immediately returned from the ProcessManager (sometimes delayed by several seconds)
  create = mutation(CreateCalculationDocument, { refetchQueries: [GetCalculationsDocument] });
  toast = injectToast(); // TODO: Make shared
  toastEffect = effect(() => this.toast(this.create.status()));

  latestCalculation = lazyQuery(GetLatestCalculationDocument, { fetchPolicy: 'network-only' });
  latestPeriodEnd = computed(() => {
    const calculation = this.latestCalculation.data()?.latestCalculation;
    if (!calculation) return null;
    switch (calculation.__typename) {
      case 'WholesaleAndEnergyCalculation':
        return calculation.period?.end;
      case 'CapacitySettlementCalculation':
        return calculation.yearMonth;
      case 'NetConsumptionCalculation':
      case 'ElectricalHeatingCalculation':
        return null;
    }
  });

  handleClose(accepted: boolean) {
    if (accepted) this.create.mutate({ variables: { input: this.makeInput() } });
    this.reset();
    this.confirmFormControl.reset();
  }

  makeInput = (): CreateCalculationInput => {
    const { calculationType } = this.formGroup.getRawValue();
    const { executionType, gridAreas, isScheduled, scheduledAt } = this.formGroup.value;

    const period = this.period();

    // Satisfy the type checker, since fields should be defined at this point (due to validators)
    assertIsDefined(calculationType);
    assertIsDefined(executionType);
    assertIsDefined(period);

    return {
      executionType,
      calculationType,
      period,
      gridAreaCodes: gridAreas,
      scheduledAt: isScheduled ? scheduledAt : null,
    };
  };

  CalculationType = StartCalculationType;
  CalculationExecutionType = CalculationExecutionType;

  @ViewChild('modal') modal?: WattModalComponent;

  ffs = inject(DhFeatureFlagsService);

  environment = inject(dhAppEnvironmentToken);

  resolutionTransitionDate = this.ffs.isEnabled('quarterly-resolution-transition-datetime-override')
    ? '2023-01-31T23:00:00Z'
    : '2023-04-30T22:00:00Z';

  loading = false;

  confirmFormControl = new FormControl('');

  monthOnly = [
    StartCalculationType.WholesaleFixing,
    StartCalculationType.FirstCorrectionSettlement,
    StartCalculationType.SecondCorrectionSettlement,
    StartCalculationType.ThirdCorrectionSettlement,
    StartCalculationType.CapacitySettlement,
  ];

  formGroup = new FormGroup<FormValues>(
    {
      executionType: new FormControl<CalculationExecutionType | null>(null, {
        validators: Validators.required,
      }),
      calculationType: new FormControl(StartCalculationType.BalanceFixing, {
        nonNullable: true,
        validators: Validators.required,
      }),
      gridAreas: new FormControl(
        { value: null, disabled: true },
        { validators: Validators.required }
      ),
      dateRange: new FormControl(null, {
        validators: [WattRangeValidators.required, this.validateResolutionTransition()],
      }),
      yearMonth: new FormControl(null, { validators: Validators.required }),
      isScheduled: new FormControl(false, { nonNullable: true }),
      scheduledAt: new FormControl<Date | null>(null, { validators: this.validateScheduledAt }),
    },
    { asyncValidators: () => this.validateWholesale() }
  );

  executionType = this.formGroup.controls.executionType;
  calculationType = this.formGroup.controls.calculationType;
  interval = toSignal(this.formGroup.controls.dateRange.valueChanges);
  yearMonth = toSignal(this.formGroup.controls.yearMonth.valueChanges);

  period = computed(() => {
    const interval = this.interval() ?? undefined;
    const yearMonth = this.yearMonth() ?? undefined;
    if (this.formGroup.controls.dateRange.enabled) return interval ? { interval } : undefined;
    else return yearMonth ? { yearMonth } : undefined;
  });

  calculationTypesOptions = dhEnumToWattDropdownOptions(StartCalculationType);

  selectedExecutionType = 'ACTUAL';
  showPeriodWarning = false;

  minScheduledAt = new Date();
  scheduledAt = toSignal(this.formGroup.controls.scheduledAt.valueChanges);

  minDate = getMinDate();
  maxDate = computed(() =>
    dayjs(this.scheduledAt() ?? new Date())
      .subtract(1, 'day')
      .toDate()
  );

  constructor() {
    this.formGroup.controls.isScheduled.valueChanges.subscribe(() => {
      this.formGroup.controls.scheduledAt.updateValueAndValidity();
    });

    this.calculationType.valueChanges.subscribe((value) => {
      if (value === StartCalculationType.CapacitySettlement) {
        this.formGroup.controls.isScheduled.disable();
        this.formGroup.controls.scheduledAt.disable();
      } else {
        this.formGroup.controls.isScheduled.enable();
        this.formGroup.controls.scheduledAt.enable();
      }

      if (this.monthOnly.includes(value)) {
        this.formGroup.controls.dateRange.disable();
        this.formGroup.controls.yearMonth.enable();
      } else {
        this.formGroup.controls.yearMonth.disable();
        this.formGroup.controls.dateRange.enable();
      }
    });

    this.executionType.valueChanges.subscribe((executionType) => {
      if (executionType == CalculationExecutionType.Internal) {
        this.formGroup.controls.calculationType.disable();
        this.formGroup.controls.calculationType.setValue(StartCalculationType.Aggregation);
      } else {
        this.formGroup.controls.calculationType.enable();
      }
    });
  }

  open() {
    this.modal?.open();
  }

  reset() {
    this.latestCalculation.reset();
    this.showPeriodWarning = false;
    this.formGroup.reset();

    // This is apparently neccessary to reset the dropdown validity state
    this.formGroup.controls.calculationType.setErrors(null);
  }

  private async validateWholesale(): Promise<null> {
    const { calculationType, dateRange: interval, yearMonth } = this.formGroup.controls;

    // Hide the warning initially
    this.latestCalculation.reset();

    // Skip validation if calculation type is aggregation
    if (calculationType.value === StartCalculationType.Aggregation) return null;

    const period =
      interval.enabled && interval.value
        ? { interval: interval.value }
        : yearMonth.enabled && yearMonth.value
          ? { yearMonth: yearMonth.value }
          : null;

    // Skip validation if period is empty
    if (!period) return null;

    // This always returns null (no error)
    return this.latestCalculation
      .query({
        variables: {
          calculationType: calculationType.value,
          period,
        },
      })
      .then(() => null);
  }

  private validateResolutionTransition(): ValidatorFn {
    return (control: AbstractControl<Range<string> | null>): ValidationErrors | null => {
      // List of calculation types that are affected by the validator
      const affected = [StartCalculationType.BalanceFixing, StartCalculationType.Aggregation];

      const calculationType = control.parent?.get('calculationType')?.value;
      if (!affected.includes(calculationType) || !control.value) return null;
      const start = dayjs.utc(control.value.start);
      const end = dayjs.utc(control.value.end);
      const transitionDate = dayjs.utc(this.resolutionTransitionDate);
      return start.isBefore(transitionDate) && end.isAfter(transitionDate)
        ? { resolutionTransition: true }
        : null;
    };
  }

  private validateScheduledAt(control: AbstractControl<Date | null>): ValidationErrors | null {
    if (!control.parent?.get('isScheduled')?.value) return null;
    if (control.value && control.value < new Date()) return { past: true };
    return control.value ? null : { required: true };
  }
}
