import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  LOCALE_ID,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { NgControl } from '@angular/forms';

import { zonedTimeToUtc } from 'date-fns-tz';
import { combineLatest, map, takeUntil } from 'rxjs';
import { MatLegacyFormFieldControl as MatFormFieldControl } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { WattPickerBase } from '../shared/watt-picker-base';
import { WattRange } from '../timepicker';
import { WattButtonModule } from '../../button';

import { danishTimeZoneIdentifier } from './watt-datepicker.component';

@Component({
  selector: 'watt-chip-datepicker',
  templateUrl: './watt-chip-datepicker.component.html',
  styleUrls: ['./watt-chip-datepicker.component.scss'],
  standalone: true,
  providers: [
    { provide: MatFormFieldControl, useExisting: WattChipDatepickerComponent },
    MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [MatDatepickerModule, MatInputModule, WattButtonModule, CommonModule],
})
export class WattChipDatepickerComponent extends WattPickerBase {
  @Input() max?: Date;
  @Input() min?: Date;

  @ViewChild(MatDatepickerInput)
  matDatepickerInput!: MatDatepickerInput<Date>;

  @ViewChild(MatDatepicker)
  matDatepicker!: MatDatepicker<Date>;

  @ViewChild(MatStartDate)
  matStartDate!: MatStartDate<Date>;

  @ViewChild(MatEndDate)
  matEndDate!: MatEndDate<Date>;

  @ViewChild('dateInput')
  input!: ElementRef;

  @ViewChild('startDateInput')
  startInput!: ElementRef;

  @ViewChild('endDateInput')
  endInput!: ElementRef;

  protected _placeholder = 'Periode';

  @HostBinding('class.isOpen') isOpen = false;

  constructor(
    protected override elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() ngControl: NgControl,
    @Inject(LOCALE_ID) private locale: string,
    private cdr: ChangeDetectorRef
  ) {
    super(`watt-datepicker-${WattChipDatepickerComponent.nextId++}`, elementRef, cdr, ngControl);
  }

  protected override initRangeInput(): void {
    const matStartDateChange$ = this.matStartDate.dateInput.pipe(
      map(({ value }) => {
        return value;
      })
    );

    const matEndDateChange$ = this.matEndDate.dateInput.pipe(
      map(({ value }) => {
        return value;
      })
    );

    combineLatest([matStartDateChange$, matEndDateChange$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        this.markParentControlAsTouched();
        this.changeParentValue({ start: start?.toString(), end: end?.toString() } as WattRange);
      });
  }
  protected override initSingleInput(): void {
    const matDatepickerChange$ = this.matDatepickerInput.dateInput.pipe(
      map(({ value }) => {
        return value;
      })
    );

    matDatepickerChange$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.changeParentValue(value?.toString() ?? '');
    });
  }
  protected override setSingleValue(
    value: string | null | undefined,
    input: HTMLInputElement
  ): void {
    this.setValueToInput(value, input, this.matDatepickerInput);
  }
  protected override setRangeValue(
    value: WattRange,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ): void {
    const { start, end } = value;

    this.setValueToInput(start, startInput, this.matStartDate);
    this.setValueToInput(end, endInput, this.matEndDate);
  }

  private setValueToInput<D extends { value: Date | null }>(
    value: string | null | undefined,
    nativeInput: HTMLInputElement,
    matDateInput: D
  ): void {
    nativeInput.value = value ?? '';
    matDateInput.value = value ? zonedTimeToUtc(value, danishTimeZoneIdentifier) : null;
  }

  togglePicker(): void {
    if (this.isOpen === false) {
      this.matDatepicker.open();
      this.isOpen = !this.isOpen;
    } else {
      this.matDatepicker.close();
      this.isOpen = !this.isOpen;
    }
  }

  closed() {
    this.isOpen = false;
  }
}
