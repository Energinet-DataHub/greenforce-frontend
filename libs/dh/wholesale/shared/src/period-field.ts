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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { skip } from 'rxjs';

import {
  PeriodInput,
  RequestCalculationType,
  StartCalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

import { dayjs, WattRange } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattYearMonthField } from '@energinet-datahub/watt/yearmonth-field';

import { isMonthOnly } from '@energinet-datahub/dh/wholesale/domain';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'dh-calculations-period-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    ReactiveFormsModule,
    TranslocoDirective,
    WattDatepickerComponent,
    WattFieldHintComponent,
    WattYearMonthField,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DhCalculationsPeriodField),
      multi: true,
    },
  ],
  template: `
    <ng-container *transloco="let t; read: 'wholesale.calculations'">
      <ng-template #error><ng-content select="watt-field-error" /></ng-template>
      <ng-template #hint>
        @if (pending()) {
          <watt-field-hint class="watt-dots">{{ t('create.period.pending') }}</watt-field-hint>
        }
        <ng-content select="watt-field-hint" />
      </ng-template>
      @if (monthOnly()) {
        <watt-yearmonth-field
          [label]="t('create.period.label')"
          [formControl]="form.controls.yearMonth"
          [min]="min()"
          [max]="max()"
          data-testid="period.yearMonth"
        >
          <ng-container *ngTemplateOutlet="error" ngProjectAs="watt-field-error" />
          <ng-container *ngTemplateOutlet="hint" ngProjectAs="watt-field-hint" />
        </watt-yearmonth-field>
      } @else {
        <watt-datepicker
          [label]="t('create.period.label')"
          [formControl]="form.controls.interval"
          [range]="true"
          [min]="min()"
          [max]="max()"
          data-testid="period.interval"
        >
          <ng-container *ngTemplateOutlet="error" ngProjectAs="watt-field-error" />
          <ng-container *ngTemplateOutlet="hint" ngProjectAs="watt-field-hint" />
        </watt-datepicker>
      }
      <ng-content />
    </ng-container>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhCalculationsPeriodField implements ControlValueAccessor {
  calculationType = input.required<StartCalculationType | RequestCalculationType>();
  min = input<Date>();
  max = input<Date>();
  pending = input(false);

  form = new FormGroup({
    interval: dhMakeFormControl<WattRange<string>>(null),
    yearMonth: dhMakeFormControl<string>(null),
  });

  value = toSignal(this.form.valueChanges);
  monthOnly = computed(() => isMonthOnly(this.calculationType()));
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
  registerOnTouched = (fn: () => void) => this.form.valueChanges.pipe(skip(1)).subscribe(fn);
  writeValue = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
}
