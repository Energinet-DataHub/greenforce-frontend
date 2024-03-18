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

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattChipComponent } from './watt-chip.component';
import { useIsFirstRender } from '@energinet-datahub/watt/utils/lifecycle';

@Component({
  standalone: true,
  imports: [WattChipComponent, WattIconComponent],
  selector: 'watt-filter-chip',
  template: `
    <watt-chip [disabled]="disabled" [selected]="isFirstRender() ? selected : input.checked">
      <input
        #input
        class="cdk-visually-hidden"
        [type]="choice === undefined ? 'checkbox' : 'radio'"
        [name]="name"
        [value]="value"
        [checked]="selected"
        [disabled]="disabled"
        (change)="selectionChange.emit(input)"
      />
      <ng-content />
    </watt-chip>
  `,
})
export class WattFilterChipComponent {
  @Input() selected = false;
  @Input() disabled = false;
  @Input() name?: string;
  @Input() value?: string;
  @Input() choice?: string;
  @Output() selectionChange = new EventEmitter<HTMLInputElement>();
  isFirstRender = useIsFirstRender();
}
