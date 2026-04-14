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

import {
  WattSegmentedButtonComponent,
  WattSegmentedButtonPosition,
} from './watt-segmented-button.component';

function resolvePosition(index: number, total: number): WattSegmentedButtonPosition {
  if (total === 1) return 'standalone';
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'middle';
}

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
    role: 'radiogroup',
    '(segmentSelect)': 'onSegmentSelect($event)',
    '(keydown)': 'onKeydown($event)',
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
      const focusedIndex = this.resolveFocusedIndex(buttons, selected);

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.selected.set(button.value() === selected);
        button.disabled.set(disabled);
        button.position.set(resolvePosition(i, buttons.length));
        button.tabIndex.set(!disabled && i === focusedIndex ? 0 : -1);
      }
    });
  }

  onSegmentSelect(event: Event): void {
    if (this.disabled()) return;
    this.selected.set((event as CustomEvent<string>).detail);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const buttons = this.buttons();
    if (buttons.length === 0) return;

    const currentIndex = buttons.findIndex((button) => button.value() === this.selected());
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (activeIndex + 1) % buttons.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (activeIndex - 1 + buttons.length) % buttons.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = buttons.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextButton = buttons[nextIndex];
    const nextValue = nextButton.value();
    if (nextValue !== undefined) this.selected.set(nextValue);
    nextButton.focus();
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

  private resolveFocusedIndex(
    buttons: readonly WattSegmentedButtonComponent[],
    selected: string
  ): number {
    const selectedIndex = buttons.findIndex((button) => button.value() === selected);
    return selectedIndex === -1 ? 0 : selectedIndex;
  }
}
