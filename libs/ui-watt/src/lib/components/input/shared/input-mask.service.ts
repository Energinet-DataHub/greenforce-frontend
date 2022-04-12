import { Injectable, Renderer2 } from "@angular/core";
import Inputmask from 'inputmask';
import { fromEvent, Subject, takeUntil } from "rxjs";

@Injectable()
export class WattInputMaskService {
  private destroy$: Subject<void> = new Subject();

  constructor(private renderer: Renderer2) {}

  mask(
    inputFormat: string,
    placeholder: string,
    element: HTMLInputElement,
    onBeforePaste?: (value: string) => string,
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

    fromEvent(element, 'input').pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setInputColor(element, inputmask);
    });

    return inputmask;
  }

  setInputColor(
    inputElement: HTMLInputElement,
    inputMask: Inputmask.Instance
  ) {
    const emptyMask = inputMask.getemptymask();
    const val = inputElement.value;

    const splittedEmptyMask = emptyMask.split('');
    const splittedVal = val.split('');

    const charWidth = 9;
    const gradient = splittedEmptyMask.map((char, index) => {
      const charHasChanged =
        char !== splittedVal[index] && splittedVal[index] !== undefined;
      const color = charHasChanged
        ? 'var(--watt-color-neutral-black)'
        : 'var(--watt-color-neutral-grey-500)';
      const gradientStart =
        index === 0 ? `${charWidth}px` : `${charWidth * index}px`;
      const gradientEnd =
        index === 0 ? `${charWidth}px` : `${charWidth * (index + 1)}px`;

      if (index === 0) {
        return `${color} ${gradientStart},`;
      } else {
        return `${color} ${gradientStart}, ${color} ${gradientEnd}${
          index !== splittedEmptyMask.length - 1 ? ',' : ''
        }`;
      }
    });

    this.renderer.setStyle(
      inputElement,
      'background-image',
      `linear-gradient(90deg, ${gradient.join('')})`
    );
  }
}
