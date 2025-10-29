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
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, effect, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, map } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { dayjs } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattSlideToggleComponent } from '@energinet-datahub/watt/slide-toggle';

import { dhFormControlToSignal } from '@energinet-datahub/dh/shared/ui-util';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { MeasurementsQueryVariables } from '../types';
import { persistDateFilter } from '../utils/persist-date-filter';

@Component({
  selector: 'dh-measurements-day-filter',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WattDatepickerComponent,
    WattSlideToggleComponent,
    VaterStackComponent,
  ],
  styles: `
    watt-datepicker {
      width: 240px;
    }
  `,
  template: `
    <form [formGroup]="form">
      <vater-stack
        direction="row"
        gap="ml"
        align="baseline"
        *transloco="let t; prefix: 'meteringPoint.measurements.filters'"
      >
        <watt-datepicker [formControl]="form.controls.date" canStepThroughDays />
        <watt-slide-toggle [formControl]="form.controls.showHistoricValues">
          {{ t('showHistoricValues') }}
        </watt-slide-toggle>
        <watt-slide-toggle [formControl]="form.controls.showOnlyChangedValues">
          {{ t('showOnlyChangedValues') }}
        </watt-slide-toggle>
      </vater-stack>
    </form>
  `,
})
export class DhMeasurementsDayFilterComponent {
  private fb = inject(NonNullableFormBuilder);
  private dateFilter = persistDateFilter();
  form = this.fb.group({
    date: this.fb.control<Date>(this.dateFilter().toDate()),
    showHistoricValues: this.fb.control(false),
    showOnlyChangedValues: this.fb.control(false),
  });

  date = dhFormControlToSignal(this.form.controls.date);
  filterEffect = effect(() => this.dateFilter.set(dayjs(this.date())));

  filter = output<MeasurementsQueryVariables>();

  constructor() {
    effect(() => {
      const values = this.values();
      if (!values) return;
      this.filter.emit(values);
    });
  }

  values = toSignal<MeasurementsQueryVariables>(
    this.form.valueChanges.pipe(
      debounceTime(500),
      map(() => this.form.getRawValue()),
      exists(),
      map(({ date, showHistoricValues, showOnlyChangedValues }) => ({
        date: dayjs(date).format('YYYY-MM-DD'),
        showHistoricValues,
        showOnlyChangedValues,
      }))
    )
  );
}
