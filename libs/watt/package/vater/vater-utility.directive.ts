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
import { Fill, Inset } from './types';

/* eslint-disable @angular-eslint/no-input-rename */
@Directive({
  selector: '[vater]',
  host: {
    '[class]': 'class()',
    '[class.vater-center]': 'center()',
    '[class.vater-scrollable]': 'scrollable()',
  },
})
export class VaterUtilityDirective {
  /** Center the element horizontally and vertically. */
  center = input(false, { transform: booleanAttribute });

  /** Stretch the element to fill the available space in one or both directions. */
  fill = input<Fill>();

  /** Position the element absolute with the provided inset value. */
  inset = input<Inset>();

  /** Make the element scrollable. */
  scrollable = input(false, { transform: booleanAttribute });

  // Computed class names
  protected fillClass = computed(() => this.fill() && `vater-fill-${this.fill()}`);
  protected insetClass = computed(() => this.inset() && `vater-inset-${this.inset()}`);
  protected class = computed(() => [this.fillClass(), this.insetClass()].filter(Boolean));
}
