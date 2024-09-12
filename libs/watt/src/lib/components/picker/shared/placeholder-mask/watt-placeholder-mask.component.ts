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
import {
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { Maskito, MaskitoOptions } from '@maskito/core';

@Component({
  selector: 'watt-placeholder-mask',
  templateUrl: './watt-placeholder-mask.component.html',
  styleUrls: ['./watt-placeholder-mask.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class WattPlaceholderMaskComponent {
  cdr = inject(ChangeDetectorRef);
  primaryInputElement = input.required<HTMLInputElement>();
  secondaryInputElement = input<HTMLInputElement>();
  mask = input.required<MaskitoOptions>();
  placeholder = input.required<string>();
  maskApplied = output<string>();
  maskedInput = signal<Maskito | null>(null);
  primaryGhost = signal('');
  primaryFiller = signal<string | null>(null);

  maskEffect = effect(
    (onCleanup) => {
      const mask = this.mask();
      const placeholder = this.placeholder();
      const primaryMask: MaskitoOptions = {
        ...mask,
        preprocessors: [
          ...(mask.preprocessors ?? []),
          (state) => {
            this.primaryGhost.set(state.elementState.value.slice(0, placeholder.length));
            this.primaryFiller.set(placeholder.slice(state.elementState.value.length));
            return state;
          },
        ],
        postprocessors: [
          (elementState) => {
            this.maskApplied.emit(elementState.value);
            return elementState;
          },
          ...(mask.postprocessors ?? []),
        ],
      };

      const maskedInput = new Maskito(this.primaryInputElement(), primaryMask);
      this.maskedInput.set(maskedInput);

      onCleanup(() => {
        maskedInput.destroy();
        this.maskedInput.set(null);
      });
    },
    { allowSignalWrites: true }
  );

  inputEffect = effect(() => {
    const primaryInputElement = this.primaryInputElement();
    untracked(() => primaryInputElement.dispatchEvent(new InputEvent('input')));
  });
}
