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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

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
  /** The lowest permitted value. */
  @Input() min = 0;

  /** The highest permitted value. */
  @Input() max = 100;

  /** Step between each value. */
  @Input() step = 1;

  /** Manually define all steps. Overrules `min`, `max` and `step`. */
  @Input() customSteps?: number[];

  /** The currently selected range value. */
  @Input() value: WattSliderValue = { min: this.min, max: this.max };

  /**
   * Emits value whenever it changes.
   * @ignore
   */
  @Output() valueChange = new EventEmitter<WattSliderValue>();

  /**
   * @ignore
   */
  get options(): Options {
    return {
      floor: this.min,
      ceil: this.max,
      minRange: 1,
      hideLimitLabels: true,
      hidePointerLabels: true,
      enforceStep: false,
      enforceStepsArray: false,
      step: this.step,
      stepsArray: this.customSteps?.map((value) => ({ value })),
    };
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
