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
  Observable,
  startWith,
  Subject,
  takeUntil,
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
    const onInputStart$ = this.mask(this.startDateInput, 'start');
    const onInputEnd$ = this.mask(this.endDateInput, 'end');

    combineLatest([onInputStart$, onInputEnd$])
      .pipe(takeUntil(this.destroy$))
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
    if (!this.startDateInput || !this.endDateInput) return;
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
  private mask(
    element: ElementRef,
    position: 'start' | 'end'
  ): Observable<string> {
    this.renderer.setAttribute(element.nativeElement, 'spellcheck', 'false');
    const maskingElement = this.appendMaskElement(element);

    const inputmask = new Inputmask('datetime', {
      inputFormat: this.inputFormat,
      placeholder: this.placeholder,
      onBeforePaste: this.onBeforePaste,
      onincomplete: () => {
        maskingElement.innerHTML = this.placeholder;
      },
      jitMasking: true,
      clearIncomplete: true,
      onKeyDown: (event) => {
        // If start date is complete jump to end date, and put typed value in end date (if empty)
        if (
          event.key !== 'Backspace' &&
          position === 'start' &&
          inputmask.isComplete()
        ) {
          this.endDateInput.nativeElement.focus();
          if (this.endDateInput.nativeElement.value === '') {
            this.endDateInput.nativeElement.value = event.key;
          }
        }
      },
    }).mask(element.nativeElement);

    return this.registerOnInput(element.nativeElement, inputmask);
  }

  /**
   * @ignore
   */
  private registerOnInput(
    element: HTMLInputElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputMask: any
  ): Observable<string> {
    return fromEvent(element, 'input').pipe(
      startWith(element.value),
      map(() => element.value),
      map((val) => (inputMask.isComplete() ? val : '')),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  /**
   * @ignore
   */
  private appendMaskElement(element: ElementRef): HTMLElement {
    const maskingElement = this.renderer.createElement('span');
    this.renderer.addClass(maskingElement, 'watt-date-mask');
    this.renderer.insertBefore(
      element.nativeElement.parentElement,
      maskingElement,
      element.nativeElement
    );
    maskingElement.innerHTML = this.placeholder;

    fromEvent(element.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateMaskElementValue(
          maskingElement,
          element.nativeElement.value
        );
      });

    return maskingElement;
  }

  /**
   * @ignore
   */
  private updateMaskElementValue(
    maskingElement: HTMLElement,
    value: string
  ): void {
    maskingElement.innerText = value + this.placeholder.substring(value.length);
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
