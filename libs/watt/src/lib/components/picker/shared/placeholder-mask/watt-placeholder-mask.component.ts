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
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Maskito, MaskitoOptions } from '@maskito/core';

@Component({
  selector: 'watt-placeholder-mask',
  templateUrl: './watt-placeholder-mask.component.html',
  styleUrls: ['./watt-placeholder-mask.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class WattPlaceholderMaskComponent implements AfterViewInit {
  @Input({ required: true })
  primaryInputElement!: HTMLInputElement;

  @Input()
  secondaryInputElement?: HTMLInputElement;

  @Input({ required: true })
  mask!: MaskitoOptions;

  @Input({ required: true })
  placeholder!: string;

  @Output()
  maskApplied = new EventEmitter<string>();

  maskedInput?: Maskito;
  primaryGhost = '';
  primaryFiller = this.placeholder;
  cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    const primaryMask: MaskitoOptions = {
      ...this.mask,
      preprocessors: [
        ...(this.mask.preprocessors || []),
        (state) => {
          this.primaryGhost = state.elementState.value.slice(0, this.placeholder.length);
          this.primaryFiller = this.placeholder.slice(state.elementState.value.length);
          this.cdr.detectChanges();
          return state;
        },
      ],
      postprocessors: [
        ...(this.mask.postprocessors || []),
        (elementState) => {
          this.maskApplied.emit(elementState.value);
          return elementState;
        },
      ],
    };
    this.maskedInput = new Maskito(this.primaryInputElement, primaryMask);
    //TODO onDestroy/release for maskedInput
  }
}
