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

import { map, startWith } from 'rxjs';

import { dayjs } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
// import { WattSlideToggleComponent } from '@energinet-datahub/watt/slide-toggle';

import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { QueryVariablesV2 } from '../../types';
// import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';

@Component({
  selector: 'dh-measurements-filter',
  imports: [
    ReactiveFormsModule,
    WattDatepickerComponent,
    // WattSlideToggleComponent,
    VaterStackComponent,
    // DhFeatureFlagDirective,
  ],
  styles: `
    watt-datepicker {
      width: 200px;
    }
  `,
  template: `
    <vater-stack direction="row" gap="ml" align="baseline">
      <watt-datepicker [formControl]="date" [max]="maxDate" />
      <!-- <watt-slide-toggle *dhFeatureFlag="'measurements-v2'" [formControl]="showHistoricValues">
        Show historic values
      </watt-slide-toggle>
      <watt-slide-toggle *dhFeatureFlag="'measurements-v2'" [formControl]="showOnlyChangedValues">
        Show only changed values
      </watt-slide-toggle> -->
    </vater-stack>
  `,
})
export class DhMeasurementsFilterComponent {
  private fb = inject(NonNullableFormBuilder);
  maxDate = dayjs().subtract(2, 'days').toDate();
  date = this.fb.control<Date>(this.maxDate);
  showHistoricValues = this.fb.control(false);
  showOnlyChangedValues = this.fb.control(false);

  filter = output<QueryVariablesV2>();

  constructor() {
    effect(() => this.filter.emit(this.values()));
  }

  values = toSignal<QueryVariablesV2>(
    this.date.valueChanges.pipe(
      startWith(null),
      map(() => this.date.getRawValue()),
      exists(),
      map((date) => ({
        date: dayjs(date).format('YYYY-MM-DD'),
      }))
    ),
    { requireSync: true }
  );
}
