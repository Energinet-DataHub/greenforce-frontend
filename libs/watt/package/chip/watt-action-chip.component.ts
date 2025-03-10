//#region License
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
//#endregion
import { Component, input, output } from '@angular/core';

import { WattIcon, WattIconComponent } from '../icon';
import { WattChipComponent } from './watt-chip.component';

@Component({
  imports: [WattChipComponent, WattIconComponent],
  selector: 'watt-action-chip',
  styles: [
    `
      :host {
        display: block;
      }

      .disabled {
        color: var(--watt-on-light-low-emphasis);
      }
    `,
  ],
  template: `
    <watt-chip [disabled]="disabled()">
      <button
        type="button"
        class="cdk-visually-hidden"
        (click)="$event.stopImmediatePropagation(); action.emit()"
        [disabled]="disabled()"
      ></button>
      <ng-content />
      <watt-icon
        size="s"
        [name]="icon()"
        class="menu-icon"
        [attr.aria-hidden]="true"
        [class.disabled]="disabled()"
      />
    </watt-chip>
  `,
})
export class WattActionChipComponent {
  disabled = input(false);
  icon = input.required<WattIcon>();
  action = output<void>();
}
