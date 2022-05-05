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
import { Injectable, Renderer2 } from '@angular/core';
import Inputmask from 'inputmask';
import { distinctUntilChanged, fromEvent, map, Observable, startWith, tap } from 'rxjs';

import { WattColor } from '../../../foundations/color/colors';

export interface WattMaskedInput {
  inputMask: Inputmask.Instance;
  onChange$: Observable<string>;
}

@Injectable()
export class WattInputMaskService {
  constructor(private renderer: Renderer2) {}

  mask(
    initialValue = '',
    inputFormat: string,
    placeholder: string,
    element: HTMLInputElement,
    onBeforePaste?: (value: string) => string
  ): WattMaskedInput {
    const inputMask: Inputmask.Instance = new Inputmask('datetime', {
      inputFormat,
      placeholder,
      insertMode: false,
      insertModeVisual: true,
      clearMaskOnLostFocus: false,
      onBeforePaste,
      onincomplete: () => {
        this.setInputColor(element, inputMask);
      },
      clearIncomplete: true,
    }).mask(element);

    this.setInputColor(element, inputMask);

    const onChange$ = fromEvent<InputEvent>(element, 'input').pipe(
      tap((event: InputEvent) => {
        this.setInputColor(event.target as HTMLInputElement, inputMask);
      }),
      map((event: InputEvent) => (event.target as HTMLInputElement).value),
      startWith(initialValue || ''),
      map((value) => (inputMask.isComplete() ? value : '')),
      distinctUntilChanged(),
    );

    return {inputMask, onChange$};
  }

  setInputColor(inputElement: HTMLInputElement, inputMask: Inputmask.Instance) {
    const emptyMask = inputMask.getemptymask();
    const inputValue = inputElement.value;


    const paddingLeft = parseInt(getComputedStyle(inputElement).getPropertyValue('padding-left'));
    const gradient = this.buildGradient(emptyMask, inputValue, paddingLeft);

    this.renderer.setStyle(
      inputElement,
      'background-image',
      `linear-gradient(90deg, ${gradient})`
    );
  }

  private buildGradient(emptyMask: string, inputValue: string, paddingLeft: number): string {
    const splittedEmptyMask = emptyMask.split('');
    const splittedValue = inputValue.split('');

    // Note: The number 9 is based on experimenting with different values
    // but it is influenced by the monospace font set on the component
    const charWidth = 8;

    const gradientParts = splittedEmptyMask.map((char, index) => {
      const charHasChanged =
        char !== splittedValue[index] && splittedValue[index] !== undefined;

      const color = charHasChanged ? WattColor.black : WattColor.grey500;

      const gradientStart =
        index === 0 ? `${charWidth + paddingLeft}px` : `${(charWidth * index) + paddingLeft}px`;
      const gradientEnd =
        index === 0 ? `${charWidth + paddingLeft}px` : `${(charWidth * (index + 1)) + paddingLeft}px`;

      if (index === 0) {
        return `var(${color}) ${gradientStart}`;
      }

      return `var(${color}) ${gradientStart}, var(${color}) ${gradientEnd}`;
    });

    return gradientParts.join(',');
  }
}
