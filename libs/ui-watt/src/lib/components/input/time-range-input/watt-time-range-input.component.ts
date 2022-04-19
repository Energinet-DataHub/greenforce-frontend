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
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';

import { WattInputMaskService } from '../shared/input-mask.service';
import { WattRangeInputService } from '../shared/range-input.service';

export type WattTimeRange = { start: string; end: string };

/**
 * Note: `Inputmask` package uses upper case `MM` for "minutes" and
 * lower case `mm` for "months".
 * This is opposite of what most other date libraries do.
 */
const hoursMinutesFormat = 'HH:MM';
const hoursMinutesPlaceholder = 'HH:MM';

/**
 * Usage:
 * `import { WattTimeRangeInputModule } from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-time-range-input',
  templateUrl: './watt-time-range-input.component.html',
  styleUrls: ['./watt-time-range-input.component.scss'],
  providers: [WattInputMaskService, WattRangeInputService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WattTimeRangeInputComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor
{
  /**
   * @ignore
   */
  @ViewChild(MatDateRangeInput)
  matDateRangeInput!: MatDateRangeInput<unknown>;

  /**
   * @ignore
   */
  @ViewChild('startTime')
  startTimeInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endTime')
  endTimeInput!: ElementRef;

  /**
   * @ignore
   */
  placeholder = hoursMinutesPlaceholder;

  /**
   * @ignore
   */
  isDisabled = false;

  /**
   * @ignore
   */
  initialValue: WattTimeRange | null = null;

  /**
   * @ignore
   */
  private destroy$: Subject<void> = new Subject();

  constructor(
    @Host() private parentControlDirective: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
    private inputMaskService: WattInputMaskService,
    private rangeInputService: WattRangeInputService
  ) {
    this.parentControlDirective.valueAccessor = this;
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {
    if (this.initialValue) {
      this.writeValue(this.initialValue);
    }

    // Setup input masks
    const startTimeInputElement: HTMLInputElement =
      this.startTimeInput.nativeElement;

    const startTimeInputMask = this.inputMaskService.mask(
      hoursMinutesFormat,
      this.placeholder,
      startTimeInputElement
    );

    const endTimeInputElement: HTMLInputElement =
      this.endTimeInput.nativeElement;

    const endTimeInputMask = this.inputMaskService.mask(
      hoursMinutesFormat,
      this.placeholder,
      endTimeInputElement
    );

    // Setup and subscribe for input changes
    this.rangeInputService.init({
      startInput: {
        element: startTimeInputElement,
        initialValue: this.initialValue?.start,
        mask: startTimeInputMask,
      },
      endInput: {
        element: endTimeInputElement,
        initialValue: this.initialValue?.end,
        mask: endTimeInputMask,
      },
    });

    this.rangeInputService.onInputChanges$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        this.markParentControlAsTouched();
        this.changeParentValue({ start, end });
      });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @ignore
   */
  writeValue(timeRange: WattTimeRange | null): void {
    if (!this.startTimeInput || !this.endTimeInput) {
      this.initialValue = timeRange;
      return;
    }

    const inputEvent = new Event('input', { bubbles: true });

    if (timeRange?.start) {
      this.startTimeInput.nativeElement.value = timeRange.start;
      this.startTimeInput.nativeElement.dispatchEvent(inputEvent);
    }

    if (timeRange?.end) {
      this.endTimeInput.nativeElement.value = timeRange.end;
      this.endTimeInput.nativeElement.dispatchEvent(inputEvent);
    }
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: WattTimeRange) => void): void {
    this.changeParentValue = onChangeFn;
  }

  /**
   * @ignore
   */
  registerOnTouched(onTouchFn: () => void) {
    this.markParentControlAsTouched = onTouchFn;
  }

  /**
   * @ignore
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private changeParentValue = (value: WattTimeRange): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  private markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };
}
