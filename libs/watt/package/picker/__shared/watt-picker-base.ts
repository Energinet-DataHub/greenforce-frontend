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
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';

import { WattDateRange } from '@energinet/watt/core/date';
import { WattPickerValue } from './watt-picker-value';

@Directive()
export abstract class WattPickerBase
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  protected elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected changeDetectionRef = inject(ChangeDetectorRef);
  protected ngControl = inject(NgControl, { optional: true });

  /**
   * @ignore
   */
  abstract input: ElementRef;

  /**
   * @ignore
   */
  abstract startInput: ElementRef;

  /**
   * @ignore
   */
  abstract endInput: ElementRef;

  /**
   * @ignore
   */
  static nextId = 0;

  /**
   * @ignore
   */
  id: string;

  /**
   * @ignore
   */
  initialValue: WattPickerValue = null;

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
  stateChanges = new Subject<void>();

  /**
   * @ignore
   */
  protected _destroyRef = inject(DestroyRef);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy?: string;

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
  protected abstract _placeholder: string;

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  private _range = false;

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
  @HostBinding('attr.watt-field-disabled')
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
  get empty() {
    if (this.range) {
      return !this.ngControl?.value?.start && !this.ngControl?.value?.end;
    } else {
      return this.ngControl?.value?.length === 0;
    }
  }

  /**
   * @ignore
   */
  get errorState(): boolean {
    return !!this.ngControl?.invalid && !!this.ngControl?.touched;
  }

  /**
   * @ignore
   */
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  /**
   *
   * @ignore
   */
  control: FormControl | null = null;

  constructor(id: string) {
    this.id = id;
    this.elementRef.nativeElement.setAttribute('id', id);

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.control = this.ngControl?.control as FormControl;
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {
    if (this.initialValue) {
      this.writeValue(this.initialValue);
    }

    if (this.range) {
      this.initRangeInput();
    } else {
      this.initSingleInput();
    }
  }

  /**
   * @ignore
   */
  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  /**
   * @ignore
   */
  protected abstract initRangeInput(): void;

  /**
   * @ignore
   */
  protected abstract initSingleInput(): void;

  /**
   * @ignore
   */
  protected abstract setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ): void;

  /**
   * @ignore
   */
  protected abstract setRangeValue(
    value: WattDateRange,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ): void;

  /**
   * @ignore
   */
  setDescribedByIds(ids: string[]) {
    this.elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
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
  writeValue(value: WattPickerValue): void {
    this.value = value;
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: string | WattDateRange) => void): void {
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
    this.changeDetectionRef.detectChanges();
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
    const id = this.elementRef.nativeElement.attributes.getNamedItem('aria-owns');
    const overlay = id ? document.getElementById(id.value) : null;
    const isChild = overlay?.contains(event.relatedTarget as Element);

    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element) && !isChild) {
      this.focused = false;
      this.markParentControlAsTouched();
      this.stateChanges.next();
    }
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected changeParentValue = (value: string | WattDateRange): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  protected markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };
}
