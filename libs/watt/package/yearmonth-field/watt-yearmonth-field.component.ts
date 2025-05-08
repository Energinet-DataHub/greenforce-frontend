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
  forwardRef,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { outputFromObservable, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map, share } from 'rxjs';
import { MatCalendar } from '@angular/material/datepicker';

import { dayjs } from '@energinet/watt/core/date';
import { WattFieldComponent } from '@energinet/watt/field';
import { WattButtonComponent } from '@energinet/watt/button';

import { YearMonth } from './year-month';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'watt-yearmonth-field',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattYearMonthField),
      multi: true,
    },
  ],
  imports: [ReactiveFormsModule, MatCalendar, WattButtonComponent, WattFieldComponent],
  styles: [
    `
      watt-yearmonth-field {
        display: block;
        width: 100%;

        & input {
          text-transform: capitalize;
        }

        &:has(.watt-yearmonth-field__step-through) {
          display: flex;
          flex-align: flex-start;

          .watt-yearmonth-field__step-through {
            display: flex;
          }
        }

        &:has(.watt-yearmonth-field__has-label) {
          .watt-yearmonth-field__step-through {
            margin-top: 28px;
          }
        }
      }

      .watt-yearmonth-field-picker {
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
    <watt-field [label]="label()" [control]="control" [anchorName]="anchorName">
      <input
        #field
        readonly
        [formControl]="control"
        (focus)="handleFocus(picker)"
        (blur)="handleBlur(picker, $event)"
      />
      <watt-button icon="date" variant="icon" (click)="field.focus()" />
      <div
        #picker
        class="watt-elevation watt-yearmonth-field-picker"
        popover="manual"
        tabindex="0"
        [style.position-anchor]="anchorName"
      >
        @if (isOpen()) {
          <mat-calendar
            startView="multi-year"
            [startAt]="selected()"
            [selected]="selected()"
            [minDate]="min()"
            [maxDate]="max()"
            (monthSelected)="handleSelectedChange(field, $event)"
          />
        }
      </div>
      <ng-content />
      <ng-content select="watt-field-error" ngProjectAs="watt-field-error" />
      <ng-content select="watt-field-hint" ngProjectAs="watt-field-hint" />
    </watt-field>

    @if (canStepThroughMonths()) {
      <span
        class="watt-yearmonth-field__step-through"
        [class.watt-yearmonth-field__has-label]="!!label()"
      >
        <watt-button
          variant="icon"
          icon="left"
          (click)="prevMonth(field)"
          [disabled]="control.disabled || isPrevMonthButtonDisabled()"
        />
        <watt-button
          variant="icon"
          icon="right"
          (click)="nextMonth(field)"
          [disabled]="control.disabled || isNextMonthButtonDisabled()"
        />
      </span>
    }
  `,
})
export class WattYearMonthField implements ControlValueAccessor {
  // Popovers exists on an entirely different layer, meaning that for anchor positioning they
  // look at the entire tree for the anchor name. This gives each field a unique anchor name.
  private static instance = 0;
  private instance = WattYearMonthField.instance++;
  protected anchorName = `--watt-yearmonth-field-popover-anchor-${this.instance}`;

  // The format of the inner FormControl is different from that of the outer FormControl
  protected control = new FormControl('', { nonNullable: true });

  // `registerOnChange` may subscribe to this component after it has been destroyed, thus
  // triggering an NG0911 from the `takeUntilDestroyed` operator. By sharing the observable,
  // the observable will already be closed and `subscribe` becomes a proper noop.
  private yearMonthChanges = this.control.valueChanges.pipe(map(YearMonth.fromView));
  private valueChanges = this.yearMonthChanges.pipe(
    map((yearMonth) => yearMonth.toModel()),
    takeUntilDestroyed(),
    share()
  );

  private yearMonth = toSignal(this.yearMonthChanges);
  protected selected = computed(() => this.yearMonth()?.toDate());

  // This is used to reset the MatCalendar component by destroying and then recreating it
  // whenever the picker is opened. There is no methods to do it programatically.
  protected isOpen = signal(false);

  /** Set the label text for `watt-field`. */
  label = input('');

  /** The minimum selectable date. */
  min = input<Date>();

  /** The maximum selectable date. */
  max = input<Date>();

  /** Enable buttons to step through months. */
  canStepThroughMonths = input(false);

  /** Emits when the selected month has changed. */
  monthChange = outputFromObservable(this.valueChanges);

  /** Emits when the field loses focus. */
  // eslint-disable-next-line @angular-eslint/no-output-native
  blur = output<FocusEvent>();

  isPrevMonthButtonDisabled = computed(() => this.isPrevMonthBeforeOrEqualToMinDate());
  isNextMonthButtonDisabled = computed(() => this.isNextMonthAfterOrEqualToMaxDate());

  protected handleFocus = (picker: HTMLElement) => {
    this.isOpen.set(true);
    picker.showPopover();
  };

  protected handleBlur = (picker: HTMLElement, event: FocusEvent) => {
    if (event.relatedTarget instanceof HTMLElement && picker.contains(event.relatedTarget)) {
      const target = event.target as HTMLInputElement; // safe type assertion
      setTimeout(() => target.focus()); // keep focus on input element while using the picker
    } else {
      picker.hidePopover();
      this.isOpen.set(false);
      this.blur.emit(event);
    }
  };

  protected handleSelectedChange = (field: HTMLInputElement, date: Date) => {
    field.value = YearMonth.fromDate(date).toView();
    field.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => field.blur());
  };

  // Implementation for ControlValueAccessor
  writeValue = (value: string | null) => this.control.setValue(YearMonth.fromModel(value).toView());
  setDisabledState = (x: boolean) => (x ? this.control.disable() : this.control.enable());
  registerOnTouched = (fn: () => void) => this.blur.subscribe(fn);
  registerOnChange = (fn: (value: string | null) => void) => this.valueChanges.subscribe(fn);

  /**
   * @ignore
   */
  protected prevMonth(field: HTMLInputElement): void {
    this.changeMonth(field, -1);
  }
  /**
   * @ignore
   */
  protected nextMonth(field: HTMLInputElement): void {
    this.changeMonth(field, 1);
  }

  /**
   * @ignore
   */
  private changeMonth(field: HTMLInputElement, value: number): void {
    const currentDate = YearMonth.fromView(field.value).toDate();

    if (!currentDate) return;

    const newDate = dayjs(currentDate).add(value, 'month');
    this.handleSelectedChange(field, newDate.toDate());
  }

  /**
   * @ignore
   */
  isPrevMonthBeforeOrEqualToMinDate(): boolean {
    const min = this.min();

    if (!min) return false;

    const selectedDate = dayjs(this.selected());

    const isBefore = selectedDate.isBefore(min, 'month');
    const isSame = selectedDate.isSame(min, 'month');

    return isSame || isBefore;
  }

  /**
   * @ignore
   */
  isNextMonthAfterOrEqualToMaxDate(): boolean {
    const max = this.max();

    if (!max) return false;

    const selectedDate = dayjs(this.selected());

    const isAfter = selectedDate.isAfter(max, 'month');
    const isSame = selectedDate.isSame(max, 'month');

    return isSame || isAfter;
  }
}
