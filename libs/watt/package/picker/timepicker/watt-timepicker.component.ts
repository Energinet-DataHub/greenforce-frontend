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
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { maskitoTimeOptionsGenerator } from '@maskito/kit';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattDateRange } from '@energinet/watt/core/date';
import { WattFieldComponent } from '@energinet/watt/field';
import { WattSliderComponent, WattSliderValue } from '@energinet/watt/slider';

import { maskitoTimeRangeOptionsGenerator } from './maskito-time-range-mask';
import {
  WattPickerBase,
  WattPickerValue,
  WattPlaceholderMaskComponent,
} from '@energinet/watt/picker/__shared';

// Constants for working with time intervals
const minutesInADay = 24 * 60;
const quartersInADay = minutesInADay / 15;

// Show slider initially as "00:00 - 23:59"
const initialSliderValue: WattSliderValue = { min: 0, max: minutesInADay - 1 };

/** Converts string time format (HH:MM) to number of minutes. */
function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(':');
  return Number(hours) * 60 + Number(minutes);
}

/** Converts number of minutes to string time format (HH:MM). */
function minutesToTime(value: number): string {
  const hours = `${Math.floor(value / 60)}`;
  const minutes = `${value % 60}`;
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}
/**
 * Usage:
 * `import { WattTimepickerComponent } from '@energinet-datahub/watt/timepicker';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
  selector: 'watt-timepicker',
  templateUrl: './watt-timepicker.component.html',
  styleUrls: ['./watt-timepicker.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: WattTimepickerComponent }],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    OverlayModule,

    WattButtonComponent,
    WattSliderComponent,
    WattFieldComponent,
    WattPlaceholderMaskComponent,
  ],
})
export class WattTimepickerComponent extends WattPickerBase {
  protected override elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected override changeDetectionRef = inject(ChangeDetectorRef);
  protected override ngControl = inject(NgControl, { optional: true, self: true });
  label = input('');
  /**
   * Text to display on label for time range slider.
   */
  sliderLabel = input('');

  protected override input = viewChild.required<ElementRef<HTMLInputElement>>('timeInput');
  protected override startInput =
    viewChild.required<ElementRef<HTMLInputElement>>('startTimeInput');
  protected override endInput = viewChild.required<ElementRef<HTMLInputElement>>('endTimeInput');

  sliderId = `${this.id}-slider`;

  /**
   * Used for defining a relationship between the time picker and
   * the slider overlay (since the DOM hierarchy cannot be used).
   * @ignore
   */
  @HostBinding('attr.aria-owns')
  get ariaOwns() {
    // Only range input has slider
    return this.range && this.sliderOpen ? this.sliderId : undefined;
  }
  hoursMinutesPlaceholder = 'HH:MM';
  rangeSeparator = ' - ';
  rangePlaceholder =
    this.hoursMinutesPlaceholder + this.rangeSeparator + this.hoursMinutesPlaceholder;
  protected _placeholder = this.hoursMinutesPlaceholder;

  /**
   * Whether the slider is open.
   * @ignore
   */
  sliderOpen = false;

  sliderSteps = [...Array(quartersInADay).keys()].map((x) => x * 15).concat(minutesInADay - 1);

  sliderChange$ = new Subject<WattSliderValue>();

  get sliderValue(): WattSliderValue {
    if (this.value?.start && this.value?.end) {
      return {
        min: timeToMinutes(this.value.start),
        max: timeToMinutes(this.value.end),
      };
    }

    // Retain last slider value if input value is incomplete
    return initialSliderValue;
  }

  /**
   * Toggles the visibility of the slider overlay.
   * @ignore
   */
  toggleSlider() {
    this.sliderOpen = !this.sliderOpen;
  }

  /**
   * Override to automatically close the slider overlay on blur.
   * @ignore
   */
  override onFocusOut(event: FocusEvent) {
    super.onFocusOut(event);
    if (!this.focused) this.sliderOpen = false;
  }

  inputMask = maskitoTimeOptionsGenerator({ mode: 'HH:MM' });
  rangeInputMask = maskitoTimeRangeOptionsGenerator();
  destroyRef = inject(DestroyRef);

  constructor() {
    super(`watt-timepicker-${WattTimepickerComponent.nextId++}`);
  }

  protected initSingleInput() {
    if (this.initialValue) {
      (this.input().nativeElement as HTMLInputElement).value = this.initialValue as string;
      this.input().nativeElement.dispatchEvent(new InputEvent('input'));
    }
  }

  inputChanged(value: string) {
    const time = value.slice(0, this.hoursMinutesPlaceholder.length);
    if (time.length === 0) {
      this.control?.setValue(null);
      return;
    }
    if (time.length !== this.hoursMinutesPlaceholder.length) {
      return;
    }
    this.control?.setValue(time);
  }

  rangeInputChanged(value: string) {
    const start = value.slice(0, this.hoursMinutesPlaceholder.length);
    if (start.length !== this.hoursMinutesPlaceholder.length) {
      this.control?.setValue({ start: '', end: '' });
      return;
    }
    if (value.length < this.rangePlaceholder.length) {
      this.control?.setValue({ start, end: '' });
      return;
    }
    let end = value.slice(this.hoursMinutesPlaceholder.length + this.rangeSeparator.length);
    if (timeToMinutes(end) > timeToMinutes(start)) {
      this.control?.setValue({ start, end });
    } else {
      end = minutesToTime(timeToMinutes(start) + 1);
      this.setRangeValueAndNotify(start, end);
    }
  }

  protected initRangeInput() {
    if (this.initialValue) {
      const { start, end } = this.initialValue as WattDateRange;
      this.setRangeValueAndNotify(start, end);
    } else {
      this.control?.setValue({ start: '', end: '' });
    }
    this.sliderChange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((sliderValue) => {
      const start = minutesToTime(sliderValue.min);
      const end = minutesToTime(sliderValue.max);
      if (end > start) {
        this.setRangeValueAndNotify(start, end);
      }
    });
  }

  setRangeValueAndNotify(start: string, end: string | null) {
    this.control?.setValue({ start, end });
    (this.input().nativeElement as HTMLInputElement).value = start + this.rangeSeparator + end;
    this.input().nativeElement.dispatchEvent(new InputEvent('input'));
  }

  protected setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ) {
    input.value = value ?? '';
  }

  protected setRangeValue(
    value: WattDateRange,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ) {
    const { start, end } = value;

    if (start) {
      startInput.value = start;
    }

    if (end) {
      endInput.value = end;
    }
  }
}
