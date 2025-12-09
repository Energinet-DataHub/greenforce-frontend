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
  forwardRef,
  ViewEncapsulation,
  input,
  model,
  output,
  computed,
  booleanAttribute,
  ChangeDetectionStrategy,
  contentChildren,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { WattFieldComponent } from '@energinet/watt/field';
import { WattRadioComponent } from './watt-radio.component';

@Component({
  imports: [WattFieldComponent, WattRadioComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattRadioGroupComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-radio-group',
  styles: `
    watt-radio-group.readonly watt-radio {
      pointer-events: none;

      & input,
      &:has(input:not(:checked)) {
        display: none;
      }
    }
  `,
  template: `
    <watt-field [label]="label()" displayMode="content">
      <ng-content />
    </watt-field>
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.disabled]': 'disabled()',
    '[class.readonly]': 'readonly()',
  },
})
export class WattRadioGroupComponent<T> implements ControlValueAccessor {
  /**
   * The field label.
   */
  label = input<string>();

  /**
   * The value of the radio button group.
   */
  value = model<T | null>();

  /**
   * Optional input for setting the name of the radio buttons.
   * If no name is provided, the name will be auto-generated.
   */
  name = input<string>();

  /**
   * Whether the radio button group is readonly.
   */
  readonly = input(false, { transform: booleanAttribute });

  /**
   * Whether the radio button group is disabled.
   */
  disabled = model(false);

  /**
   * Emits when the radio button group is touched.
   */
  touched = output();

  // Used for generating unique radio button names
  private static instance = 1;
  private instance = WattRadioGroupComponent.instance++;
  private group = computed(() => this.name() ?? `watt-radio-group-${this.instance}`);

  private radios = contentChildren(WattRadioComponent<T>, { descendants: true });
  protected inheritPropertiesEffect = effect(() => {
    this.radios().forEach((r) => {
      r.disabled.set(this.disabled());
      r.name.set(this.group());
    });
  });

  // Two-way binding
  constructor() {
    effect(() => {
      // group -> buttons
      this.radios().forEach((r) => {
        r.checked.set(r.value() === this.value());
      });
    });

    // buttons -> group
    effect((onCleanup) => {
      const subscriptions = this.radios().map((r) =>
        r.isChecked.subscribe(() => {
          this.value.set(r.value());
        })
      );

      onCleanup(() => subscriptions.forEach((s) => s.unsubscribe()));
    });
  }

  // Implementation for ControlValueAccessor
  writeValue = (value: T | null | undefined) => this.value.set(value);
  setDisabledState = (isDisabled: boolean) => this.disabled.set(isDisabled);
  registerOnTouched = (fn: () => void) => this.touched.subscribe(fn);
  registerOnChange = (fn: (value: T | null | undefined) => void) => this.value.subscribe(fn);
}

export const WATT_RADIO = [WattRadioGroupComponent, WattRadioComponent] as const;
