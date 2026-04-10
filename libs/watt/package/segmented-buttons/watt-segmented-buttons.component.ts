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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  model,
  signal,
  inject,
  effect,
  Component,
  ElementRef,
  forwardRef,
  contentChildren,
  ChangeDetectionStrategy,
} from '@angular/core';

import { WattSegmentedButtonComponent } from './watt-segmented-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattSegmentedButtonsComponent),
      multi: true,
    },
  ],
  selector: 'watt-segmented-buttons',
  host: {
    '(segmentSelect)': 'onSegmentSelect($event)',
  },
  styles: `
    :host {
      display: inline-flex;
    }
  `,
  template: `<ng-content />`,
})
export class WattSegmentedButtonsComponent implements ControlValueAccessor {
  private readonly element = inject(ElementRef);
  private readonly buttons = contentChildren(WattSegmentedButtonComponent);
  selected = model<string>('');
  disabled = signal(false);

  constructor() {
    effect(() => {
      const buttons = this.buttons();
      const selected = this.selected();
      const disabled = this.disabled();
      const last = buttons.length - 1;

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.selected = button.value() === selected;
        button.disabled = disabled;
        button.position = i === 0 ? 'first' : i === last ? 'last' : 'middle';
      }
    });
  }

  onSegmentSelect(event: Event): void {
    if (this.disabled()) return;
    this.selected.set((event as CustomEvent<string>).detail);
  }

  writeValue(selected: string): void {
    this.selected.set(selected);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.selected.subscribe(fn);
  }

  registerOnTouched(fn: (value: boolean) => void): void {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
