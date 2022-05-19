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
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, takeUntil } from 'rxjs';

import { WattInputMaskService } from '../shared/watt-input-mask.service';
import { WattPickerValue } from '../shared/watt-picker-value';
import { WattRange } from '../shared/watt-range';
import { WattRangeInputService } from '../shared/watt-range-input.service';

/**
 * Note: `Inputmask` package uses upper case `MM` for "minutes" and
 * lower case `mm` for "months".
 * This is opposite of what most other date libraries do.
 */
const hoursMinutesFormat = 'HH:MM';
const hoursMinutesPlaceholder = 'HH:MM';

/**
 * Usage:
 * `import { WattTimeRangeInputModule } from '@energinet-datahub/watt';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
  selector: 'watt-timepicker',
  templateUrl: './watt-timepicker.component.html',
  styleUrls: ['./watt-timepicker.component.scss'],
  providers: [
    WattInputMaskService,
    WattRangeInputService,
    { provide: MatFormFieldControl, useExisting: WattTimepickerComponent },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WattTimepickerComponent
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
  @ViewChild(MatDateRangeInput)
  matDateRangeInput!: MatDateRangeInput<unknown>;

  /**
   * @ignore
   */
  @ViewChild('timeInput')
  timeInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('startTimeInput')
  startTimeInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endTimeInput')
  endTimeInput!: ElementRef;

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
  id = `watt-timepicker-${WattTimepickerComponent.nextId++}`;

  /**
   * @ignore
   */
  @HostBinding('id') hostId = this.id;

  /**
   * @ignore
   */
  get empty() {
    if (this.range) {
      return !this.ngControl.value?.start && !this.ngControl.value?.end;
    } else {
      return this.ngControl.value?.length === 0;
    }
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
  private _placeholder: string = hoursMinutesPlaceholder;

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
  set value(value: WattPickerValue) {
    const inputNotToBeInTheDocument = !this.range
      ? !this.timeInput
      : !this.startTimeInput;

    if (inputNotToBeInTheDocument) {
      this.initialValue = value;
      return;
    }

    const inputEvent = new Event('input', { bubbles: true });

    if (!this.range) {
      console.log('NOT RANGE', value);
      this.timeInput.nativeElement.value = value;
      this.timeInput.nativeElement.dispatchEvent(inputEvent);
      this.stateChanges.next();
      return;
    }

    const { start, end } = value as WattRange;

    if (start) {
      this.startTimeInput.nativeElement.value = start;
      this.startTimeInput.nativeElement.dispatchEvent(inputEvent);
    }

    if (end) {
      this.endTimeInput.nativeElement.value = end;
      this.endTimeInput.nativeElement.dispatchEvent(inputEvent);
    }

    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  get errorState(): boolean {
    return !!this.ngControl.invalid && !!this.ngControl.touched;
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
  initialValue: WattPickerValue = null;

  constructor(
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

    this.range ? this.initRangeInput() : this.initSingleInput();
  }

  /**
   * @ignore
   */
  private initSingleInput() {
    const { onChange$ } = this.inputMaskService.mask(
      this.initialValue as string | null,
      hoursMinutesFormat,
      this.placeholder,
      this.timeInput.nativeElement
    );

    onChange$.subscribe((value: string) => {
      this.markParentControlAsTouched();
      this.changeParentValue(value);
    });
  }

  /**
   * @ignore
   */
  private initRangeInput() {
    const startTimeInputElement: HTMLInputElement =
      this.startTimeInput.nativeElement;

    const startTimeInputMask = this.inputMaskService.mask(
      (this.initialValue as WattRange | null)?.start,
      hoursMinutesFormat,
      this.placeholder,
      startTimeInputElement
    );

    const endTimeInputElement: HTMLInputElement =
      this.endTimeInput.nativeElement;

    const endTimeInputMask = this.inputMaskService.mask(
      (this.initialValue as WattRange | null)?.end,
      hoursMinutesFormat,
      this.placeholder,
      endTimeInputElement
    );

    // Setup and subscribe for input changes
    this.rangeInputService.init({
      startInput: {
        element: startTimeInputElement,
        maskedInput: startTimeInputMask,
      },
      endInput: {
        element: endTimeInputElement,
        maskedInput: endTimeInputMask,
      },
    });

    this.rangeInputService.onInputChanges$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(([start, end]) => {
        this.markParentControlAsTouched();
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
  writeValue(value: WattPickerValue): void {
    this.value = value;
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: string | WattRange) => void): void {
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
  private changeParentValue = (_value: string | WattRange): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  private markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };
}
