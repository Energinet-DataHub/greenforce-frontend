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
  Component,
  ElementRef,
  Host,
  Inject,
  Input,
  LOCALE_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import { MatDateRangeInput } from '@angular/material/datepicker';

import { WattInputMaskService } from './input-mask.service';
import { WattRangeInputService } from './range-input.service';

export type WattDateRange = { start: string; end: string };

/**
 * Usage:
 * `import { WattDateRangeInputModule } from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-date-range-input',
  templateUrl: './date-range-input.component.html',
  styleUrls: ['./date-range-input.component.scss'],
  providers: [WattInputMaskService, WattRangeInputService],
  encapsulation: ViewEncapsulation.None,
})
export class WattDateRangeInputComponent
  implements AfterViewInit, ControlValueAccessor
{
  /**
   * @ignore
   */
  @ViewChild(MatDateRangeInput)
  matDateRangeInput!: MatDateRangeInput<unknown>;

  /**
   * @ignore
   */
  @ViewChild('startDate')
  startDateInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endDate')
  endDateInput!: ElementRef;

  @Input()
  set disabled(value: boolean) {
    this.isDisabled = coerceBooleanProperty(value as BooleanInput);
  }

  get disabled(): boolean {
    return this.isDisabled;
  }

  /**
   * @ignore
   */
  private isDisabled = false;

  @Input() min?: string;
  @Input() max?: string;

  /**
   * @ignore
   */
  inputFormat: string = this.getInputFormat();

  /**
   * @ignore
   */
  placeholder: string = this.getPlaceholder(this.inputFormat);

  /**
   * @ignore
   */
  initialValue?: WattDateRange;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Host() private parentControlDirective: NgControl,
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
    const startDateInputElement = this.startDateInput.nativeElement;
    const startDateInputMask = this.inputMaskService.mask(
      this.inputFormat,
      this.placeholder,
      startDateInputElement,
      this.onBeforePaste
    );

    const endDateInputElement = this.endDateInput.nativeElement;
    const endDateInputMask = this.inputMaskService.mask(
      this.inputFormat,
      this.placeholder,
      endDateInputElement,
      this.onBeforePaste
    );

    // Setup and subscribe for input changes
    this.rangeInputService.init({
      startInput: {
        element: startDateInputElement,
        initialValue: this.initialValue?.start,
        mask: startDateInputMask,
      },
      endInput: {
        element: endDateInputElement,
        initialValue: this.initialValue?.end,
        mask: endDateInputMask,
      },
    });

    this.rangeInputService.onChange$?.subscribe(([start, end]) => {
      this.markParentControlAsTouched();
      this.changeParentValue({ start: start as string, end: end as string });
    });
  }

  /**
   * @ignore
   */
  writeValue(dateRange: WattDateRange): void {
    if (!this.startDateInput || !this.endDateInput) {
      this.initialValue = dateRange;
      return;
    }

    const inputEvent = new Event('input', { bubbles: true });

    if (dateRange.start) {
      this.startDateInput.nativeElement.value = dateRange.start;
      this.startDateInput.nativeElement.dispatchEvent(inputEvent);
    }

    if (dateRange.end) {
      this.endDateInput.nativeElement.value = dateRange.end;
      this.endDateInput.nativeElement.dispatchEvent(inputEvent);
    }
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: WattDateRange) => void): void {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private changeParentValue = (value: WattDateRange): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  private markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  private onBeforePaste(pastedValue: string): string {
    // Reverse the pasted value, if starts with "year"
    if (pastedValue.search(/^\d{4}/g) !== -1) {
      const sepearators = pastedValue.match(/(\D)/);
      const seperator = sepearators ? sepearators[0] : '';
      return pastedValue.split(seperator).reverse().join(seperator);
    }
    return pastedValue;
  }

  /**
   * @ignore
   */
  private getInputFormat(): string {
    const localeDateFormat = getLocaleDateFormat(
      this.locale,
      FormatWidth.Short
    );
    return localeDateFormat
      .toLowerCase()
      .replace(/d+/, 'dd')
      .replace(/m+/, 'mm')
      .replace(/y+/, 'yyyy')
      .replace(/\./g, '-'); // seperator
  }

  /**
   * @ignore
   */
  private getPlaceholder(inputFormat: string): string {
    return this.locale === 'da'
      ? inputFormat.split('y').join('å')
      : inputFormat;
  }
}
