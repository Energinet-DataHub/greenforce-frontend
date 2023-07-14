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
import { Component, HostBinding, Input } from '@angular/core';

export type VaterStackDirection = 'row' | 'column';

// TODO: Get these values from design tokens
export type VaterStackGap = 'xs' | 's' | 'm' | 'ml' | 'l' | 'xl';

@Component({
  selector: 'vater-stack',
  standalone: true,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterStackComponent {
  @Input()
  @HostBinding('style.flex-direction')
  direction: VaterStackDirection = 'row';

  @Input() gap: VaterStackGap = 'xs'; // TODO: Default to '0' when design tokens are available
  @HostBinding('style.gap')
  get _gap() {
    return `var(--watt-space-${this.gap})`;
  }
}
