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
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import {
  MatDateRangeInput,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { combineLatest, map, Subject, takeUntil, tap } from 'rxjs';
import { parse } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { WattInputMaskService } from '../shared/input-mask.service';
import { WattRangeInputService } from '../shared/range-input.service';

export type WattDateRange = { start: string; end: string };

const dateTimeFormat = 'dd-MM-yyyy';
const danishTimeZoneIdentifier = 'Europe/Copenhagen';

/**
 * Usage:
 * `import { WattDateRangeInputModule } from '@energinet-datahub/watt';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
  selector: 'watt-date-range-input',
  templateUrl: './watt-date-range-input.component.html',
  styleUrls: ['./watt-date-range-input.component.scss'],
  providers: [WattInputMaskService, WattRangeInputService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WattDateRangeInputComponent
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
  @ViewChild('startDate')
  startDateInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild(MatStartDate)
  matStartDate!: MatStartDate<Date | null>;

  /**
   * @ignore
   */
  @ViewChild(MatEndDate)
  matEndDate!: MatEndDate<Date | null>;

  /**
   * @ignore
   */
  @ViewChild('endDate')
  endDateInput!: ElementRef;

  /**
   * @ignore
   */
  isDisabled = false;

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
  initialValue?: WattDateRange | null = null;

  /**
   * @ignore
   */
  private destroy$: Subject<void> = new Subject();

  /**
   * @ignore
   */
  private danishLocaleCode = 'da';

  constructor(
    @Inject(LOCALE_ID) private locale: string,
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

    const matStartDateChange$ = this.matStartDate.dateInput.pipe(
      tap(() => {
        this.inputMaskService.setInputColor(
          startDateInputElement,
          startDateInputMask
        );
      }),
      map(({ value: maybeStartDate }) => {
        let start = '';

        if (maybeStartDate instanceof Date) {
          start = this.formatDate(maybeStartDate);
        }

        return start;
      })
    );

    const matEndDateChange$ = this.matEndDate.dateInput.pipe(
      tap(() => {
        this.inputMaskService.setInputColor(
          endDateInputElement,
          endDateInputMask
        );
      }),
      map(({ value: maybeEndDate }) => {
        let start = '';

        if (maybeEndDate instanceof Date) {
          start = this.formatDate(maybeEndDate);
        }

        return start;
      })
    );

    combineLatest([matStartDateChange$, matEndDateChange$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        this.markParentControlAsTouched();
        this.changeParentValue({ start, end });
      });

    this.rangeInputService.onInputChanges$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        if (start !== '') {
          this.matStartDate.value = parse(start, dateTimeFormat, new Date());
        }
        if (end !== '') {
          this.matEndDate.value = parse(end, dateTimeFormat, new Date());
        }

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
  writeValue(dateRange: WattDateRange | null): void {
    if (!this.startDateInput || !this.endDateInput) {
      this.initialValue = dateRange;
      return;
    }

    const inputEvent = new Event('input', { bubbles: true });

    if (dateRange?.start) {
      this.startDateInput.nativeElement.value = dateRange.start;
      this.startDateInput.nativeElement.dispatchEvent(inputEvent);
    }

    if (dateRange?.end) {
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
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.changeDetectorRef.detectChanges();
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
    if (this.locale !== this.danishLocaleCode) return pastedValue;

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
    return this.locale === this.danishLocaleCode
      ? inputFormat.split('y').join('å')
      : inputFormat;
  }

  /**
   * @ignore
   */
  private formatDate(value: Date): string {
    return formatInTimeZone(value, danishTimeZoneIdentifier, dateTimeFormat);
  }
}
