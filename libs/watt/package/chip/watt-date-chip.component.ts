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
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
  effect,
  DestroyRef,
  inject,
} from '@angular/core';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattDatePipe, dayjs } from '@energinet/watt/core/date';
import { WattFieldComponent } from '@energinet/watt/field';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WattMenuChipComponent } from './watt-menu-chip.component';
import { danishTimeZoneIdentifier } from '@energinet/watt/picker/datepicker';

@Component({
  imports: [MatDatepickerModule, WattMenuChipComponent, WattFieldComponent, WattDatePipe],
  selector: 'watt-date-chip',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      watt-date-chip {
        input {
          top: 0;
          bottom: 0;
          height: auto;
          visibility: hidden;
        }

        watt-field label .watt-field-wrapper {
          background-color: transparent;
        }
      }
    `,
  ],
  template: `
    <mat-datepicker #picker />
    <watt-field [control]="formControl()" [chipMode]="true">
      <watt-menu-chip
        hasPopup="dialog"
        [disabled]="formControl().disabled"
        [selected]="!!value()"
        [opened]="picker.opened"
        (toggle)="picker.open()"
      >
        <input
          tabindex="-1"
          class="cdk-visually-hidden"
          type="text"
          [value]="value()"
          [matDatepicker]="picker"
          (dateChange)="handleDateChange($event)"
        />
        {{ placeholder() }}
        <span>
          @if (value()) {
            @if (placeholder()) {
              :
            }
            {{ value() | wattDate }}
          }
        </span>
      </watt-menu-chip>
      <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
      <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
    </watt-field>
  `,
})
export class WattDateChipComponent {
  label = input<string>();
  placeholder = input<string>();
  formControl = input.required<FormControl>();
  isEndDate = input(false);

  selectionChange = output<Date>();

  // Track the internal value as a signal
  private readonly internalValue = signal<Date | null>(null);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Initialize and sync with form control
    effect(() => {
      const control = this.formControl();
      let subscription: Subscription | undefined;

      if (control) {
        // Set initial value
        if (control.value) {
          const dateValue = dayjs(control.value).tz(danishTimeZoneIdentifier).toDate();
          this.internalValue.set(dateValue);
        } else {
          this.internalValue.set(null);
        }

        // Subscribe to value changes
        subscription = control.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value) => {
            if (value) {
              const dateValue = dayjs(value).tz(danishTimeZoneIdentifier).toDate();
              this.internalValue.set(dateValue);
            } else {
              this.internalValue.set(null);
            }
          });
      }
      // Cleanup function to unsubscribe when effect re-runs
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    });
  }

  // Expose value as a computed signal for the template
  readonly value = computed(() => this.internalValue());

  // Method for the directive to update the value
  updateValue(val: Date | string | null) {
    if (val) {
      const dateValue = dayjs(val).tz(danishTimeZoneIdentifier).toDate();
      this.internalValue.set(dateValue);
    } else {
      this.internalValue.set(null);
    }
  }

  handleDateChange(event: MatDatepickerInputEvent<Date>) {
    const control = this.formControl();
    if (!control) return;

    if (event.value) {
      let dateWithTimezone = dayjs(event.value).tz(danishTimeZoneIdentifier);

      // If this is an end date, set it to the end of the day
      if (this.isEndDate()) {
        dateWithTimezone = dateWithTimezone.endOf('day');
      }

      const dateValue = dateWithTimezone.toDate();
      this.internalValue.set(dateValue);
      this.selectionChange.emit(dateValue);
      control.setValue(dateValue);
    } else {
      this.internalValue.set(null);
      control.setValue(null);
    }
  }
}
