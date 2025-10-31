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
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
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
  readonly min = input(0);

  /** The highest permitted value. */
  readonly max = input(100);

  /** Step between each value. */
  readonly step = input(1);

  /** The currently selected range value. */
  readonly value = input<WattSliderValue>({ min: 0, max: 100 });

  readonly maxRange = viewChild<ElementRef<HTMLInputElement>>('maxRange');
  readonly minRange = viewChild<ElementRef<HTMLInputElement>>('minRange');

  readonly valueChange = output<WattSliderValue>();

  constructor() {
    effect(() => {
      const currentValue = this.value();
      const maxRange = this.maxRange();
      const minRange = this.minRange();

      if (!maxRange || !minRange) return;

      this.updateRange(currentValue.min, currentValue.max);
    });

    effect(() => {
      const maxRange = this.maxRange();
      const minRange = this.minRange();

      if (!maxRange || !minRange) return;

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

    const sliderColor = this.colorService.getColor('secondaryLight');
    const rangeColor = this.colorService.getColor('primary');

    maxRangeElement.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
      ${sliderColor} 100%)`;
  }
}
