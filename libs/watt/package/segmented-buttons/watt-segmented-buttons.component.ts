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

type ReadonlyButtons = readonly WattSegmentedButtonComponent[];

const POSITION_CLASSES = ['start', 'middle', 'end'] as const;
type PositionClass = (typeof POSITION_CLASSES)[number] | null;

function resolvePosition(index: number, total: number): PositionClass {
  if (total === 1) return null;
  if (index === 0) return 'start';
  if (index === total - 1) return 'end';
  return 'middle';
}

function findIndexByValue(buttons: ReadonlyButtons, value: string): number {
  const index = buttons.findIndex((button) => button.value() === value);
  return index === -1 ? 0 : index;
}

function nextKeyboardIndex(key: string, current: number, total: number): number | null {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % total;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + total) % total;
    case 'Home':
      return 0;
    case 'End':
      return total - 1;
    default:
      return null;
  }
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
      const focusedIndex = findIndexByValue(buttons, selected);

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const isSelected = button.value() === selected;
        button.selected.set(isSelected);
        button.disabled.set(disabled);
        button.tabIndex.set(!disabled && i === focusedIndex ? 0 : -1);

        const position = resolvePosition(i, buttons.length);
        const classList = button.elementRef.nativeElement.classList;
        for (const cls of POSITION_CLASSES) classList.toggle(cls, cls === position);
        classList.toggle('selected', isSelected);
        classList.toggle('disabled', disabled);
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

    const currentIndex = findIndexByValue(buttons, this.selected());
    const nextIndex = nextKeyboardIndex(event.key, currentIndex, buttons.length);
    if (nextIndex === null) return;

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
}
