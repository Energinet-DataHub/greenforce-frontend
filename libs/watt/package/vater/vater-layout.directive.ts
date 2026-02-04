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
import { computed, Directive, input } from '@angular/core';
import { Align, Justify, Spacing } from './types';

@Directive({
  host: {
    '[class]': 'class()',
    '[attr.gap]': 'null',
    '[attr.offset]': 'null',
    '[attr.justify]': 'null',
    '[attr.align]': 'null',
  },
})
export class VaterLayoutDirective {
  /** Spacing between items. */
  gap = input<Spacing | 'dividers'>();

  /** Offset to apply along the main axis (or both axes for grids). */
  offset = input<Spacing>();

  /** Main axis alignment of the child items. */
  justify = input<Justify>();

  /** Cross axis alignment of the flex items. */
  align = input<Align>();

  // Computed class names
  protected gapClass = computed(() => this.gap() && `vater-gap-${this.gap()}`);
  protected offsetClass = computed(() => this.offset() && `vater-offset-${this.offset()}`);
  protected justifyClass = computed(() => this.justify() && `vater-justify-${this.justify()}`);
  protected alignClass = computed(() => this.align() && `vater-align-${this.align()}`);
  protected class = computed(() =>
    [this.gapClass(), this.offsetClass(), this.justifyClass(), this.alignClass()].filter(Boolean)
  );
}
