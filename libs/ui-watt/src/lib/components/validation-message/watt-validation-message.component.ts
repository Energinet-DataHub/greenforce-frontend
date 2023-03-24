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

export type WattValidationMessageType = 'info' | 'warning' | 'success' | 'danger';

/**
 * Usage:
 * `import { WattValidationMessageModule } from '@energinet-datahub/watt/validation-message';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-validation-message',
  styleUrls: ['./watt-validation-message.component.scss'],
  templateUrl: './watt-validation-message.component.html',
})
export class WattValidationMessageComponent {
  @Input() label = '';
  @Input() message = '';
  @Input() type: WattValidationMessageType = 'info';

  /**
   * @ignore
   */
  @HostBinding('class') get cssClass() {
    return `watt-validation-message--${this.type}`;
  }
}
