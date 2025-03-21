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

import { WattIconComponent } from '@energinet/watt/icon';

@Component({
  imports: [WattIconComponent],
  selector: 'watt-search',
  styleUrls: ['./watt-search.component.scss'],
  template: `
    <label>
      <input
        #input
        type="text"
        role="searchbox"
        [placeholder]="label()"
        (input)="search$.next(input.value)"
      />
      <span class="wrapper">
        <span class="button">
          <watt-icon name="search" size="s" aria-hidden="true" />
          <span class="text">{{ label() }}</span>
        </span>
      </span>
      <button class="clear" (click)="clear()">
        <watt-icon name="close" size="s" />
      </button>
    </label>
  `,
})
export class WattSearchComponent {
  /**
   * @ignore
   */
  input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  /**
   * @ignore
   */
  label = input<string>('');

  /**
   * @ignore
   */
  debounceTime = input<number>(300);

  /**
   * @ignore
   */
  search$ = new BehaviorSubject<string>('');

  /**
   * @ignore
   */
  search = outputFromObservable(this.search$.pipe(skip(1), debounceTime(this.debounceTime())));

  /**
   * @ignore
   */
  clear(): void {
    const element = this.input().nativeElement;
    if (element.value === '') return;

    element.value = '';

    this.search$.next(element.value);
  }
}
