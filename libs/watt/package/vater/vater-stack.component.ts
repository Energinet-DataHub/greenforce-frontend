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
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

import { Align, Direction, Spacing, Justify } from './types';
import { VaterUtilityDirective } from './vater-utility.directive';

@Component({
  selector: 'vater-stack, [vater-stack]',
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: VaterUtilityDirective,
      inputs: ['fill'],
    },
  ],
  styles: [
    `
      vater-stack,
      [vater-stack] {
        display: flex;
        line-height: normal;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterStackComponent {
  @Input()
  @HostBinding('style.align-items')
  align: Align = 'center';

  @Input()
  @HostBinding('style.flex-direction')
  direction: Direction = 'column';

  @Input()
  gap?: Spacing;

  @Input()
  @HostBinding('style.justify-content')
  justify?: Justify;

  @Input()
  offset?: Spacing;

  @HostBinding('style.padding')
  get _offset() {
    if (!this.offset) return undefined;
    switch (this.direction) {
      case 'column':
        return `var(--watt-space-${this.offset}) 0`;
      case 'row':
        return `0 var(--watt-space-${this.offset})`;
    }
  }

  @HostBinding('style.gap')
  get _gap() {
    return this.gap ? `var(--watt-space-${this.gap})` : undefined;
  }
}
