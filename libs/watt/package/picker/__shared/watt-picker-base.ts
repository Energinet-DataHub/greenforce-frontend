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
  Signal,
  OnInit,
  inject,
  signal,
  Directive,
  ElementRef,
  DestroyRef,
  AfterViewInit,
  ChangeDetectorRef,
  input,
  computed,
} from '@angular/core';

import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

import { WattDateRange } from '@energinet/watt/core/date';

import { WattPickerValue } from './watt-picker-value';

@Directive({
  host: {
    '[attr.watt-field-disabled]': 'disabled()',
  },
})
export abstract class WattPickerBase implements OnInit, AfterViewInit, ControlValueAccessor {
  protected destroyRef = inject(DestroyRef);
  protected changeDetectionRef = inject(ChangeDetectorRef);
  protected ngControl = inject(NgControl, { optional: true });
  protected elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  abstract input: Signal<ElementRef<HTMLInputElement> | undefined>;
  abstract endInput: Signal<ElementRef<HTMLInputElement> | undefined>;
  abstract startInput: Signal<ElementRef<HTMLInputElement> | undefined>;

  static nextId = 0;

  id: string;

  initialValue: WattPickerValue = null;

  focused = signal(false);

  controlType = 'mat-date-range-input'; // We keep the controlType of Material Date Range Input as is, to keep some styling.

  // eslint-disable-next-line @angular-eslint/no-input-rename
  userAriaDescribedBy = input<string>(undefined, { alias: 'aria-describedby' });

  placeholder = signal('');

  get value(): WattDateRange | null {
    if (this.ngControl?.valid) {
      const {
        value: { start, end },
      } = this.ngControl;

      return { start, end };
    }

    return null;
  }

  protected setValue(value: WattPickerValue) {
    const input = this.input();
    const startInput = this.startInput();
    const endInput = this.endInput();

    const inputNotToBeInTheDocument = !this.range() ? !input : !startInput;

    if (inputNotToBeInTheDocument) {
      this.initialValue = value;
      return;
    }

    if (this.range()) {
      if (!startInput || !endInput) return;
      this.setRangeValue(value as WattDateRange, startInput.nativeElement, endInput.nativeElement);
    } else {
      if (!input) return;
      this.setSingleValue(value as Exclude<WattPickerValue, WattDateRange>, input.nativeElement);
    }
  }

  range = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });

  required = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });

  disabledInput = input<boolean, BooleanInput>(false, {
    // eslint-disable-next-line @angular-eslint/no-input-rename
    alias: 'disabled',
    transform: coerceBooleanProperty,
  });
  protected disabledState = signal(false);
  disabled = computed(() => this.disabledInput() || this.disabledState());

  get empty(): boolean {
    if (this.range()) {
      return !this.ngControl?.value?.start && !this.ngControl?.value?.end;
    } else {
      return this.ngControl?.value?.length === 0;
    }
  }

  get errorState(): boolean {
    return !!this.ngControl?.invalid && !!this.ngControl?.touched;
  }

  shouldLabelFloat = computed(() => {
    return this.focused() || !this.empty;
  });

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

  ngAfterViewInit(): void {
    if (this.initialValue) {
      this.writeValue(this.initialValue);
    }

    if (this.range()) {
      this.initRangeInput();
    } else {
      this.initSingleInput();
    }
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
    this.setValue(value);
  }

  registerOnChange(onChangeFn: (value: string | WattDateRange) => void): void {
    this.changeParentValue = onChangeFn;
  }

  registerOnTouched(onTouchFn: () => void) {
    this.markParentControlAsTouched = onTouchFn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
    this.changeDetectionRef.detectChanges();
  }

  onFocusIn() {
    if (!this.focused()) {
      this.focused.set(true);
    }
  }

  onFocusOut(event: FocusEvent) {
    const id = this.elementRef.nativeElement.attributes.getNamedItem('aria-owns');
    const overlay = id ? document.getElementById(id.value) : null;
    const isChild = overlay?.contains(event.relatedTarget as Element);

    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element) && !isChild) {
      this.focused.set(false);
      this.markParentControlAsTouched();
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
