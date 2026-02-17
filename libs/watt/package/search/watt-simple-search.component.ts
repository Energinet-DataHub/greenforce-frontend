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
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Component, ElementRef, input, viewChild } from '@angular/core';

import { BehaviorSubject, debounceTime, skip } from 'rxjs';

import { WattIconComponent, WattIconSize } from '@energinet/watt/icon';
import { WattFieldComponent } from '@energinet/watt/field';
@Component({
  imports: [WattIconComponent, WattFieldComponent],
  selector: 'watt-simple-search',
  styles: `
    :host {
      height: 44px; /* Magix UX number (replace with variable) */
      min-height: 44px; /* Magix UX number (replace with variable) */
    }

    .clear {
      position: absolute;
      top: 50%;
      right: var(--watt-space-s);
      padding: var(--watt-space-xs);
      border: none;
      border-radius: 4px;
      background: none;
      color: var(--watt-color-primary);
      transform: translateY(-50%);
      cursor: pointer;
      pointer-events: auto;
    }

    .clear:focus-visible {
      outline: 2px solid var(--watt-color-primary);
    }

    input:placeholder-shown ~ .clear {
      display: none;
    }
  `,
  template: `
    <watt-field>
      <watt-icon name="search" [size]="size()" />
      <input
        #input
        type="text"
        role="searchbox"
        [placeholder]="label()"
        (input)="onInput(input.value)"
      />
      <button class="clear" (click)="clear()">
        <watt-icon name="close" [size]="size()" />
      </button>
    </watt-field>
  `,
})
export class WattSimpleSearchComponent {
  input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  label = input<string>('');
  debounceTime = input<number>(300);

  /**
   * If true, trims whitespace from the search value before emitting.
   */
  trim = input(true);
  search$ = new BehaviorSubject<string>('');
  search = outputFromObservable(this.search$.pipe(skip(1), debounceTime(this.debounceTime())));
  size = input<WattIconSize>('s');

  /**
   * Handles input event, optionally trimming the value.
   */
  onInput(value: string): void {
    const processed = this.trim() ? value.trim() : value;
    this.search$.next(processed);
  }

  clear(): void {
    const element = this.input().nativeElement;
    if (element.value === '') return;

    element.value = '';
    this.onInput(element.value);
  }
}
