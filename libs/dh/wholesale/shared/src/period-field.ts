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
import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PeriodInput, StartCalculationType } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { WattYearMonthField } from '@energinet-datahub/watt/yearmonth-field';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { dayjs, WattRange } from '@energinet-datahub/watt/date';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { TranslocoDirective } from '@jsverse/transloco';

const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
const monthOnlyCalculationTypes = [
  StartCalculationType.WholesaleFixing,
  StartCalculationType.FirstCorrectionSettlement,
  StartCalculationType.SecondCorrectionSettlement,
  StartCalculationType.ThirdCorrectionSettlement,
  StartCalculationType.CapacitySettlement,
];

@Component({
  selector: 'dh-calculations-period-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoDirective, WattDatepickerComponent, WattYearMonthField],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DhCalculationsPeriodField),
      multi: true,
    },
  ],
  template: `
    <ng-container *transloco="let t; read: 'wholesale.calculations'">
      @if (monthOnly()) {
        <watt-yearmonth-field
          [label]="t('create.period.label')"
          [formControl]="form.controls.yearMonth"
          [min]="min()"
          [max]="max()"
          data-testid="period.yearMonth"
        />
      } @else {
        <watt-datepicker
          [label]="t('create.period.label')"
          [formControl]="form.controls.interval"
          [range]="true"
          [min]="min()"
          [max]="max()"
          data-testid="period.interval"
        >
          <ng-content />
        </watt-datepicker>
      }
    </ng-container>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhCalculationsPeriodField implements ControlValueAccessor {
  calculationType = input.required<StartCalculationType>();
  min = input<Date>();
  max = input<Date>();

  form = new FormGroup({
    interval: dhMakeFormControl<WattRange<string>>(null, WattRangeValidators.required),
    yearMonth: dhMakeFormControl<string>(null, Validators.required),
  });

  value = toSignal(this.form.valueChanges);
  monthOnly = computed(() => monthOnlyCalculationTypes.includes(this.calculationType()));
  periodChange = toObservable(
    computed<PeriodInput | null>(() => {
      // dependencies
      this.calculationType(); // emit new value when calculationType changes
      const value = this.value(); // or when value changes
      const monthOnly = this.monthOnly();

      // emit either yearMonth or interval depending on calculationType
      if (monthOnly && value?.yearMonth) {
        return { yearMonth: value.yearMonth };
      } else if (!monthOnly && value?.interval) {
        return {
          interval: {
            start: dayjs(value.interval.start).toDate(),
            end: dayjs(value.interval.end).toDate(),
          },
        };
      }

      // not yet valid
      return null;
    })
  );

  // Implementation for ControlValueAccessor
  setDisabledState = (disabled: boolean) => (disabled ? this.form.disable() : this.form.enable());
  registerOnChange = (fn: (value: PeriodInput | null) => void) => this.periodChange.subscribe(fn);
  writeValue = noop; // intentionally left empty
  registerOnTouched = noop; // intentionally left empty
}
