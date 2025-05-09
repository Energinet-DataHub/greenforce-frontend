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
import { Component, computed, effect, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { map } from 'rxjs';

import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattDatePipe, dayjs } from '@energinet-datahub/watt/date';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { Range } from '@energinet-datahub/dh/shared/domain';
import {
  StartCalculationType,
  CalculationExecutionType,
  GetLatestCalculationDocument,
  CreateCalculationMutationVariables,
  PeriodInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { getMinDate } from '@energinet-datahub/dh/wholesale/domain';

import {
  DhCalculationsGridAreasDropdown,
  DhCalculationsPeriodField,
} from '@energinet-datahub/dh/wholesale/shared';
import { DhCalculationsScheduleField } from './schedule-field';
import { DhCalculationsExecutionTypeField } from './executiontype-field';

@Component({
  selector: 'dh-calculations-create-form',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattDatePipe,
    WattDropdownComponent,
    WattValidationMessageComponent,
    WattFieldErrorComponent,
    VaterFlexComponent,
    DhCalculationsExecutionTypeField,
    DhCalculationsGridAreasDropdown,
    DhCalculationsPeriodField,
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
      @if (formGroup.controls.period.errors?.resolutionTransition) {
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
      <dh-calculations-period-field
        [formControl]="formGroup.controls.period"
        [monthOnly]="monthOnly.includes(calculationTypeControl.value)"
        [min]="minDate"
        [max]="maxDate()"
      >
        @if (formGroup.controls.period.errors?.resolutionTransition) {
          <watt-field-error>{{ t('create.period.invalid') }}</watt-field-error>
        }
      </dh-calculations-period-field>

      <!-- Grid areas -->
      @if (calculationTypeControl.value !== CalculationType.CapacitySettlement) {
        <dh-calculations-grid-areas-dropdown
          [control]="formGroup.controls.gridAreas"
          [period]="formGroup.controls.period.value"
        />
      }
    </form>
  `,
})
export class DhCalculationsCreateFormComponent {
  latestCalculation = lazyQuery(GetLatestCalculationDocument, { fetchPolicy: 'network-only' });
  latestPeriod = computed(() => {
    const calculation = this.latestCalculation.data()?.latestCalculation;
    switch (calculation?.__typename) {
      case 'WholesaleAndEnergyCalculation':
        return calculation.period?.end;
      case 'CapacitySettlementCalculation':
        return calculation.yearMonth;
      case 'NetConsumptionCalculation':
      case 'ElectricalHeatingCalculation':
      case undefined:
        return null;
    }
  });

  formGroup = new FormGroup(
    {
      executionType: dhMakeFormControl<CalculationExecutionType>(null, Validators.required),
      scheduledAt: dhMakeFormControl<Date>(),
      calculationType: dhMakeFormControl(StartCalculationType.BalanceFixing),
      period: dhMakeFormControl<PeriodInput>(null, [
        Validators.required,
        this.validateResolutionTransition(), // TODO: Fix
      ]),
      gridAreas: dhMakeFormControl<string[]>(null, Validators.required),
    },
    { asyncValidators: () => this.validateWholesale() }
  );

  executionTypeControl = this.formGroup.controls.executionType;
  calculationTypeControl = this.formGroup.controls.calculationType;
  calculationType = toSignal(this.calculationTypeControl.valueChanges);

  disableHiddenFields = effect(() => {
    // TODO: this enables grid areas if you switch between types, even though
    // grid areas should be disabled until RelevantGridAreas has been fetched
    // maybe fix by if previous === CapacitySettlement? not pretty, but...
    if (this.calculationType() === StartCalculationType.CapacitySettlement) {
      console.log('hidden');
      this.formGroup.controls.gridAreas.disable(); // TODO: [disabled] in template instead?
      this.formGroup.controls.scheduledAt.disable(); // TODO: [disabled] in template instead?
    } else {
      this.formGroup.controls.gridAreas.enable();
      this.formGroup.controls.scheduledAt.enable();
    }
  });

  test = (x: unknown) => console.log(x);
  warn = output();
  create = output<CreateCalculationMutationVariables>();

  submit = (force = false) => {
    const calculationType = this.formGroup.controls.calculationType.value;
    const latestPeriod = this.latestPeriod();

    if (!force && latestPeriod) {
      this.warn.emit();
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

  constructor() {
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
    const { calculationType, period } = this.formGroup.controls;

    // Hide the warning initially
    this.latestCalculation.reset();

    // Skip validation if calculation type is aggregation
    if (calculationType.value === StartCalculationType.Aggregation) return null;

    // Skip validation if period is empty
    if (!period.value) return null;

    // This always returns null (no error)
    return this.latestCalculation
      .query({
        variables: {
          calculationType: calculationType.value,
          period: period.value,
        },
      })
      .then(() => null);
  }

  private validateResolutionTransition(): ValidatorFn {
    return (control: AbstractControl<PeriodInput | null>): ValidationErrors | null => {
      const interval = control.value?.interval;
      if (!interval) return null; // yearMonth cannot span resolution transition date
      const start = dayjs.utc(interval.start);
      const end = dayjs.utc(interval.end);
      const transitionDate = dayjs.utc(this.resolutionTransitionDate);
      return start.isBefore(transitionDate) && end.isAfter(transitionDate)
        ? { resolutionTransition: true } // TODO: FIX NG0100
        : null;
    };
  }
}
