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
import { MatCalendar } from '@angular/material/datepicker';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoDateTimeOptionsGenerator } from '@maskito/kit';
import { map, share } from 'rxjs';
import { dayjs } from '@energinet-datahub/watt/date';
import { WattFieldComponent } from '../field';
import { WattButtonComponent } from '../button/watt-button.component';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattLocaleService } from '@energinet-datahub/watt/locale';

const DA_FILLER = 'dd-mm-åååå, tt:mm';
const EN_FILLER = 'dd-mm-yyyy, hh:mm';
const DATETIME_FORMAT = 'DD-MM-YYYY, HH:mm';
const PARTIAL_DATETIME_FORMAT = 'DD-MM-YYYY, ';
const DANISH_TIME_ZONE_IDENTIFIER = 'Europe/Copenhagen';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  standalone: true,
  selector: 'watt-datetime-field',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattDateTimeField),
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
      watt-datetime-field {
        display: block;
        width: 100%;
      }

      .watt-datetime-field-picker {
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
    <watt-field
      [label]="label()"
      [control]="control"
      [placeholder]="placeholder()"
      [anchorName]="anchorName"
    >
      <input
        #field
        [formControl]="control"
        [maskito]="mask()"
        (focus)="picker.showPopover()"
        (blur)="handleBlur(picker, $event)"
      />
      <watt-button icon="date" variant="icon" (click)="field.focus()" />
      <div
        #picker
        class="watt-elevation watt-datetime-field-picker"
        popover="manual"
        tabindex="0"
        [style.position-anchor]="anchorName"
      >
        <mat-calendar
          [startAt]="selected()"
          [selected]="selected()"
          [minDate]="min()"
          [maxDate]="max()"
          (selectedChange)="handleSelectedChange(field, picker, $event)"
        />
      </div>
      <ng-content />
      <ng-content select="watt-field-error" ngProjectAs="watt-field-error" />
      <ng-content select="watt-field-hint" ngProjectAs="watt-field-hint" />
    </watt-field>
  `,
})
export class WattDateTimeField implements ControlValueAccessor {
  private locale = inject(WattLocaleService);

  // Popovers exists on an entirely different layer, meaning that for anchor positioning they
  // look at the entire tree for the anchor name. This gives each field a unique anchor name.
  private static instance = 0;
  private instance = WattDateTimeField.instance++;
  protected anchorName = `--watt-datetime-field-popover-anchor-${this.instance}`;

  /** Converts date from outer FormControl to format of inner FormControl. */
  protected modelToView = (value: Date | null, format = DATETIME_FORMAT) =>
    value ? dayjs(value).tz(DANISH_TIME_ZONE_IDENTIFIER).format(format) : '';

  /** Converts value of inner FormControl to type of outer FormControl. */
  protected viewToModel = (value: string) => {
    const date = dayjs(value, DATETIME_FORMAT, true);
    if (!date.isValid()) return null;
    return this.inclusive() ? date.endOf('m').toDate() : date.toDate();
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

  /** When true, seconds will be set to 59 and milliseconds to 999. Otherwise, both are 0. */
  inclusive = input(false);

  /** Emits when the selected date has changed. */
  dateChange = outputFromObservable(this.valueChanges);

  /** Emits when the field loses focus. */
  blur = output<FocusEvent>();

  protected selected = signal<Date | null>(null);
  protected placeholder = computed(() => (this.locale.isDanish() ? DA_FILLER : EN_FILLER));
  protected mask = computed(() =>
    maskitoDateTimeOptionsGenerator({
      min: this.min(),
      max: this.max(),
      dateMode: 'dd/mm/yyyy',
      timeMode: 'HH:MM',
      dateSeparator: '-',
      timeStep: 1,
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
    field: HTMLInputElement,
    picker: HTMLDivElement,
    date: Date
  ) => {
    const prev = this.viewToModel(this.control.value);

    // Only write the date part
    field.value = prev
      ? this.modelToView(dayjs(date).set('h', prev.getHours()).set('m', prev.getMinutes()).toDate())
      : this.modelToView(date, PARTIAL_DATETIME_FORMAT);

    field.dispatchEvent(new Event('input', { bubbles: true }));
    picker.hidePopover();
  };

  constructor() {
    this.valueChanges.subscribe((value) => {
      this.selected.set(value);
      this.calendar().activeDate = value ?? new Date();
    });
  }

  // Implementation for ControlValueAccessor
  writeValue = (value: Date | null) => this.control.setValue(this.modelToView(value));
  setDisabledState = (x: boolean) => (x ? this.control.disable() : this.control.enable());
  registerOnTouched = (fn: () => void) => this.blur.subscribe(fn);
  registerOnChange = (fn: (value: Date | null) => void) => this.valueChanges.subscribe(fn);
}
