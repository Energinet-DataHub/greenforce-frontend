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
import { ChangeDetectionStrategy, Component, computed, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattDatePipe, dayjs } from '@energinet-datahub/watt/date';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import {
  StartCalculationType,
  CalculationExecutionType,
  CreateCalculationMutationVariables,
  PeriodInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { getMinDate } from '@energinet-datahub/dh/wholesale/domain';

import {
  DhCalculationsGridAreasDropdown,
  DhCalculationsPeriodField,
} from '@energinet-datahub/dh/wholesale/shared';
import {
  injectExistingCalculationValidator,
  injectResolutionTransitionValidator,
} from './create-validators';
import { DhCalculationsScheduleField } from './schedule-field';
import { DhCalculationsExecutionTypeField } from './executiontype-field';
import { assert, assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      vater-flex
      direction="column"
      gap="s"
      offset="m"
      *transloco="let t; prefix: 'wholesale.calculations.create'"
      [formGroup]="form"
    >
      @if (form.controls.period.errors?.resolutionTransition) {
        <watt-validation-message size="normal" type="danger" icon="danger">
          {{
            t('quarterlyResolutionTransitionError', {
              resolutionTransitionDate:
                form.controls.period.errors?.resolutionTransition | wattDate,
            })
          }}
        </watt-validation-message>
      } @else if (existingCalculation()) {
        <watt-validation-message size="normal" type="warning" icon="warning">
          {{ t('warn.' + calculationType(), { period: existingCalculation().period | wattDate }) }}
        </watt-validation-message>
      }
      <dh-calculations-executiontype-field [control]="form.controls.executionType" />
      <dh-calculations-schedule-field
        [hidden]="isCapacitySettlement()"
        [disabled]="isCapacitySettlement()"
        [datetime]="form.controls.scheduledAt"
      />
      <watt-dropdown
        [label]="t('calculationType.label')"
        [formControl]="form.controls.calculationType"
        [options]="calculationTypeOptions"
        [showResetOption]="false"
        [multiple]="false"
        dhDropdownTranslator
        translateKey="wholesale.calculations.calculationTypes"
        data-testid="newcalculation.calculationTypes"
      />
      <dh-calculations-period-field
        [formControl]="form.controls.period"
        [calculationType]="calculationType()"
        [min]="minDate"
        [max]="maxDate()"
      >
        @if (form.controls.period.errors?.resolutionTransition) {
          <watt-field-error>
            {{ t('period.invalid') }}
          </watt-field-error>
        }
      </dh-calculations-period-field>
      <dh-calculations-grid-areas-dropdown
        [hidden]="isCapacitySettlement()"
        [disabled]="isCapacitySettlement()"
        [control]="form.controls.gridAreaCodes"
        [period]="period()"
      />
    </form>
  `,
})
export class DhCalculationsCreateFormComponent {
  calculationTypeOptions = dhEnumToWattDropdownOptions(StartCalculationType);
  form = new FormGroup({
    executionType: dhMakeFormControl<CalculationExecutionType>(null, Validators.required),
    scheduledAt: dhMakeFormControl<Date>(),
    calculationType: dhMakeFormControl(StartCalculationType.BalanceFixing),
    gridAreaCodes: dhMakeFormControl<string[]>(null, Validators.required),
    period: dhMakeFormControl<PeriodInput>(
      null,
      [Validators.required, injectResolutionTransitionValidator()],
      injectExistingCalculationValidator()
    ),
  });

  scheduledAt = toSignal(this.form.controls.scheduledAt.valueChanges);
  minDate = getMinDate();
  maxDate = computed(() =>
    dayjs(this.scheduledAt() ?? new Date())
      .subtract(1, 'day')
      .toDate()
  );

  // executionTypeControl = this.formGroup.controls.executionType;
  // calculationTypeControl = this.formGroup.controls.calculationType;

  calculationType = toSignal(this.form.controls.calculationType.valueChanges, {
    initialValue: this.form.controls.calculationType.value,
  });

  isCapacitySettlement = computed(
    () => this.calculationType() === StartCalculationType.CapacitySettlement
  );

  status = toSignal(this.form.statusChanges);
  value = toSignal(this.form.valueChanges);

  // TODO: Fix type? Also fix stupid "missing translation" for aggregation
  existingCalculation = computed(() => {
    this.status(); // update on statusChanges
    this.value(); // update on valueChanges
    console.log(this.form.controls.period.errors?.existingCalculation);
    return this.form.controls.period.errors?.existingCalculation;
  });

  valid = computed(() => {
    this.status(); // track
    this.value(); // track

    // const result = [];
    const isOnlyWarnings = Object.keys(this.form.controls).every((key) => {
      const errors: ValidationErrors | null = this.form.get(key)?.errors ?? null;
      console.log(errors);
      return !errors ? true : Object.keys(errors).every((key) => errors[key].warning);
    });
    console.log(this.status());
    return this.status() === 'VALID' || isOnlyWarnings;
  });

  period = toSignal(this.form.controls.period.valueChanges, { initialValue: null });

  // executionType = toSignal(this.executionTypeControl.valueChanges);
  // isInternalCalculation = computed(
  //   () => this.executionType() === CalculationExecutionType.Internal
  // );

  test = (x: unknown) => console.log(x);
  warn = output();
  create = output<CreateCalculationMutationVariables>();

  constructor() {
    this.form.controls.executionType.valueChanges.subscribe((executionType) => {
      if (executionType == CalculationExecutionType.Internal) {
        this.form.controls.calculationType.disable();
        this.form.controls.calculationType.setValue(StartCalculationType.Aggregation);
      } else {
        this.form.controls.calculationType.enable();
      }
    });
  }

  submit = (): CreateCalculationMutationVariables => {
    const { calculationType } = this.form.getRawValue();
    const { executionType, scheduledAt, period, gridAreaCodes } = this.form.value;

    // Satisfy the type checker
    assertIsDefined(executionType);
    assertIsDefined(period);

    return {
      input: {
        executionType,
        scheduledAt,
        calculationType,
        period,
        gridAreaCodes,
      },
    };
  };
}
