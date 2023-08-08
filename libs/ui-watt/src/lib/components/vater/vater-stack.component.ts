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
import { Direction, Gap } from './types';

@Component({
  selector: 'vater-stack, [vater-stack]',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  styles: [
    `
      vater-stack,
      [vater-stack] {
        display: flex;
        height: auto;
        align-items: center;
      }

      vater-stack > *,
      [vater-stack] > * {
        display: block;
        flex: 0 0 auto;
        line-height: normal;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterStackComponent {
  @Input()
  @HostBinding('style.flex-direction')
  direction: Direction = 'column';

  @Input() gap: Gap = 'xs'; // TODO: Default to '0' when design tokens are available
  @HostBinding('style.gap')
  get _gap() {
    return `var(--watt-space-${this.gap})`;
  }
}
