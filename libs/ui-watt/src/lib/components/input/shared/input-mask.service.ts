import { Injectable, Renderer2 } from '@angular/core';
import Inputmask from 'inputmask';
import { fromEvent, Subject, takeUntil } from 'rxjs';

import { WattColorHelperService } from '../../../foundations/color/color-helper.service';
import { WattColor } from '../../../foundations/color/colors';

@Injectable()
export class WattInputMaskService {
  private destroy$: Subject<void> = new Subject();

  constructor(
    private renderer: Renderer2,
    private wattColorService: WattColorHelperService
  ) {}

  mask(
    inputFormat: string,
    placeholder: string,
    element: HTMLInputElement,
    onBeforePaste?: (value: string) => string
  ): Inputmask.Instance {
    const inputmask: Inputmask.Instance = new Inputmask('datetime', {
      inputFormat,
      placeholder,
      insertMode: false,
      insertModeVisual: true,
      clearMaskOnLostFocus: false,
      onBeforePaste,
      onincomplete: () => {
        this.setInputColor(element, inputmask);
      },
      clearIncomplete: true,
    }).mask(element);

    this.setInputColor(element, inputmask);

    fromEvent(element, 'input')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setInputColor(element, inputmask);
      });

    return inputmask;
  }

  setInputColor(inputElement: HTMLInputElement, inputMask: Inputmask.Instance) {
    const emptyMask = inputMask.getemptymask();
    const inputValue = inputElement.value;

    const gradient = this.buildGradient(emptyMask, inputValue);

    this.renderer.setStyle(
      inputElement,
      'background-image',
      `linear-gradient(90deg, ${gradient})`
    );
  }

  private buildGradient(emptyMask: string, inputValue: string): string {
    const splittedEmptyMask = emptyMask.split('');
    const splittedValue = inputValue.split('');

    // Note: The number 9 is based on experimenting with different values
    // but it is influenced by the monospace font set on the component
    const charWidth = 9;

    const gradientParts = splittedEmptyMask.map((char, index) => {
      const charHasChanged =
        char !== splittedValue[index] && splittedValue[index] !== undefined;

      const color = charHasChanged
        ? this.wattColorService.getColor(WattColor.black)
        : this.wattColorService.getColor(WattColor.grey500);

      const gradientStart =
        index === 0 ? `${charWidth}px` : `${charWidth * index}px`;
      const gradientEnd =
        index === 0 ? `${charWidth}px` : `${charWidth * (index + 1)}px`;

      if (index === 0) {
        return `${color} ${gradientStart}`;
      }

      return `${color} ${gradientStart}, ${color} ${gradientEnd}`;
    });

    return gradientParts.join(',');
  }
}
