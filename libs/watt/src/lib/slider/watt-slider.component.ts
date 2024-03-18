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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

import { WattColorHelperService, WattColor } from '@energinet-datahub/watt/core/color';

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
  standalone: true,
})
export class WattSliderComponent implements AfterViewInit, OnDestroy, OnChanges {
  private _colorService = inject(WattColorHelperService);
  /** The lowest permitted value. */
  @Input() min = 0;

  /** The highest permitted value. */
  @Input() max = 100;

  /** Step between each value. */
  @Input() step = 1;

  /** The currently selected range value. */
  @Input() value: WattSliderValue = { min: this.min, max: this.max };

  @ViewChild('maxRange') maxRange!: ElementRef<HTMLInputElement>;

  @ViewChild('minRange') minRange!: ElementRef<HTMLInputElement>;

  private _maxChangeSubscription!: Subscription;
  private _minChangeSubscription!: Subscription;
  /**
   * Emits value whenever it changes.
   * @ignore
   */
  @Output() valueChange = new EventEmitter<WattSliderValue>();

  ngAfterViewInit(): void {
    const maxRangeElement = this.maxRange.nativeElement;
    const minRangeElement = this.minRange.nativeElement;
    const maxChanged$ = fromEvent(maxRangeElement, 'input');
    const minChanged$ = fromEvent(minRangeElement, 'input');

    this.updateRange(this.value.min, this.value.max);

    this._maxChangeSubscription = maxChanged$.subscribe((event) => {
      const maxValue = (event.target as HTMLInputElement).valueAsNumber;
      const minValue = minRangeElement.valueAsNumber || this.min;
      this.updateRange(minValue, maxValue);

      if (minValue <= maxValue) {
        maxRangeElement.valueAsNumber = maxValue;
      } else {
        maxRangeElement.valueAsNumber = minValue;
      }

      this.onChange({ min: minValue, max: maxValue });
    });

    this._minChangeSubscription = minChanged$.subscribe((event) => {
      const minValue = (event.target as HTMLInputElement).valueAsNumber;
      const maxValue = maxRangeElement.valueAsNumber || this.max;
      this.updateRange(minValue, maxValue);

      if (minValue > maxValue) {
        minRangeElement.valueAsNumber = maxValue;
      }

      this.onChange({ min: minValue, max: maxValue });
    });
  }

  isElementRefsPopulated(): boolean {
    return !!this.maxRange && !!this.minRange;
  }

  ngOnChanges(): void {
    if (this.isElementRefsPopulated()) {
      this.updateRange(this.value.min, this.value.max);
    }
  }

  ngOnDestroy(): void {
    this._maxChangeSubscription.unsubscribe();
    this._minChangeSubscription.unsubscribe();
  }

  private updateRange(minValue: number, maxValue: number) {
    const rangeDistance = this.max - this.min;
    const fromPosition = minValue - this.min;
    const toPosition = maxValue - this.min;

    const sliderColor = this._colorService.getColor(WattColor.secondaryLight);
    const rangeColor = this._colorService.getColor(WattColor.primary);

    this.maxRange.nativeElement.valueAsNumber = this.value.max;
    this.minRange.nativeElement.valueAsNumber = this.value.min;
    this.maxRange.nativeElement.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
      ${sliderColor} 100%)`;
  }

  /**
   * Change handler for updating value.
   * @ignore
   */
  onChange(value: WattSliderValue) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
