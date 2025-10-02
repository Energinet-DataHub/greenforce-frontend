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
  input,
  effect,
  inject,
  computed,
  Component,
  LOCALE_ID,
  viewChild,
  ElementRef,
  linkedSignal,
  AfterViewInit,
  booleanAttribute,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';
import { AbstractControl, NgControl, Validator } from '@angular/forms';

import {
  MatEndDate,
  MatStartDate,
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';

import { maskitoDateOptionsGenerator, maskitoDateRangeOptionsGenerator } from '@maskito/kit';

import {
  dayjs,
  WattRange,
  WattDateRange,
  WattLocaleService,
  WattSupportedLocales,
} from '@energinet/watt/core/date';

import { WattFieldComponent } from '@energinet/watt/field';
import { WattButtonComponent } from '@energinet/watt/button';

import {
  WattPickerBase,
  WattPickerValue,
  WattPlaceholderMaskComponent,
} from '@energinet/watt/picker/__shared';

const dateShortFormat = 'DD-MM-YYYY';
export const danishTimeZoneIdentifier = 'Europe/Copenhagen';

/**
 * Usage:
 * `import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
  selector: 'watt-datepicker',
  templateUrl: './watt-datepicker.component.html',
  styleUrls: ['./watt-datepicker.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: WattDatepickerComponent }],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatInputModule,
    MatDatepickerModule,

    WattFieldComponent,
    WattButtonComponent,
    WattPlaceholderMaskComponent,
  ],
})
export class WattDatepickerComponent extends WattPickerBase implements Validator, AfterViewInit {
  protected override elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected override changeDetectionRef = inject(ChangeDetectorRef);
  protected override ngControl = inject(NgControl, { optional: true, self: true });
  private localeService = inject(WattLocaleService);
  private locale = inject<WattSupportedLocales>(LOCALE_ID);

  max = input<Date>();
  min = input<Date>();
  label = input<string>('');
  rangeMonthOnlyMode = input(false);
  startAt = input<Date | null>(null);
  dateClass = input<MatCalendarCellClassFunction<Date>>(() => '');
  canStepThroughDays = input(false, { transform: booleanAttribute });

  matEndDate = viewChild<MatEndDate<Date | null>>(MatEndDate);
  matStartDate = viewChild<MatStartDate<Date | null>>(MatStartDate);
  matDateRangeInput = viewChild<MatDateRangeInput<Date | null>>(MatDateRangeInput);
  matDatepickerInput = viewChild<MatDatepickerInput<Date | null>>(MatDatepickerInput);
  matDateRangePicker = viewChild<MatDateRangePicker<Date | null>>(MatDateRangePicker);

  actualInput = viewChild<ElementRef<HTMLInputElement>>('actualInput');
  override input = viewChild<ElementRef<HTMLInputElement>>('dateInput');
  override endInput = viewChild<ElementRef<HTMLInputElement>>('endDateInput');
  override startInput = viewChild<ElementRef<HTMLInputElement>>('startDateInput');

  protected _placeholder = this.getPlaceholderByLocale(this.locale);

  rangeSeparator = ' - ';

  rangePlaceholder = this.getRangePlaceholder();

  inputMask = computed(() =>
    maskitoDateOptionsGenerator({
      mode: 'dd/mm/yyyy',
      separator: '-',
      max: this.max(),
      min: this.min(),
    })
  );

  rangeInputMask = computed(() =>
    maskitoDateRangeOptionsGenerator({
      mode: 'dd/mm/yyyy',
      dateSeparator: '-',
      max: this.max(),
      min: this.min(),
    })
  );

  getPlaceholderByLocale(locale: WattSupportedLocales): string {
    return locale === 'da' ? 'dd-mm-åååå' : 'dd-mm-yyyy';
  }

  getRangePlaceholder(): string {
    return this.placeholder + this.rangeSeparator + this.placeholder;
  }

  isPrevDayButtonDisabled = linkedSignal(() => this.isPrevDayBeforeOrEqualToMinDate());
  isNextDayButtonDisabled = linkedSignal(() => this.isNextDayAfterOrEqualToMaxDate());

  constructor() {
    super(`watt-datepicker-${WattDatepickerComponent.nextId++}`);

    effect(() => {
      const locale = this.localeService.locale();
      this.placeholder = this.getPlaceholderByLocale(locale);
      this.rangePlaceholder = this.getRangePlaceholder();
    });

    effect(() => {
      this.rangeMonthOnlyMode();
      this.ngControl?.control?.updateValueAndValidity();
    });
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this.ngControl?.control?.addValidators(this.validate);
  }

  validate = ({ value }: AbstractControl<WattRange<string>>) => {
    if (!value?.end || !value?.start) return null;
    if (!this.rangeMonthOnlyMode()) return null;
    const start = dayjs(value.start);
    const end = dayjs(value.end);
    return start.isSame(start.startOf('month')) && end.isSame(start.endOf('month'))
      ? null
      : { monthOnly: true };
  };

  protected initSingleInput() {
    const matDatepickerInput = this.matDatepickerInput();
    if (this.initialValue && matDatepickerInput) {
      matDatepickerInput.value = this.initialValue;
      this.datepickerClosed();
    }
  }

  inputChanged(value: string) {
    const dateString = value.slice(0, this.placeholder.length);

    if (dateString.length === 0) {
      this.control?.setValue(null);
      return;
    }

    if (dateString.length !== this.placeholder.length) {
      return;
    }

    const date = this.parseDateShortFormat(dateString);
    this.control?.setValue(this.formatDateFromViewToModel(date));
  }

  datepickerClosed() {
    const matDatepickerInput = this.matDatepickerInput();
    const actualInput = this.actualInput();

    if (!actualInput) return;

    if (matDatepickerInput && matDatepickerInput.value) {
      this.control?.setValue(matDatepickerInput.value);

      actualInput.nativeElement.value = this.formatDateTimeFromModelToView(
        this.formatDateFromViewToModel(matDatepickerInput.value)
      );
    } else {
      actualInput.nativeElement.value = '';
      this.control?.setValue(null);
    }

    this.isPrevDayButtonDisabled.set(this.isPrevDayBeforeOrEqualToMinDate());
    this.isNextDayButtonDisabled.set(this.isNextDayAfterOrEqualToMaxDate());

    actualInput.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  onMonthSelected(date: Date) {
    const matDateRangePicker = this.matDateRangePicker();
    if (matDateRangePicker && this.rangeMonthOnlyMode() && date) {
      matDateRangePicker.select(dayjs(date).startOf('month').toDate());
      matDateRangePicker.select(dayjs(date).endOf('month').toDate());
      matDateRangePicker.close();
    }
  }

  protected initRangeInput() {
    const matStartDate = this.matStartDate();
    const matEndDate = this.matEndDate();

    if (this.initialValue && matStartDate && matEndDate) {
      matStartDate.value = (this.initialValue as WattDateRange).start;
      matEndDate.value = (this.initialValue as WattDateRange).end;
      this.rangePickerClosed();
    }
  }

  clearRangePicker() {
    const actualInput = this.actualInput();

    if (!actualInput) return;

    this.control?.setValue(null);
    actualInput.nativeElement.value = '';
    actualInput.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  rangeInputChanged(value: string) {
    const startDateString = value.slice(0, this.placeholder.length);

    if (startDateString.length === 0) {
      this.control?.setValue(null);
      return;
    }

    if (startDateString.length !== this.placeholder.length) {
      return;
    }

    const start = this.parseDateShortFormat(startDateString);
    const endDateString = value.slice(this.placeholder.length + this.rangeSeparator.length);
    let end = this.setEndDateToDanishTimeZone(endDateString);

    if (end !== null) {
      end = this.setToEndOfDay(end);
      this.control?.setValue({ start, end });
    }
  }

  rangePickerClosed() {
    const matDateRangeInput = this.matDateRangeInput();
    const actualInput = this.actualInput();

    if (!actualInput) return;

    if (matDateRangeInput?.value?.start && matDateRangeInput?.value?.end) {
      actualInput.nativeElement.value =
        this.formatDateTimeFromModelToView(
          this.formatDateFromViewToModel(matDateRangeInput.value?.start)
        ) +
        '-' +
        this.formatDateTimeFromModelToView(
          this.formatDateFromViewToModel(matDateRangeInput.value.end)
        );

      this.control?.setValue({
        start: this.formatDateFromViewToModel(matDateRangeInput.value.start),
        end: this.formatDateFromViewToModel(matDateRangeInput.value.end),
      });
    } else {
      actualInput.nativeElement.value = '';
      this.control?.setValue(null);
    }

    actualInput.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  protected setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ) {
    const matDatepickerInput = this.matDatepickerInput();
    if (matDatepickerInput) {
      this.setValueToInput(value, input, matDatepickerInput);
    }
  }

  protected setRangeValue(
    value: WattDateRange | null,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ) {
    const { start, end } = value ?? {};

    const matStartDate = this.matStartDate();
    const matEndDate = this.matEndDate();

    if (!matStartDate || !matEndDate) return;

    this.setValueToInput(start, startInput, matStartDate);
    this.setValueToInput(end, endInput, matEndDate);
  }

  prevDay() {
    this.changeDay(-1);
  }

  nextDay() {
    this.changeDay(1);
  }

  private changeDay(value: number) {
    const currentDate = this.matDatepickerInput()?.value;

    if (currentDate) {
      const newDate = dayjs(currentDate).add(value, 'day').toISOString();
      const newDateFormatted = this.formatDateTimeFromModelToView(newDate);

      this.inputChanged(newDateFormatted);
      this.datepickerClosed();
    }
  }

  private isPrevDayBeforeOrEqualToMinDate() {
    const min = this.min();
    const selectedDate = this.matDatepickerInput()?.value;

    if (!min || !selectedDate) return false;

    const isBefore = dayjs(selectedDate).isBefore(min, 'day');
    const isSame = dayjs(selectedDate).isSame(min, 'day');

    return isSame || isBefore;
  }

  private isNextDayAfterOrEqualToMaxDate() {
    const max = this.max();
    const selectedDate = this.matDatepickerInput()?.value;

    if (!max || !selectedDate) return false;

    const isAfter = dayjs(selectedDate).isAfter(max, 'day');
    const isSame = dayjs(selectedDate).isSame(max, 'day');

    return isSame || isAfter;
  }

  private parseDateShortFormat(value: string): Date {
    return dayjs(value, dateShortFormat).toDate();
  }

  private setValueToInput<D extends { value: Date | null }>(
    value: string | null | undefined,
    nativeInput: HTMLInputElement,
    matDateInput: D
  ): void {
    nativeInput.value = value ? this.formatDateTimeFromModelToView(value) : '';
    matDateInput.value = value ? dayjs(value).utc().toDate() : null;
  }

  /**
   * @ignore
   * Formats Date to full ISO 8601 format (e.g. `2022-08-31T22:00:00.000Z`)
   */
  private formatDateFromViewToModel(value: Date): string {
    return dayjs(value).utc().toISOString();
  }

  private formatDateTimeFromModelToView(value: string): string {
    return dayjs(value).tz(danishTimeZoneIdentifier).format(dateShortFormat);
  }

  private toDanishTimeZone(value: Date): Date {
    return dayjs(value.toISOString()).tz(danishTimeZoneIdentifier).toDate();
  }

  private setToEndOfDay(value: Date): Date {
    return dayjs(value).endOf('day').toDate();
  }

  private setEndDateToDanishTimeZone(value: string): Date | null {
    const dateBasedOnShortFormat = this.parseDateShortFormat(value);

    let maybeDateInDanishTimeZone: Date | null = null;

    if (dayjs(dateBasedOnShortFormat).isValid()) {
      maybeDateInDanishTimeZone = this.toDanishTimeZone(dateBasedOnShortFormat);
    }

    return maybeDateInDanishTimeZone;
  }
}
