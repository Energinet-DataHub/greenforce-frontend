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
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  BehaviorSubject,
  distinctUntilChanged,
  EMPTY,
  map,
  takeUntil,
} from 'rxjs';

import {
  WattInputMaskService,
  WattMaskedInput,
} from '../shared/watt-input-mask.service';
import { WattPickerBase } from '../shared/watt-picker-base';
import { WattRange } from '../shared/watt-range';
import { WattRangeInputService } from '../shared/watt-range-input.service';
import { WattSliderValue } from '../../slider/watt-slider.component';
import { WattPickerValue } from '../shared/watt-picker-value';

/**
 * Note: `Inputmask` package uses upper case `MM` for "minutes" and
 * lower case `mm` for "months".
 * This is opposite of what most other date libraries do.
 */
const hoursMinutesFormat = 'HH:MM';
const hoursMinutesPlaceholder = 'HH:MM';

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

/** Curried helper for getting a value at `index` if it is truthy. */
const getTruthyAt =
  <type>(index: number) =>
  (array: type[]) =>
    array[index] || undefined;

/**
 * Usage:
 * `import { WattTimepickerModule } from '@energinet-datahub/watt/timepicker';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
  selector: 'watt-timepicker',
  templateUrl: './watt-timepicker.component.html',
  styleUrls: ['./watt-timepicker.component.scss'],
  providers: [
    WattInputMaskService,
    WattRangeInputService,
    { provide: MatFormFieldControl, useExisting: WattTimepickerComponent },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WattTimepickerComponent extends WattPickerBase {
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
  protected _placeholder = hoursMinutesPlaceholder;

  /**
   * Whether the slider is open.
   * @ignore
   */
  sliderOpen = false;

  /**
   * @ignore
   */
  sliderSteps = [...Array(quartersInADay).keys()]
    .map((x) => x * 15)
    .concat(minutesInADay - 1);

  /**
   * @ignore
   */
  sliderChange$ = new BehaviorSubject(initialSliderValue);

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
    return this.sliderChange$.value;
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
  onFocusOut(event: FocusEvent) {
    super.onFocusOut(event);
    if (!this.focused) this.sliderOpen = false;
  }

  constructor(
    protected inputMaskService: WattInputMaskService,
    protected rangeInputService: WattRangeInputService,
    protected elementRef: ElementRef<HTMLElement>,
    protected changeDetectionRef: ChangeDetectorRef,
    @Optional() @Self() ngControl: NgControl
  ) {
    super(
      `watt-timepicker-${WattTimepickerComponent.nextId++}`,
      inputMaskService,
      rangeInputService,
      elementRef,
      changeDetectionRef,
      ngControl
    );
  }

  /**
   * @ignore
   */
  protected initSingleInput() {
    const { maskedInput } = this.maskInput(
      this.input.nativeElement,
      this.initialValue as string | null
    );

    maskedInput.onChange$.subscribe((value: string) => {
      this.markParentControlAsTouched();
      this.changeParentValue(value);
    });
  }

  /**
   * @ignore
   */
  protected initRangeInput() {
    // Setup and subscribe for input changes
    const startInput = this.maskInput(
      this.startInput.nativeElement,
      (this.initialValue as WattRange | null)?.start
    );

    const endInput = this.maskInput(
      this.endInput.nativeElement,
      (this.initialValue as WattRange | null)?.end
    );

    this.rangeInputService.init({ startInput, endInput });

    // Silence the compiler since `onInputChanges$` is always assigned in `init`
    const { onInputChanges$ = EMPTY } = this.rangeInputService;
    const timeRange$ = onInputChanges$.pipe(takeUntil(this.destroy$));

    // Synchronize the slider value with the input fields. Calling `update`
    // here automatically triggers an emit on the `timeRange$` observable.
    this.sliderChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sliderValue) => {
        startInput.maskedInput.update(minutesToTime(sliderValue.min));
        endInput.maskedInput.update(minutesToTime(sliderValue.max));
      });

    // Whenever the start input value changes, set (or remove)
    // the minimum allowed value for the end input value.
    timeRange$
      .pipe(map(getTruthyAt(0)), distinctUntilChanged())
      .subscribe((start) => endInput.maskedInput.setOptions({ min: start }));

    // Whenever the end input value changes, set (or remove)
    // the maximum allowed value for the start input value.
    timeRange$
      .pipe(map(getTruthyAt(1)), distinctUntilChanged())
      .subscribe((end) => startInput.maskedInput.setOptions({ max: end }));

    timeRange$.subscribe(([start, end]) => {
      this.markParentControlAsTouched();
      this.changeParentValue({ start, end });
    });
  }

  /**
   * @ignore
   */
  protected setSingleValue(
    value: Exclude<WattPickerValue, WattRange>,
    input: HTMLInputElement
  ) {
    input.value = value ? value : '';
  }

  /**
   * @ignore
   */
  protected setRangeValue(
    value: WattRange,
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

  /**
   * @ignore
   */
  private maskInput(
    input: HTMLInputElement,
    initialValue: string | null = ''
  ): { element: HTMLInputElement; maskedInput: WattMaskedInput } {
    const maskedInput = this.inputMaskService.mask(
      initialValue,
      hoursMinutesFormat,
      this.placeholder,
      input
    );
    return { element: input, maskedInput };
  }
}
