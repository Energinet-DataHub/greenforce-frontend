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
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { WattIcon } from '../../foundations/icon/icons';
import { WattIconComponent } from '../../foundations/icon/icon.component';
import { CommonModule } from '@angular/common';

export type WattValidationMessageType = 'info' | 'warning' | 'success' | 'danger';
export type WattValidationMessageSize = 'compact' | 'normal';
/**
 * Usage:
 * `import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-validation-message',
  styleUrls: ['./watt-validation-message.component.scss'],
  templateUrl: './watt-validation-message.component.html',
  standalone: true,
  imports: [CommonModule, WattIconComponent],
})
export class WattValidationMessageComponent {
  @Input() label = '';
  @Input() message = '';
  @Input() icon?: WattIcon;
  @Input() type: WattValidationMessageType = 'info';
  @Input() size: WattValidationMessageSize = 'compact';

  /**
   * @ignore
   */
  @HostBinding('class') get cssClass() {
    return `watt-validation-message-type--${this.type} watt-validation-message-size--${this.size}`;
  }

  @HostBinding('attr.role') get ariaRole() {
    return this.type === 'warning' || this.type === 'danger' ? 'alert' : 'status';
  }
}
