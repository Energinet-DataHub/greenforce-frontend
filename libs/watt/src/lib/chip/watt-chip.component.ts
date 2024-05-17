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

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WattIconComponent } from '@energinet-datahub/watt/icon';

@Component({
  standalone: true,
  imports: [WattIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-chip',
  styleUrls: ['./watt-chip.component.scss'],
  template: `
    <label [class.selected]="selected" [class.disabled]="disabled">
      @if (selected) {
        <watt-icon class="selected-icon" name="checkmark" size="s" [attr.aria-hidden]="true" />
      }
      <ng-content />
    </label>
  `,
})
export class WattChipComponent {
  @Input() selected = false;
  @Input() disabled = false;
}
