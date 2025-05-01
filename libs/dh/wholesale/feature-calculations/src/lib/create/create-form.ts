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
import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { map } from 'rxjs';

import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattDatePipe, WattRange, dayjs } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattYearMonthField } from '@energinet-datahub/watt/yearmonth-field';

import { Range } from '@energinet-datahub/dh/shared/domain';
import {
  StartCalculationType,
  CalculationExecutionType,
  GetLatestCalculationDocument,
  CreateCalculationMutationVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { getMinDate } from '@energinet-datahub/dh/wholesale/domain';

import { DhCalculationsGridAreasDropdownComponent } from '../grid-areas/dropdown.component';
import { DhCalculationsScheduleField } from './schedule-field';
import { DhCalculationsExecutionTypeField } from './executiontype-field';

interface FormValues {
  executionType: FormControl<CalculationExecutionType | null>;
  calculationType: FormControl<StartCalculationType>;
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<WattRange<Date> | null>;
  yearMonth: FormControl<string | null>;
  scheduledAt: FormControl<Date | null>;
}

@Component({
  selector: 'dh-calculations-create-form',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattDatePipe,
    WattDatepickerComponent,
    WattDropdownComponent,
    WattValidationMessageComponent,
    WattFieldErrorComponent,
    WattYearMonthField,
    VaterFlexComponent,
    DhCalculationsExecutionTypeField,
    DhCalculationsGridAreasDropdownComponent,
    DhCalculationsScheduleField,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      *transloco="let t; read: 'wholesale.calculations'"
      vater-flex
      direction="column"
      gap="s"
      offset="m"
      [formGroup]="formGroup"
    >
      <!-- Quarterly Resolution Transition Error -->
      @if (formGroup.controls.dateRange.errors?.resolutionTransition) {
        <watt-validation-message size="normal" type="danger" icon="danger">
          {{
            t('create.quarterlyResolutionTransitionError', {
              resolutionTransitionDate: resolutionTransitionDate | wattDate,
            })
          }}
        </watt-validation-message>
      } @else if (latestPeriod()) {
        <watt-validation-message size="normal" type="warning" icon="warning">
          {{
            t('create.periodWarning.' + calculationTypeControl.value, {
              latestPeriod: latestPeriod() | wattDate,
            })
          }}
        </watt-validation-message>
      }

      <!-- Execution type -->
      <dh-calculations-executiontype-field [control]="formGroup.controls.executionType" />

      <!-- Scheduling -->
      @if (calculationTypeControl.value !== CalculationType.CapacitySettlement) {
        <dh-calculations-schedule-field [datetime]="formGroup.controls.scheduledAt" />
      }

      <!-- Calculation type -->
      <watt-dropdown
        [label]="t('create.calculationType.label')"
        [formControl]="calculationTypeControl"
        [options]="calculationTypesOptions"
        [showResetOption]="false"
        [multiple]="false"
        dhDropdownTranslator
        translateKey="wholesale.calculations.calculationTypes"
        data-testid="newcalculation.calculationTypes"
      />

      <!-- Period -->
      @if (monthOnly.includes(calculationTypeControl.value)) {
        <watt-yearmonth-field
          [label]="t('create.period.label')"
          [formControl]="formGroup.controls.yearMonth"
          [min]="minDate"
          [max]="maxDate()"
        />
      } @else {
        <watt-datepicker
          [label]="t('create.period.label')"
          [formControl]="formGroup.controls.dateRange"
          [range]="true"
          [min]="minDate"
          [max]="maxDate()"
          data-testid="newcalculation.datePeriod"
        >
          @if (formGroup.controls.dateRange.errors?.resolutionTransition) {
            <watt-field-error>{{ t('create.period.invalid') }}</watt-field-error>
          }
        </watt-datepicker>
      }

      <!-- Grid areas -->
      @if (calculationTypeControl.value === CalculationType.CapacitySettlement) {
        <dh-calculations-grid-areas-dropdown
          [control]="formGroup.controls.gridAreas"
          [period]="period()"
        />
      }
    </form>
  `,
})
export class DhCalculationsCreateFormComponent {
  latestCalculation = lazyQuery(GetLatestCalculationDocument, { fetchPolicy: 'network-only' });
  latestPeriod = computed(() => {
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
      scheduledAt: new FormControl<Date | null>(null),
    },
    { asyncValidators: () => this.validateWholesale() }
  );

  executionTypeControl = this.formGroup.controls.executionType;
  calculationTypeControl = this.formGroup.controls.calculationType;

  // (warning)="calculationToConfirm.set($event)"
  // (create)="create.mutate({ variables: $event })"
  // (create)="modal.close()"
  // submit()

  test = (x: unknown) => console.log(x);
  warning = output<StartCalculationType>();
  create = output<CreateCalculationMutationVariables>();

  submit = (force = false) => {
    const calculationType = this.formGroup.controls.calculationType.value;
    const latestPeriod = this.latestPeriod();

    if (!force && latestPeriod) {
      // TODO: Consider emitting void/true, then access calculationType on #form
      this.warning.emit(calculationType);
      return;
    }

    console.log(calculationType);
    // latestPeriod() && calculationType.value !== CalculationType.CapacitySettlement
    //   ? (showPeriodWarning = true)
    //   : modal.close(true)
  };

  // makeInput = (): CreateCalculationInput => {
  //   const { calculationType } = this.formGroup.getRawValue();
  //   const { executionType, gridAreas, scheduledAt } = this.formGroup.value;
  //   const period = this.period();

  //   // Satisfy the type checker, since fields should be defined at this point (due to validators)
  //   assertIsDefined(calculationType);
  //   assertIsDefined(executionType);
  //   assertIsDefined(period);

  //   return {
  //     executionType,
  //     calculationType,
  //     period,
  //     gridAreaCodes: gridAreas,
  //     scheduledAt: scheduledAt,
  //   };

  calculationTypesOptions = dhEnumToWattDropdownOptions(StartCalculationType);

  showPeriodWarning = false;

  monthOnly = [
    StartCalculationType.WholesaleFixing,
    StartCalculationType.FirstCorrectionSettlement,
    StartCalculationType.SecondCorrectionSettlement,
    StartCalculationType.ThirdCorrectionSettlement,
    StartCalculationType.CapacitySettlement,
  ];

  ffs = inject(DhFeatureFlagsService);
  resolutionTransitionDate = this.ffs.isEnabled('quarterly-resolution-transition-datetime-override')
    ? '2023-01-31T23:00:00Z'
    : '2023-04-30T22:00:00Z';

  CalculationType = StartCalculationType;

  valid = toSignal(this.formGroup.statusChanges.pipe(map((x) => x === 'VALID')));
  scheduledAt = toSignal(this.formGroup.controls.scheduledAt.valueChanges);

  minDate = getMinDate();
  maxDate = computed(() =>
    dayjs(this.scheduledAt() ?? new Date())
      .subtract(1, 'day')
      .toDate()
  );

  // executionType = this.formGroup.controls.executionType;
  // calculationType = this.formGroup.controls.calculationType;
  interval = toSignal(this.formGroup.controls.dateRange.valueChanges);
  yearMonth = toSignal(this.formGroup.controls.yearMonth.valueChanges);
  intervalStatus = toSignal(this.formGroup.controls.dateRange.statusChanges);

  period = computed(() => {
    const interval = this.interval() ?? undefined;
    const yearMonth = this.yearMonth() ?? undefined;
    if (this.intervalStatus() !== 'DISABLED') return interval ? { interval } : undefined;
    else return yearMonth ? { yearMonth } : undefined;
  });

  constructor() {
    this.formGroup.controls.calculationType.valueChanges.subscribe((value) => {
      if (value === StartCalculationType.CapacitySettlement) {
        this.formGroup.controls.gridAreas.disable();
        this.formGroup.controls.scheduledAt.disable();
      } else {
        this.formGroup.controls.gridAreas.enable();
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

    this.formGroup.controls.executionType.valueChanges.subscribe((executionType) => {
      if (executionType == CalculationExecutionType.Internal) {
        this.formGroup.controls.calculationType.disable();
        this.formGroup.controls.calculationType.setValue(StartCalculationType.Aggregation);
      } else {
        this.formGroup.controls.calculationType.enable();
      }
    });
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
}
