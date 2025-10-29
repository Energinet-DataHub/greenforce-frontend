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
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterFlexComponent } from '@energinet/watt/vater';
import { WattDatePipe, dayjs } from '@energinet/watt/date';
import { WattFieldErrorComponent, WattFieldWarningComponent } from '@energinet/watt/field';
import { WattValidationMessageComponent } from '@energinet/watt/validation-message';

import {
  StartCalculationType,
  CalculationExecutionType,
  PeriodInput,
  CreateCalculationInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhFormControlErrorToSignal,
  dhFormControlToSignal,
  dhFormErrorsWarningsOnly,
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
  PeriodErrors,
} from './create-validators';
import { DhCalculationTypeField } from './fields/calculationtype-field';
import { DhScheduleField } from './fields/schedule-field';
import { DhExecutionTypeField } from './fields/executiontype-field';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-calculations-create-form',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterFlexComponent,
    WattValidationMessageComponent,
    WattFieldErrorComponent,
    WattFieldWarningComponent,
    WattDatePipe,
    DhScheduleField,
    DhExecutionTypeField,
    DhCalculationsPeriodField,
    DhCalculationsGridAreasDropdown,
    DhCalculationTypeField,
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
      @if (existingCalculation(); as calculation) {
        <watt-validation-message size="normal" type="warning" icon="warning">
          {{ t('errors.existing.' + calculation.type, { period: calculation.period | wattDate }) }}
        </watt-validation-message>
      }

      @if (resolutionTransition(); as transitionDate) {
        <watt-validation-message size="normal" type="danger" icon="danger">
          {{ t('errors.resolutionTransition', { transitionDate: transitionDate | wattDate }) }}
        </watt-validation-message>
      }

      <dh-executiontype-field [control]="form.controls.executionType" />
      <dh-schedule-field
        [hidden]="hideSchedule()"
        [disabled]="hideSchedule()"
        [datetime]="form.controls.scheduledAt"
      />
      <dh-calculationtype-field
        [control]="form.controls.calculationType"
        [executionType]="form.controls.executionType.value"
      />
      <dh-calculations-period-field
        [formControl]="form.controls.period"
        [calculationType]="calculationType()"
        [pending]="form.controls.period.status === 'PENDING'"
        [min]="minDate"
        [max]="maxDate()"
      >
        @if (form.controls.period.errors?.resolutionTransition) {
          <watt-field-error>
            {{ t('period.invalid') }}
          </watt-field-error>
        } @else if (form.controls.period.errors?.required) {
          <watt-field-error>
            {{ t('period.empty') }}
          </watt-field-error>
        } @else if (form.controls.period.errors?.existingCalculation) {
          <watt-field-warning>
            {{ t('period.warning.' + existingCalculation()?.type) }}
          </watt-field-warning>
        }
      </dh-calculations-period-field>
      <dh-calculations-grid-areas-dropdown
        [hidden]="!hasGridAreas()"
        [disabled]="!hasGridAreas()"
        [control]="form.controls.gridAreaCodes"
        [period]="this.form.controls.period.value"
      />
    </form>
  `,
})
export class DhCalculationsCreateFormComponent {
  readonly create = output<CreateCalculationInput>();
  protected form = new FormGroup({
    executionType: dhMakeFormControl<CalculationExecutionType>(null, Validators.required),
    scheduledAt: dhMakeFormControl<Date>(),
    calculationType: dhMakeFormControl<StartCalculationType>('BALANCE_FIXING'),
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

  calculationType = dhFormControlToSignal(this.form.controls.calculationType);
  hasGridAreas = computed(() => this.calculationType() !== StartCalculationType.CapacitySettlement);
  hideSchedule = computed(() => this.calculationType() === StartCalculationType.CapacitySettlement);

  periodErrors = dhFormControlErrorToSignal<PeriodErrors>(this.form.controls.period);
  existingCalculation = computed(() => this.periodErrors()?.existingCalculation);
  resolutionTransition = computed(() => this.periodErrors()?.resolutionTransition);

  status = toSignal(this.form.statusChanges);
  value = toSignal(this.form.valueChanges);
  valid = computed(() => {
    this.value(); // intentionally tracking value
    return this.status() === 'INVALID'
      ? dhFormErrorsWarningsOnly(this.form)
      : this.status() === 'VALID';
  });

  submit = () => {
    const { calculationType, executionType, scheduledAt, period, gridAreaCodes } = this.form.value;

    // Required fields
    assertIsDefined(calculationType);
    assertIsDefined(executionType);
    assertIsDefined(period);

    this.create.emit({
      executionType,
      scheduledAt,
      calculationType,
      period,
      gridAreaCodes,
    });
  };
}
