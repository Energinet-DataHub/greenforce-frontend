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
import { Component, computed, inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { map, Observable, of, tap } from 'rxjs';

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
import { WattYearMonthField, YEARMONTH_FORMAT } from '@energinet-datahub/watt/yearmonth-field';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { Range } from '@energinet-datahub/dh/shared/domain';
import {
  CreateCalculationDocument,
  StartCalculationType,
  CalculationExecutionType,
  GetLatestCalculationDocument,
  GetCalculationsDocument,
  PeriodInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { getMinDate } from '@energinet-datahub/dh/wholesale/domain';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { DhCalculationsGridAreasDropdownComponent } from '../grid-areas/dropdown.component';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { toSignal } from '@angular/core/rxjs-interop';

interface FormValues {
  executionType: FormControl<CalculationExecutionType | null>;
  calculationType: FormControl<StartCalculationType>;
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<WattRange<Date> | null>;
  yearMonth: FormControl<string | null>;
  isScheduled: FormControl<boolean>;
  scheduledAt: FormControl<Date | null>;
}

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
  CalculationType = StartCalculationType;
  CalculationExecutionType = CalculationExecutionType;

  private _toast = inject(WattToastService);
  private _transloco = inject(TranslocoService);
  private _apollo = inject(Apollo);

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
    if (this.formGroup.controls.dateRange.enabled) {
      return interval ? { interval } : undefined;
    } else {
      return yearMonth ? { yearMonth } : undefined;
    }
  });

  calculationTypesOptions = dhEnumToWattDropdownOptions(StartCalculationType);

  selectedExecutionType = 'ACTUAL';
  latestPeriodEnd?: Date | string | null;
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

  createCalculation() {
    const {
      executionType,
      calculationType,
      dateRange: interval,
      yearMonth,
      gridAreas,
      isScheduled,
      scheduledAt,
    } = this.formGroup.getRawValue();

    if (
      this.formGroup.invalid ||
      executionType === null ||
      calculationType === null ||
      (interval === null && yearMonth === null)
    )
      return;

    const period =
      this.formGroup.controls.dateRange.enabled && interval ? { interval } : { yearMonth };

    this._apollo
      .mutate({
        useMutationLoading: true,
        mutation: CreateCalculationDocument,
        refetchQueries: [GetCalculationsDocument],
        variables: {
          input: {
            executionType,
            calculationType,
            period,
            gridAreaCodes: gridAreas,
            scheduledAt: isScheduled ? scheduledAt : null,
          },
        },
      })
      .subscribe({
        next: (result) => {
          // Update loading state of button
          this.loading = result.loading ?? false;

          if (result.loading) {
            this._toast.open({
              type: 'loading',
              message: this._transloco.translate('wholesale.calculations.create.toast.loading'),
            });
          } else if (result.errors) {
            this._toast.update({
              type: 'danger',
              message: this._transloco.translate('wholesale.calculations.create.toast.error'),
            });
          } else {
            this._toast.update({
              type: 'success',
              message: this._transloco.translate('wholesale.calculations.create.toast.success'),
            });
          }
        },
        error: () => {
          this.loading = false;
          this._toast.update({
            type: 'danger',
            message: this._transloco.translate('wholesale.calculations.create.toast.error'),
          });
        },
      });
  }

  onClose(accepted: boolean) {
    if (accepted) this.createCalculation();
    this.reset();
    this.confirmFormControl.reset();
  }

  reset() {
    this.latestPeriodEnd = null;
    this.showPeriodWarning = false;
    this.formGroup.reset();

    // This is apparently neccessary to reset the dropdown validity state
    this.formGroup.controls.calculationType.setErrors(null);
  }

  private validateWholesale(): Observable<null> {
    const { calculationType, dateRange: interval, yearMonth } = this.formGroup.controls;

    // Hide warning initially
    this.latestPeriodEnd = null;

    // Skip validation if calculation type is aggregation
    if (calculationType.value === StartCalculationType.Aggregation) return of(null);

    // Skip validation if dateRange is enabled, but incomplete
    if (interval.enabled && (!interval.value?.start || !interval.value?.end)) return of(null);

    // Skip validation if yearMonth is enabled, but empty
    if (yearMonth.enabled && !yearMonth.value) return of(null);

    // This observable always returns null (no error)
    return this._apollo
      .query({
        query: GetLatestCalculationDocument,
        fetchPolicy: 'network-only',
        variables: {
          calculationType: calculationType.value,
          period: interval.value ? { interval: interval.value } : { yearMonth: yearMonth.value },
        },
      })
      .pipe(
        map((result) => result.data.latestCalculation),
        tap((calculation) => {
          if (!calculation) return;
          switch (calculation.__typename) {
            case 'WholesaleAndEnergyCalculation':
              this.latestPeriodEnd = calculation.period?.end;
              break;
            case 'CapacitySettlementCalculation':
              this.latestPeriodEnd = calculation.yearMonth;
              break;
            case 'NetConsumptionCalculation':
            case 'ElectricalHeatingCalculation':
              break;
          }
        }),
        map(() => null)
      );
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
