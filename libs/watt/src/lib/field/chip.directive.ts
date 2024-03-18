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

import { Directive, ElementRef, EventEmitter, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
//import { WattDateChipComponent, WattDateRangeChipComponent } from '@energinet-datahub/watt/picker';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface WattChip {
  value?: any;
  disabled: boolean;
  selectionChange: EventEmitter<any>;
}

@Directive({
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattFormChipDirective),
      multi: true,
    },
  ],
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: `
    watt-filter-chip[formControl],
    watt-date-chip[formControl],
    watt-date-range-chip[formControl],
    watt-filter-chip[formControlName],
    watt-date-chip[formControlName],
    watt-date-range-chip[formControlName],
  `,
})
export class WattFormChipDirective implements ControlValueAccessor {
  private filterChip = inject(WattFilterChipComponent, { host: true, optional: true, self: true });
  /*private dateChip = inject(WattDateChipComponent, { host: true, optional: true, self: true });
  private dateRangeChip = inject(WattDateRangeChipComponent, {
    host: true,
    optional: true,
    self: true,
  });*/

  private element = inject(ElementRef);
  private component?: WattChip;

  constructor() {
    /*
    if (this.filterChip) {
      this.component = this.filterChip;
    } else if (this.dateChip) {
      this.component = this.dateChip;
    } else if (this.dateRangeChip) {
      this.component = this.dateRangeChip;
    }*/
  }

  writeValue(value?: any): void {
    if (this.component) {
      this.component.value = value;
    }
  }

  registerOnChange(fn: () => void) {
    this.component?.selectionChange.subscribe(fn);
  }

  registerOnTouched(fn: () => void) {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  setDisabledState(disabled: boolean) {
    if (this.component) {
      this.component.disabled = disabled;
    }
  }
}
