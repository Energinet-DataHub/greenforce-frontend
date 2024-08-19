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
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  Input,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { maskitoTimeOptionsGenerator } from '@maskito/kit';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRange } from '@energinet-datahub/watt/utils/date';
import { WattFieldComponent } from '@energinet-datahub/watt/field';
import { WattSliderComponent, WattSliderValue } from '@energinet-datahub/watt/slider';
import {
  WattPlaceholderMaskComponent,
  WattPickerBase,
  WattPickerValue,
  maskitoTimeRangeOptionsGenerator,
} from '@energinet-datahub/watt/picker/shared';

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
 * `import { WattTimepickerComponent } from '@energinet-datahub/watt/picker/timepicker';`
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
  standalone: true,
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
  @Input() label = '';
  /**
   * Text to display on label for time range slider.
   */
  @Input()
  sliderLabel = '';

  /**
   * @ignore
   */
  @ViewChild('timeInput')
  input!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('startTimeInput')
  startInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endTimeInput')
  endInput!: ElementRef;

  /**
   * @ignore
   */
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
  /**
   * @ignore
   */
  hoursMinutesPlaceholder = 'HH:MM';
  /**
   * @ignore
   */
  rangeSeparator = ' - ';
  /**
   * @ignore
   */
  rangePlaceholder =
    this.hoursMinutesPlaceholder + this.rangeSeparator + this.hoursMinutesPlaceholder;
  /**
   * @ignore
   */
  protected _placeholder = this.hoursMinutesPlaceholder;

  /**
   * Whether the slider is open.
   * @ignore
   */
  sliderOpen = false;

  /**
   * @ignore
   */
  sliderSteps = [...Array(quartersInADay).keys()].map((x) => x * 15).concat(minutesInADay - 1);

  /**
   * @ignore
   */
  sliderChange$ = new Subject<WattSliderValue>();

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  inputMask = maskitoTimeOptionsGenerator({ mode: 'HH:MM' });
  /**
   * @ignore
   */
  rangeInputMask = maskitoTimeRangeOptionsGenerator();
  /**
   * @ignore
   */
  destroyRef = inject(DestroyRef);

  constructor() {
    super(`watt-timepicker-${WattTimepickerComponent.nextId++}`);
  }

  /**
   * @ignore
   */
  protected initSingleInput() {
    if (this.initialValue) {
      (this.input.nativeElement as HTMLInputElement).value = this.initialValue as string;
      this.input.nativeElement.dispatchEvent(new InputEvent('input'));
    }
  }

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  setRangeValueAndNotify(start: string, end: string | null) {
    this.control?.setValue({ start, end });
    (this.input.nativeElement as HTMLInputElement).value = start + this.rangeSeparator + end;
    this.input.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  /**
   * @ignore
   */
  protected setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ) {
    input.value = value ?? '';
  }

  /**
   * @ignore
   */
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
