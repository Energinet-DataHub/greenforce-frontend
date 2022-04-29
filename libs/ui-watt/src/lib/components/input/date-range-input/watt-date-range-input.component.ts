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
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, takeUntil } from 'rxjs';

import { WattInputMaskService } from '../shared/watt-input-mask.service';
import { WattRangeInputService } from '../shared/watt-range-input.service';
import { WattRange } from '../shared/watt-range';

const danishLocaleCode = 'da';

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
  providers: [
    WattInputMaskService,
    WattRangeInputService,
    { provide: MatFormFieldControl, useExisting: WattDateRangeInputComponent },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WattDateRangeInputComponent
  implements
    AfterViewInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<WattRange>
{
  /**
   * @ignore
   */
  static nextId = 0;

  /**
   * @ignore
   */
  private destroy$: Subject<void> = new Subject();

  /**
   * @ignore
   */
  stateChanges = new Subject<void>();

  /**
   * @ignore
   */
  focused = false;

  /**
   * @ignore
   */
  controlType = 'mat-date-range-input'; // We keep the controlType of Material Date Range Input as is, to keep some styling.

  /**
   * @ignore
   */
  id = `watt-date-range-input-${WattDateRangeInputComponent.nextId++}`;

  /**
   * @ignore
   */
  get empty() {
    const { start, end } = this.ngControl.value;
    return !start && !end;
  }

  /**
   * @ignore
   */
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy?: string;

  /**
   * @ignore
   */
  inputFormat: string = this.getInputFormat();

  /**
   * @ignore
   */
  get placeholder(): string {
    return this._placeholder;
  }

  /**
   * @ignore
   */
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  private _placeholder: string = this.getPlaceholder(this.inputFormat);

  /**
   * @ignore
   */
  @Input()
  get required(): boolean {
    return this._required;
  }

  /**
   * @ignore
   */
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  private _required = false;

  /**
   * @ignore
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @ignore
   */
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  private _disabled = false;

  /**
   * @ignore
   */
  @Input()
  get value(): WattRange | null {
    if (this.ngControl.valid) {
      const {
        value: { start, end },
      } = this.ngControl;
      return { start, end };
    }
    return null;
  }

  /**
   * @ignore
   */
  set value(range: WattRange | null) {
    if (!this.startDateInput || !this.endDateInput) {
      this.initialValue = range;
      return;
    }

    const inputEvent = new Event('input', { bubbles: true });

    if (range?.start) {
      this.startDateInput.nativeElement.value = range.start;
      this.startDateInput.nativeElement.dispatchEvent(inputEvent);
    }

    if (range?.end) {
      this.endDateInput.nativeElement.value = range.end;
      this.endDateInput.nativeElement.dispatchEvent(inputEvent);
    }
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  get errorState(): boolean {
    return !!this.ngControl.invalid && !!this.ngControl.touched;
  }

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
  initialValue?: WattRange | null = null;

  /**
   * @ignore
   */
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private inputMaskService: WattInputMaskService,
    private rangeInputService: WattRangeInputService,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * @ignore
   */
  setDescribedByIds(ids: string[]) {
    this.elementRef.nativeElement.setAttribute(
      'aria-describedby',
      ids.join(' ')
    );
  }

  /**
   * @ignore
   */
  onContainerClick() {
    // Intentionally left empty
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
      (value) => this.onBeforePaste(value)
    );

    const endDateInputElement = this.endDateInput.nativeElement;
    const endDateInputMask = this.inputMaskService.mask(
      this.inputFormat,
      this.placeholder,
      endDateInputElement,
      (value) => this.onBeforePaste(value)
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

    this.rangeInputService.onInputChanges$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        this.changeParentValue({ start, end });
      });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stateChanges.complete();
  }

  /**
   * @ignore
   */
  writeValue(range: WattRange | null): void {
    this.value = range;
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: WattRange) => void): void {
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
    this.disabled = isDisabled;
  }

  /**
   * @ignore
   */
  onFocusIn() {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  /**
   * @ignore
   */
  onFocusOut(event: FocusEvent) {
    if (
      !this.elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.focused = false;
      this.markParentControlAsTouched();
      this.stateChanges.next();
    }
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private changeParentValue = (value: WattRange): void => {
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
    if (this.locale !== danishLocaleCode) return pastedValue;

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
    return this.locale === danishLocaleCode
      ? inputFormat.split('y').join('å')
      : inputFormat;
  }
}
