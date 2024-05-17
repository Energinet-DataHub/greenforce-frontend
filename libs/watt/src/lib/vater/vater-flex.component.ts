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
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { Direction, Gap, Justify } from './types';
import { VaterUtilityDirective } from './vater-utility.directive';

@Component({
  selector: 'vater-flex, [vater-flex]',
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: VaterUtilityDirective,
      inputs: ['fill'],
    },
  ],
  standalone: true,
  styles: [
    `
      vater-flex,
      [vater-flex] {
        display: flex;
        line-height: normal;
      }

      vater-flex > *,
      [vater-flex] > * {
        flex: 1 1 auto;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterFlexComponent {
  @Input()
  @HostBinding('style.flex-direction')
  direction: Direction = 'column';

  @Input()
  gap?: Gap;

  @Input()
  @HostBinding('style.justify-content')
  justify?: Justify;

  @Input()
  scrollable?: string;

  @HostBinding('style.gap')
  get _gap() {
    return this.gap ? `var(--watt-space-${this.gap})` : undefined;
  }

  @HostBinding('style.overflow')
  get _overflow() {
    return this.scrollable === '' ? 'auto' : undefined;
  }
}
