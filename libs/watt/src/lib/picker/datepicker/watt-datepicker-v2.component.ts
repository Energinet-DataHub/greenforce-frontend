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
import { NgIf } from '@angular/common';
import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  LOCALE_ID,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatCalendarCellClassFunction,
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { maskitoDateOptionsGenerator, maskitoDateRangeOptionsGenerator } from '@maskito/kit';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaskitoModule } from '@maskito/angular';
import { MaskitoOptions } from '@maskito/core';

import { WattFieldComponent } from '@energinet-datahub/watt/field';
import { WattLocaleService, WattSupportedLocales } from '@energinet-datahub/watt/configuration';
import { WattDateRange, WattDateUtils } from '@energinet-datahub/watt/utils/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  WattPlaceholderMaskComponent,
  WattPickerBase,
  WattPickerValue,
} from '@energinet-datahub/watt/picker/shared';

const dateShortFormat = 'DD-MM-YYYY';
const danishLocaleCode = 'da';
export const danishTimeZoneIdentifier = 'Europe/Copenhagen';

/**
 * Usage:
 * `import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
  selector: 'watt-datepicker-v2',
  templateUrl: './watt-datepicker-v2.component.html',
  styleUrls: ['./watt-datepicker.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: WattDatepickerV2Component },
    MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    MatDatepickerModule,
    MatInputModule,
    WattButtonComponent,
    WattFieldComponent,
    MaskitoModule,
    WattPlaceholderMaskComponent,
  ],
})
export class WattDatepickerV2Component extends WattPickerBase {
  protected override elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected override changeDetectionRef = inject(ChangeDetectorRef);
  protected override ngControl = inject(NgControl, { optional: true, self: true });
  private localeService = inject(WattLocaleService);
  private locale: WattSupportedLocales = inject(LOCALE_ID) as WattSupportedLocales;
  private destroyRef = inject(DestroyRef);
  private dateUtils = inject(WattDateUtils);

  @Input() max: Date | null = null;
  @Input() min: Date | null = null;
  @Input() startAt = new Date();
  @Input() rangeMonthOnlyMode = false;
  @Input() label = '';

  /**
   * @ignore
   */
  @ViewChild(MatDatepickerInput)
  matDatepickerInput!: MatDatepickerInput<Date | null>;

  @ViewChild(MatDateRangePicker)
  matDateRangePicker!: MatDateRangePicker<Date | null>;

  @ViewChild(MatDateRangeInput)
  matDateRangeInput!: MatDateRangeInput<Date | null>;

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
  @ViewChild('actualInput')
  actualInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('dateInput')
  input!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('startDateInput')
  startInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endDateInput')
  endInput!: ElementRef;
  /**
   * @ignore
   */
  protected _placeholder = this.getPlaceholder(this.getInputFormat());

  @Input() dateClass: MatCalendarCellClassFunction<Date> = () => '';

  /**
   * @ignore
   */
  datePlaceholder = this.getPlaceholderByLocale(this.locale);
  /**
   * @ignore
   */
  rangeSeparator = ' - ';
  /**
   * @ignore
   */
  rangePlaceholder = this.datePlaceholder + this.rangeSeparator + this.datePlaceholder;
  /**
   * @ignore
   */
  inputMask: MaskitoOptions = maskitoDateOptionsGenerator({ mode: 'dd/mm/yyyy', separator: '-' });
  /**
   * @ignore
   */
  rangeInputMask: MaskitoOptions = maskitoDateRangeOptionsGenerator({
    mode: 'dd/mm/yyyy',
    dateSeparator: '-',
  });
  /**
   * @ignore
   */
  getPlaceholderByLocale(locale: WattSupportedLocales): string {
    return locale === 'da' ? 'dd-mm-åååå' : 'dd-mm-yyyy';
  }
  getRangePlaceholder(): string {
    return this.datePlaceholder + this.rangeSeparator + this.datePlaceholder;
  }
  constructor() {
    super(`watt-datepicker-v2-${WattDatepickerV2Component.nextId++}`);
    this.localeService.onLocaleChange$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((locale) => {
        this.datePlaceholder = this.getPlaceholderByLocale(locale);
        this.rangePlaceholder = this.getRangePlaceholder();
      });
  }

  protected initSingleInput() {
    if (this.initialValue) {
      this.matDatepickerInput.value = this.initialValue;
      this.datepickerClosed();
    }
  }

  inputChanged(value: string) {
    const dateString = value.slice(0, this.datePlaceholder.length);
    if (dateString.length === 0) {
      this.control?.setValue(null);
      return;
    }
    if (dateString.length !== this.datePlaceholder.length) {
      return;
    }
    const date = this.parseDateShortFormat(dateString);
    this.control?.setValue(this.formatDateFromViewToModel(date));
  }

  datepickerClosed() {
    if (this.matDatepickerInput.value) {
      this.control?.setValue(this.matDatepickerInput.value);
      (this.actualInput.nativeElement as HTMLInputElement).value =
        this.formatDateTimeFromModelToView(
          this.formatDateFromViewToModel(this.matDatepickerInput.value)
        );
    } else {
      (this.actualInput.nativeElement as HTMLInputElement).value = '';
      this.control?.setValue(null);
    }
    this.actualInput.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  onMonthSelected(date: Date) {
    if (this.rangeMonthOnlyMode && date) {
      this.matDateRangePicker.select(this.dateUtils.startOf(date, 'month'));
      this.matDateRangePicker.select(this.dateUtils.endOf(date, 'month'));
      this.matDateRangePicker.close();
    }
  }

  /**
   * @ignore
   */
  protected initRangeInput() {
    if (this.initialValue) {
      this.matStartDate.value = (this.initialValue as WattDateRange).start;
      this.matEndDate.value = (this.initialValue as WattDateRange).end;
      this.rangePickerClosed();
    }
  }

  clearRangePicker() {
    this.control?.setValue(null);
    this.actualInput.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  rangeInputChanged(value: string) {
    const startDateString = value.slice(0, this.datePlaceholder.length);
    if (startDateString.length === 0) {
      this.control?.setValue(null);
      return;
    }
    if (startDateString.length !== this.datePlaceholder.length) {
      return;
    }
    const start = this.parseDateShortFormat(startDateString);
    const endDateString = value.slice(this.datePlaceholder.length + this.rangeSeparator.length);

    let end = this.setEndDateToDanishTimeZone(endDateString);
    if (end !== null) {
      end = this.setToEndOfDay(end);
      this.control?.setValue({ start, end });
    }
  }

  rangePickerClosed() {
    if (this.matDateRangeInput.value?.start && this.matDateRangeInput.value.end) {
      (this.actualInput.nativeElement as HTMLInputElement).value =
        this.formatDateTimeFromModelToView(
          this.formatDateFromViewToModel(this.matDateRangeInput.value?.start)
        ) +
        '-' +
        this.formatDateTimeFromModelToView(
          this.formatDateFromViewToModel(this.matDateRangeInput.value.end)
        );
      this.control?.setValue({
        start: this.formatDateFromViewToModel(this.matDateRangeInput.value.start),
        end: this.formatDateFromViewToModel(this.matDateRangeInput.value.end),
      });
    } else {
      (this.actualInput.nativeElement as HTMLInputElement).value = '';
      this.control?.setValue(null);
    }
    this.actualInput.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  /**
   * @ignore
   */
  protected setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ) {
    this.setValueToInput(value, input, this.matDatepickerInput);
  }

  /**
   * @ignore
   */
  protected setRangeValue(
    value: WattDateRange | null,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ) {
    const { start, end } = value ?? {};

    this.setValueToInput(start, startInput, this.matStartDate);
    this.setValueToInput(end, endInput, this.matEndDate);
  }

  /**
   * @ignore
   */
  private getInputFormat(): string {
    const localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);

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
    return this.locale === danishLocaleCode ? inputFormat.split('y').join('å') : inputFormat;
  }

  /**
   * @ignore
   */
  private parseDateShortFormat(value: string): Date {
    return this.dateUtils.parse(value, dateShortFormat);
  }

  /**
   * @ignore
   */
  private setValueToInput<D extends { value: Date | null }>(
    value: string | null | undefined,
    nativeInput: HTMLInputElement,
    matDateInput: D
  ): void {
    nativeInput.value = value ? this.formatDateTimeFromModelToView(value) : '';
    matDateInput.value = value ? this.dateUtils.utc(value) : null;
  }

  /**
   * @ignore
   * Formats Date to full ISO 8601 format (e.g. `2022-08-31T22:00:00.000Z`)
   */
  private formatDateFromViewToModel(value: Date): string {
    return this.dateUtils.utc(value).toISOString();
  }

  /**
   * @ignore
   */
  private formatDateTimeFromModelToView(value: string): string {
    return this.dateUtils.format(value, dateShortFormat, danishTimeZoneIdentifier);
  }

  /**
   * @ignore
   */
  private setToEndOfDay(value: Date): Date {
    return this.dateUtils.endOf(value, 'day');
  }

  /**
   * @ignore
   */
  private setEndDateToDanishTimeZone(value: string): Date | null {
    return this.dateUtils.toTimeZone(value, danishTimeZoneIdentifier);
  }
}
