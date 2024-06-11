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
import { Component, computed, input } from '@angular/core';

export type WattBadgeType = 'warning' | 'success' | 'danger' | 'info' | 'neutral' | 'skeleton';

export type WattBadgeSize = 'normal' | 'large';

/**
 * Usage:
 * `import { WattBadgeComponent } from '@energinet-datahub/watt/badge';`
 */
@Component({
  standalone: true,
  selector: 'watt-badge',
  styleUrls: ['./watt-badge.component.scss'],
  template: '<ng-content />',
  host: {
    '[class]': 'badgeType()',
    '[class.watt-badge-large]': 'isLarge()',
  },
})
export class WattBadgeComponent {
  type = input<WattBadgeType>('info');
  size = input<WattBadgeSize>('normal');
  badgeType = computed(() => `watt-badge-${this.type()}`);
  isLarge = computed(() => this.size() === 'large');
}
