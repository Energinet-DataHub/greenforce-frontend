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
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { Align, Direction, Justify } from './types';

@Directive({
  host: {
    '[class]': 'class()',
    '[class.vater-wrap]': 'wrap()',
    '[attr.align]': 'null',
    '[attr.direction]': 'null',
    '[attr.justify]': 'null',
    '[attr.wrap]': 'null',
  },
})
export class VaterFlexboxDirective {
  /** Cross axis alignment of the flex items. */
  align = input<Align>();

  /** Direction of the flex items. Defaults to `column`. */
  direction = input<Direction>('column');

  /** Main axis alignment of the flex items. */
  justify = input<Justify>();

  /** Whether the flex items should wrap. */
  wrap = input(false, { transform: booleanAttribute });

  // Computed class names
  protected alignClass = computed(() => this.align() && `vater-align-${this.align()}`);
  protected directionClass = computed(() => this.direction() && `vater-${this.direction()}`);
  protected justifyClass = computed(() => this.justify() && `vater-justify-${this.justify()}`);
  protected class = computed(() =>
    [this.alignClass(), this.directionClass(), this.justifyClass()].filter(Boolean)
  );
}
