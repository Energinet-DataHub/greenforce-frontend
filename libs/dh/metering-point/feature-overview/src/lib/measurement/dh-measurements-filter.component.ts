import { Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { dayjs } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattSlideToggleComponent } from '@energinet-datahub/watt/slide-toggle';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { map, startWith } from 'rxjs';
import { QueryVariables } from '../types';

@Component({
  selector: 'dh-measurements-filter',
  imports: [
    ReactiveFormsModule,
    WattDatepickerComponent,
    WattSlideToggleComponent,
    VaterStackComponent,
  ],
  styles: `
    watt-datepicker {
      width: 200px;
    }
  `,
  template: `
    <vater-stack direction="row" gap="ml" align="baseline">
      <watt-datepicker [formControl]="date" [max]="maxDate" />
      <watt-slide-toggle [formControl]="showHistoricValues">
        Show historic values
      </watt-slide-toggle>
      <watt-slide-toggle [formControl]="showOnlyChangedValues">
        Show only changed values
      </watt-slide-toggle>
    </vater-stack>
  `,
})
export class DhMeasurementsFilterComponent {
  private fb = inject(NonNullableFormBuilder);
  maxDate = dayjs().subtract(2, 'days').toDate();
  date = this.fb.control<Date>(this.maxDate);
  showHistoricValues = this.fb.control(false);
  showOnlyChangedValues = this.fb.control(false);

  filter = output<QueryVariables>();

  constructor() {
    effect(() => this.filter.emit(this.values()));
  }

  values = toSignal<QueryVariables>(
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
