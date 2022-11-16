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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WattIcon, WattIconModule } from '@energinet-datahub/watt/icon';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-identity-text-field-with-icon',
  template: ` <span
      *ngIf="iconName"
      ngClass="watt-space-inline-xs"
      [ngStyle]="{ display: 'inline-flex' }"
    >
      <watt-icon
        [name]="iconName"
        [label]="iconName"
        size="s"
        aria-hidden
      ></watt-icon>
    </span>

    <span>{{ text }}</span>`,
  imports: [CommonModule, WattIconModule],
})
export class DhMeteringPointIdentityTextFieldWithIconComponent {
  @Input() iconName?: WattIcon;
  @Input() text = '';
}
