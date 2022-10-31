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
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { WattIcon } from '../../foundations/icon';
import { WattIconSize } from '../../foundations/icon/watt-icon-size';

/**
 * Usage:
 * `import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';`
 */
@Component({
  selector: 'watt-empty-state',
  styleUrls: ['./empty-state.component.scss'],
  templateUrl: './empty-state.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class WattEmptyStateComponent {
  @Input() icon?: WattIcon;
  @Input() size: 'small' | 'large' = 'large';
  @Input() title = '';
  @Input() message = '';

  @HostBinding('class') get currentSize(): string[] {
    return [`empty-state-${this.size}`];
  }

  get iconSize(): WattIconSize {
    if (this.size === 'small') {
      return 'xl';
    }

    return 'xxl';
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }
}
