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
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  fromEvent,
  map,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import { MatDateRangeInput } from '@angular/material/datepicker';
import Inputmask from 'inputmask';

export type WattDateRange = { start: string; end: string };

/**
 * Usage:
 * `import { WattDateRangeInputModule } from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-date-range-input',
  templateUrl: './date-range-input.component.html',
  styleUrls: ['./date-range-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
  @ViewChild('endDate')
  endDateInput!: ElementRef;

  @Input()
  set disabled(value: BooleanInput) {
    this.isDisabled = coerceBooleanProperty(value);
  }

  /**
   * @ignore
   */
  get disabled(): boolean {
    return this.isDisabled;
  }
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
  private destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * @ignore
   */
  initialValue?: WattDateRange;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private renderer: Renderer2,
    @Host() private parentControlDirective: NgControl
  ) {
    this.parentControlDirective.valueAccessor = this;
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {
    const startDateInputElement = this.startDateInput.nativeElement;
    const endDateInputElement = this.endDateInput.nativeElement;

    const startDateInputMask = this.mask(startDateInputElement);
    const endDateInputMask = this.mask(endDateInputElement);

    if(this.initialValue) {
      this.writeValue(this.initialValue);
    }

    this.setInputColor(startDateInputElement, startDateInputMask);
    this.setInputColor(endDateInputElement, startDateInputMask);

    const startDateOnInput$ = fromEvent<InputEvent>(
      startDateInputElement,
      'input'
    ).pipe(
      tap(() => this.setInputColor(startDateInputElement, startDateInputMask)),
      tap((event) =>
        this.jumpToEndDate(event, startDateInputMask, endDateInputElement)
      ),
      map((event) => (event.target as HTMLInputElement).value)
    );

    const endDateOnInput$ = fromEvent<InputEvent>(
      endDateInputElement,
      'input'
    ).pipe(
      tap(() => this.setInputColor(endDateInputElement, startDateInputMask)),
      map((event) => (event.target as HTMLInputElement).value)
    );

    const startDateOnComplete$ = startDateOnInput$.pipe(
      startWith(this.initialValue?.start || ''),
      map((val) => (startDateInputMask.isComplete() ? val : ''))
    );

    const endDateOnComplete$ = endDateOnInput$.pipe(
      startWith(this.initialValue?.end || ''),
      map((val) => (endDateInputMask.isComplete() ? val : ''))
    );

    combineLatest([startDateOnComplete$, endDateOnComplete$])
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        this.markParentControlAsTouched();
        this.changeParentValue({ start, end });
      });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * @ignore
   */
  writeValue(dateRange: WattDateRange): void {
    if (!this.startDateInput || !this.endDateInput) {
      this.initialValue = dateRange;
      return;
    };

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
  private mask(element: HTMLInputElement): Inputmask.Instance {
    const inputmask = new Inputmask('datetime', {
      inputFormat: this.inputFormat,
      placeholder: this.placeholder,
      insertMode: false,
      insertModeVisual: true,
      clearMaskOnLostFocus: false,
      onBeforePaste: this.onBeforePaste,
      onincomplete: () => {
        this.setInputColor(element, inputmask);
      },
      clearIncomplete: true,
    }).mask(element);

    return inputmask;
  }

  /**
   * @ignore
   */
  private setInputColor(
    inputElement: HTMLInputElement,
    inputMask: Inputmask.Instance
  ) {
    const emptyMask = inputMask.getemptymask();
    const val = inputElement.value;

    const splittedEmptyMask = emptyMask.split('');
    const splittedVal = val.split('');

    const charWidth = 9;
    const gradient = splittedEmptyMask.map((char, index) => {
      const charHasChanged =
        char !== splittedVal[index] && splittedVal[index] !== undefined;
      const color = charHasChanged
        ? 'var(--watt-color-neutral-black)'
        : 'var(--watt-color-neutral-grey-500)';
      const gradientStart =
        index === 0 ? `${charWidth}px` : `${charWidth * index}px`;
      const gradientEnd =
        index === 0 ? `${charWidth}px` : `${charWidth * (index + 1)}px`;

      if (index === 0) {
        return `${color} ${gradientStart},`;
      } else {
        return `${color} ${gradientStart}, ${color} ${gradientEnd}${
          index !== splittedEmptyMask.length - 1 ? ',' : ''
        }`;
      }
    });

    this.renderer.setStyle(
      inputElement,
      'background-image',
      `linear-gradient(90deg, ${gradient.join('')})`
    );
  }

  /**
   * @ignore
   */
  private jumpToEndDate(
    event: InputEvent,
    inputmask: Inputmask.Instance,
    endInputElement: HTMLInputElement
  ) {
    if (
      inputmask.isComplete() &&
      (event.target as HTMLInputElement).value.length ===
        inputmask.getemptymask().length
    ) {
      endInputElement.focus();
    }
  }

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
