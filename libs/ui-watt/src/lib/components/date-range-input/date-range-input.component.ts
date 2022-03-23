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
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { MatDateRangeInput } from '@angular/material/datepicker';
import Inputmask from "inputmask";

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
export class WattDateRangeInputComponent implements AfterViewInit, OnDestroy {
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
  private isDisabled = false;

  get disabled(): boolean {
    return this.isDisabled;
  }

  @Input()
  set disabled(value: boolean) {
    this.isDisabled = coerceBooleanProperty(value);
  }

  @Input() min?: string;
  @Input() max?: string;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private renderer: Renderer2
  ) {}

  /**
   * @ignore
   */
  ngAfterViewInit() {
    this.mask(this.startDateInput, 'start');
    this.mask(this.endDateInput, 'end');
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
  private mask(element: ElementRef, position: 'start' | 'end'): void {
    this.renderer.setAttribute(element.nativeElement, 'spellcheck', 'false');
    this.appendMaskElement(element);

    new Inputmask('datetime', {
      inputFormat: this.inputFormat,
      placeholder: this.placeholder,
      onBeforePaste: this.onBeforePaste,
      oncomplete: () => {
        if(position === 'start') {
          this.endDateInput.nativeElement.focus();
        }
      }
    }).mask(element.nativeElement);
  }

  /**
   * @ignore
   */
  private appendMaskElement(element: ElementRef): HTMLElement {
    const maskingElement = this.renderer.createElement('span');
    this.renderer.addClass(maskingElement, 'watt-date-mask');
    this.renderer.appendChild(
      element.nativeElement.parentElement,
      maskingElement
    );

    fromEvent(element.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateMaskElementValue(maskingElement, element.nativeElement.value);
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
    const lastNumber = value.match(/.*?(\d)[^\d]*$/); // get last number in string
    maskingElement.innerHTML = value && lastNumber
      ? value.slice(0, value.lastIndexOf(lastNumber[1]) + 1)
      : '';
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
