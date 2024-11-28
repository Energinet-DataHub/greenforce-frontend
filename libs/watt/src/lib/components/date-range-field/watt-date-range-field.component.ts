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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatCalendar,
  DateRange as MatDateRange,
} from '@angular/material/datepicker';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoDateRangeOptionsGenerator } from '@maskito/kit';
import { map, share } from 'rxjs';
import { dayjs } from '@energinet-datahub/watt/date';
import { WattFieldComponent } from '../field';
import { WattButtonComponent } from '../button/watt-button.component';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattLocaleService } from '@energinet-datahub/watt/locale';

const RANGE_SEPARATOR = ' – ';
const DA_FILLER = 'dd-mm-åååå' + RANGE_SEPARATOR + 'dd-mm-åååå';
const EN_FILLER = 'dd-mm-yyyy' + RANGE_SEPARATOR + 'dd-mm-yyyy';
const DATE_FORMAT = 'DD-MM-YYYY';
const DANISH_TIME_ZONE_IDENTIFIER = 'Europe/Copenhagen';

export type DateRange = { start: Date | null; end: Date | null };

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  standalone: true,
  selector: 'watt-date-range-field',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattDateRangeField),
      multi: true,
    },
  ],
  imports: [
    ReactiveFormsModule,
    MaskitoDirective,
    MatCalendar,
    WattButtonComponent,
    WattFieldComponent,
  ],
  styles: [
    `
      watt-date-range-field {
        display: block;
        width: 100%;
      }

      .watt-date-range-field-picker {
        position: fixed;
        position-area: bottom span-right;
        position-try-fallbacks: flip-block;
        width: 296px;
        height: 354px;
        inset: unset;
        margin: unset;
        border: 0;
      }
    `,
  ],
  template: `
    <watt-field #field [label]="label()" [control]="control" [placeholder]="placeholder()">
      <input
        #input
        [formControl]="control"
        [maskito]="mask()"
        (focus)="picker.showPopover()"
        (blur)="handleBlur(picker, $event)"
      />
      <watt-button icon="date" variant="icon" (click)="input.focus()" />
      <div
        #picker
        class="watt-elevation watt-date-range-field-picker"
        popover="manual"
        tabindex="0"
        [style.position-anchor]="field.inputAnchor"
      >
        <mat-calendar
          [startAt]="selected()"
          [minDate]="min()"
          [maxDate]="max()"
          [selected]="selected()"
          (selectedChange)="handleSelectedChange(input, picker, $event)"
        />
      </div>
      <ng-content />
      <ng-content select="watt-field-error" ngProjectAs="watt-field-error" />
      <ng-content select="watt-field-hint" ngProjectAs="watt-field-hint" />
    </watt-field>
    <p>Selected: {{ selected()?.start }} - {{ selected()?.end }}</p>
  `,
})
export class WattDateRangeField implements ControlValueAccessor {
  private locale = inject(WattLocaleService);

  /** Converts date from outer FormControl to format of inner FormControl. */
  protected modelToView = (value: DateRange | null) =>
    !value
      ? ''
      : [value.start, value.end]
          .map((date) => dayjs(date).tz(DANISH_TIME_ZONE_IDENTIFIER).format(DATE_FORMAT))
          .join(RANGE_SEPARATOR);

  /** Converts value of inner FormControl to type of outer FormControl. */
  protected viewToModel = (value: string) => {
    const dates = value.split(RANGE_SEPARATOR).map((date) => dayjs(date, DATE_FORMAT, true));
    return dates.every((date) => date.isValid())
      ? new MatDateRange(dates[0].toDate(), dates[1].endOf('d').toDate())
      : null;
  };

  // Must unfortunately be queried in order to update `activeDate`
  private calendar = viewChild.required<MatCalendar<Date>>(MatCalendar);

  // This inner FormControl is string only, but the outer FormControl is of type Date.
  protected control = new FormControl('', { nonNullable: true });

  // `registerOnChange` may subscribe to this component after it has been destroyed, thus
  // triggering an NG0911 from the `takeUntilDestroyed` operator. By sharing the observable,
  // the observable will already be closed and `subscribe` becomes a proper noop.
  private valueChanges = this.control.valueChanges.pipe(
    map(this.viewToModel),
    takeUntilDestroyed(),
    share()
  );

  /** Set the label text for `watt-field`. */
  label = input('');

  /** The minimum selectable date. */
  min = input<Date>();

  /** The maximum selectable date. */
  max = input<Date>();

  /** Emits when the selected date has changed. */
  dateChange = outputFromObservable(this.valueChanges);

  /** Emits when the field loses focus. */
  blur = output<FocusEvent>();

  /** Checks whether the current selection is valid. */
  isValid = () => Boolean(this.selected()?.start && this.selected()?.end);

  protected selected = signal<MatDateRange<Date> | null>(null);
  protected placeholder = computed(() => (this.locale.isDanish() ? DA_FILLER : EN_FILLER));
  protected mask = computed(() =>
    maskitoDateRangeOptionsGenerator({
      min: this.min(),
      max: this.max(),
      mode: 'dd/mm/yyyy',
      rangeSeparator: ' – ',
      dateSeparator: '-',
    })
  );

  protected handleBlur = (picker: HTMLElement, event: FocusEvent) => {
    if (event.relatedTarget instanceof HTMLElement && picker.contains(event.relatedTarget)) {
      const target = event.target as HTMLInputElement; // safe type assertion
      setTimeout(() => target.focus());
    } else {
      picker.hidePopover();
      this.blur.emit(event);
    }
  };

  protected handleSelectedChange = (
    input: HTMLInputElement,
    picker: HTMLDivElement,
    date: Date | null
  ) => {
    this.selected.update((selected) => this.addDateToSelection(date, selected));
    if (!this.isValid()) return;
    input.value = this.modelToView(this.selected());
    input.dispatchEvent(new Event('input', { bubbles: true }));
    picker.hidePopover();
  };

  private addDateToSelection(date: Date | null, range: MatDateRange<Date> | null) {
    if (!date) return null;
    if (!range?.start) return new MatDateRange(date, null);
    if (!range.end && date > range.start) return new MatDateRange(range.start, date);
    return new MatDateRange(date, null);
  }

  constructor() {
    this.valueChanges.subscribe((value) => {
      this.selected.set(value);
      this.calendar().activeDate = value?.start ?? new Date();
    });
  }

  // Implementation for ControlValueAccessor
  writeValue = (value: DateRange | null) => this.control.setValue(this.modelToView(value));
  setDisabledState = (x: boolean) => (x ? this.control.disable() : this.control.enable());
  registerOnTouched = (fn: () => void) => this.blur.subscribe(fn);
  registerOnChange = (fn: (value: DateRange | null) => void) => this.valueChanges.subscribe(fn);
}
