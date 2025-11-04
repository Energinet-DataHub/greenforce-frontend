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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattColorHelperService } from '@energinet/watt/core/color';

export interface WattSliderValue {
  min: number;
  max: number;
}

/**
 * Slider for providing a range of values.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-slider',
  styleUrls: ['./watt-slider.component.scss'],
  templateUrl: './watt-slider.component.html',
})
export class WattSliderComponent {
  private readonly colorService = inject(WattColorHelperService);
  private readonly destroyRef = inject(DestroyRef);

  /** The lowest permitted value. */
  readonly min = input.required<number>();

  /** The highest permitted value. */
  readonly max = input.required<number>();

  /** Step between each value. */
  readonly step = input(1);

  /** The currently selected range value. */
  readonly value = input<WattSliderValue | undefined>();
  readonly currentValue = computed(() => {
    const inputValue = this.value();
    if (!inputValue) {
      return { min: this.min(), max: this.max() };
    }
    return inputValue;
  });

  readonly maxRange = viewChild.required<ElementRef<HTMLInputElement>>('maxRange');
  readonly minRange = viewChild.required<ElementRef<HTMLInputElement>>('minRange');

  readonly valueChange = output<WattSliderValue>();

  readonly sliderColor = this.colorService.getColor('secondaryLight');
  readonly rangeColor = this.colorService.getColor('primary');

  constructor() {
    effect(() => {
      const value = this.currentValue();
      this.updateRange(value.min, value.max);
    });

    effect(() => {
      const maxRange = this.maxRange();
      const minRange = this.minRange();

      const maxRangeElement = maxRange.nativeElement;
      const minRangeElement = minRange.nativeElement;

      // Setup max range input events
      fromEvent(maxRangeElement, 'input')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          const maxValue = (event.target as HTMLInputElement).valueAsNumber;
          const minValue = minRangeElement.valueAsNumber;

          let newMaxValue = maxValue;
          if (minValue > maxValue) {
            newMaxValue = minValue;
            maxRangeElement.valueAsNumber = newMaxValue;
          }

          const newValue = { min: minValue, max: newMaxValue };
          this.updateRange(newValue.min, newValue.max);
          this.valueChange.emit(newValue);
        });

      // Setup min range input events
      fromEvent(minRangeElement, 'input')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          const minValue = (event.target as HTMLInputElement).valueAsNumber;
          const maxValue = maxRangeElement.valueAsNumber;

          let newMinValue = minValue;
          if (minValue > maxValue) {
            newMinValue = maxValue;
            minRangeElement.valueAsNumber = newMinValue;
          }

          const newValue = { min: newMinValue, max: maxValue };
          this.updateRange(newValue.min, newValue.max);
          this.valueChange.emit(newValue);
        });
    });
  }

  private updateRange(minValue: number, maxValue: number) {
    const maxRange = this.maxRange();
    const minRange = this.minRange();
    if (!maxRange || !minRange) return;

    const maxRangeElement = maxRange.nativeElement;
    const minRangeElement = minRange.nativeElement;

    maxRangeElement.valueAsNumber = maxValue;
    minRangeElement.valueAsNumber = minValue;

    const rangeDistance = this.max() - this.min();
    const fromPosition = minValue - this.min();
    const toPosition = maxValue - this.min();

    maxRangeElement.style.background = `linear-gradient(
      to right,
      ${this.sliderColor} 0%,
      ${this.sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${this.rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${this.rangeColor} ${(toPosition / rangeDistance) * 100}%,
      ${this.sliderColor} ${(toPosition / rangeDistance) * 100}%,
      ${this.sliderColor} 100%)`;
  }
}
