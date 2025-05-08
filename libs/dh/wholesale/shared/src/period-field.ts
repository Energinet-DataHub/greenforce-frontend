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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PeriodInput } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { WattYearMonthField } from '@energinet-datahub/watt/yearmonth-field';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { dayjs, WattRange } from '@energinet-datahub/watt/date';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { TranslocoDirective } from '@jsverse/transloco';

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
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <ng-container *transloco="let t; read: 'wholesale.calculations'">
      <!-- Period -->
      @if (monthOnly()) {
        <watt-yearmonth-field
          [label]="t('create.period.label')"
          [formControl]="formGroup.controls.yearMonth"
          [min]="min()"
          [max]="max()"
          data-testid="period.yearMonth"
        />
      } @else {
        <watt-datepicker
          [label]="t('create.period.label')"
          [formControl]="formGroup.controls.interval"
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
  monthOnly = input(false);
  min = input<Date>();
  max = input<Date>();

  formGroup = new FormGroup({
    interval: dhMakeFormControl<WattRange<string>>(null, WattRangeValidators.required),
    yearMonth: dhMakeFormControl<string>(null, Validators.required),
  });

  disableEffect = effect(() => {
    if (this.monthOnly()) {
      this.formGroup.controls.yearMonth.enable();
      this.formGroup.controls.interval.disable();
    } else {
      this.formGroup.controls.yearMonth.disable();
      this.formGroup.controls.interval.enable();
    }
  });

  value = toSignal(this.formGroup.valueChanges);
  period = computed<PeriodInput | null>(() => {
    // dependencies
    const value = this.value();
    const monthOnly = this.monthOnly();

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
  });

  periodChange = toObservable(this.period);

  writeValue = (period: PeriodInput | null) => {
    if (!period) return;

    if (period.interval) {
      this.formGroup.controls.interval.patchValue({
        start: period.interval.start.toISOString(),
        end: period.interval.end?.toISOString() ?? null,
      });
    } else if (period.yearMonth) {
      this.formGroup.controls.yearMonth.patchValue(period.yearMonth);
    }
  };

  registerOnChange = (fn: (value: PeriodInput | null) => void) => this.periodChange.subscribe(fn);
  registerOnTouched = () => {
    // intentionally left empty
  };

  setDisabledState = (disabled: boolean) => {
    if (disabled) this.formGroup.disable();
    else this.formGroup.enable();
  };
}
