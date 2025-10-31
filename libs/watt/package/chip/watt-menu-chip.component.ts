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

import { WattIconComponent } from '@energinet/watt/icon';
import { WattChipComponent } from './watt-chip.component';

export type WattMenuChipHasPopup = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

@Component({
  imports: [WattChipComponent, WattIconComponent],
  selector: 'watt-menu-chip',
  styles: [
    `
      :host {
        display: block;
      }

      .menu-icon {
        margin-left: var(--watt-space-xs);
        transition: linear 0.2s all;
        color: var(--watt-color-primary);

        &.disabled {
          color: var(--watt-on-light-low-emphasis);
        }
      }

      .opened {
        transform: rotate(180deg);
      }

      .selected {
        color: var(--watt-color-neutral-white);
      }

      .disabled {
        color: var(--watt-on-light-low-emphasis);
      }
    `,
  ],
  template: `
    <watt-chip [disabled]="disabled()" [selected]="selected()">
      <button
        class="cdk-visually-hidden"
        [attr.aria-haspopup]="hasPopup()"
        [attr.aria-expanded]="opened()"
        [attr.aria-pressed]="selected()"
        (click)="toggleChange.emit()"
        [disabled]="disabled()"
      ></button>
      <ng-content />
      <watt-icon
        size="s"
        name="arrowDropDown"
        class="menu-icon"
        [attr.aria-hidden]="true"
        [class.opened]="opened()"
        [class.selected]="selected()"
        [class.disabled]="disabled()"
      />
    </watt-chip>
  `,
})
export class WattMenuChipComponent {
  opened = input(false);
  disabled = input(false);
  name = input<string | undefined>(undefined);
  value = input<string | undefined>(undefined);
  selected = input(false);
  hasPopup = input<WattMenuChipHasPopup>('menu');
  toggleChange = output<void>();
}
