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
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { takeUntil } from 'rxjs';

import {
  WattInputMaskService,
  WattMaskedInput,
} from '../shared/watt-input-mask.service';
import { WattPickerBase } from '../shared/watt-picker-base';
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
export class WattTimepickerComponent extends WattPickerBase {
  /**
   * @ignore
   */
  @ViewChild('timeInput')
  input!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('startTimeInput')
  startInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endTimeInput')
  endInput!: ElementRef;

  /**
   * @ignore
   */
  protected _placeholder = hoursMinutesPlaceholder;

  constructor(
    protected inputMaskService: WattInputMaskService,
    protected rangeInputService: WattRangeInputService,
    protected elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() private ngControl: NgControl
  ) {
    super(
      `watt-timepicker-${WattTimepickerComponent.nextId++}`,
      inputMaskService,
      rangeInputService,
      elementRef,
      ngControl
    );
  }

  /**
   * @ignore
   */
  protected initSingleInput() {
    const { maskedInput } = this.maskInput(
      this.input.nativeElement,
      this.initialValue as string | null
    );

    maskedInput.onChange$.subscribe((value: string) => {
      this.markParentControlAsTouched();
      this.changeParentValue(value);
    });
  }

  /**
   * @ignore
   */
  protected initRangeInput() {
    // Setup and subscribe for input changes
    this.rangeInputService.init({
      startInput: this.maskInput(
        this.startInput.nativeElement,
        (this.initialValue as WattRange | null)?.start
      ),
      endInput: this.maskInput(
        this.endInput.nativeElement,
        (this.initialValue as WattRange | null)?.end
      ),
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
  private maskInput(
    input: HTMLInputElement,
    initialValue: string | null = ''
  ): { element: HTMLInputElement; maskedInput: WattMaskedInput } {
    const maskedInput = this.inputMaskService.mask(
      initialValue,
      hoursMinutesFormat,
      this.placeholder,
      input
    );
    return { element: input, maskedInput };
  }
}
