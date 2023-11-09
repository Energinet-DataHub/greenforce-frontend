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
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  inject,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';

import { WattInputMaskService } from './watt-input-mask.service';
import { WattPickerValue } from './watt-picker-value';
import { WattDateRange } from '../../../utils/date';
import { WattRangeInputService } from './watt-range-input.service';

@Directive()
export abstract class WattPickerBase
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  abstract input: ElementRef;

  abstract startInput: ElementRef;

  abstract endInput: ElementRef;

  static nextId = 0;

  initialValue: WattPickerValue = null;

  focused = false;

  controlType = 'mat-date-range-input'; // We keep the controlType of Material Date Range Input as is, to keep some styling.

  stateChanges = new Subject<void>();

  protected _destroyRef = inject(DestroyRef);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy?: string;

  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  protected abstract _placeholder: string;

  @Input()
  get value(): WattDateRange | null {
    if (this.ngControl?.valid) {
      const {
        value: { start, end },
      } = this.ngControl;

      return { start, end };
    }

    return null;
  }

  set value(value: WattPickerValue) {
    const inputNotToBeInTheDocument = !this.range ? !this.input : !this.startInput;

    if (inputNotToBeInTheDocument) {
      this.initialValue = value;
      return;
    }

    if (this.range) {
      this.setRangeValue(
        value as WattDateRange,
        this.startInput.nativeElement,
        this.endInput.nativeElement
      );
    } else {
      this.setSingleValue(
        value as Exclude<WattPickerValue, WattDateRange>,
        this.input.nativeElement
      );
    }

    this.stateChanges.next();
  }

  @Input()
  set range(range: boolean) {
    this._range = coerceBooleanProperty(range);
  }
  get range(): boolean {
    return this._range;
  }

  private _range = false;

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _disabled = false;

  get empty() {
    if (this.range) {
      return !this.ngControl?.value?.start && !this.ngControl?.value?.end;
    } else {
      return this.ngControl?.value?.length === 0;
    }
  }

  get errorState(): boolean {
    return !!this.ngControl?.invalid && !!this.ngControl?.touched;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  ngControl: NgControl | null = null;

  /**
   *
   * @ignore
   */
  control: FormControl | null = null;

  constructor(
    public id: string,
    protected inputMaskService: WattInputMaskService,
    protected rangeInputService: WattRangeInputService,
    protected elementRef: ElementRef<HTMLElement>,
    protected changeDetectionRef: ChangeDetectorRef,
    @Optional() ngControl: NgControl
  ) {
    this.elementRef.nativeElement.setAttribute('id', id);
    this.ngControl = ngControl;

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.control = this.ngControl?.control as FormControl;
  }

  ngAfterViewInit() {
    if (this.initialValue) {
      this.writeValue(this.initialValue);
    }

    this.range ? this.initRangeInput() : this.initSingleInput();
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  protected abstract initRangeInput(): void;

  protected abstract initSingleInput(): void;

  protected abstract setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ): void;

  protected abstract setRangeValue(
    value: WattDateRange,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ): void;

  setDescribedByIds(ids: string[]) {
    this.elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    // Intentionally left empty
  }

  writeValue(value: WattPickerValue): void {
    this.value = value;
  }

  registerOnChange(onChangeFn: (value: string | WattDateRange) => void): void {
    this.changeParentValue = onChangeFn;
  }

  registerOnTouched(onTouchFn: () => void) {
    this.markParentControlAsTouched = onTouchFn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectionRef.detectChanges();
  }

  onFocusIn() {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    const id = this.elementRef.nativeElement.attributes.getNamedItem('aria-owns');
    const overlay = id ? document.getElementById(id.value) : null;
    const isChild = overlay?.contains(event.relatedTarget as Element);

    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element) && !isChild) {
      this.focused = false;
      this.markParentControlAsTouched();
      this.stateChanges.next();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected changeParentValue = (value: string | WattDateRange): void => {
    // Intentionally left empty
  };

  protected markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };
}
