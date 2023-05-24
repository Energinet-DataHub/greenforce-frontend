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
import { CommonModule } from '@angular/common';

import { WattIconModule } from '../../foundations/icon/icon.module';
import { WattChipComponent } from './watt-chip.component';

@Component({
  standalone: true,
  imports: [CommonModule, WattChipComponent, WattIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-filter-chip',
  template: `
    <watt-chip [disabled]="disabled" [selected]="checkbox.checked">
      <input
        #checkbox
        type="checkbox"
        [disabled]="disabled"
        [name]="name"
        [value]="value"
        class="cdk-visually-hidden"
      />
      <ng-content />
    </watt-chip>
  `,
})
export class WattFilterChipComponent {
  @Input() disabled = false;
  @Input() name?: string;
  @Input() value?: string;
}
