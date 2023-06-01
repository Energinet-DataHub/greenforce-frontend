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
import { CommonModule } from '@angular/common';

import { WattIconComponent } from '../../foundations/icon/icon.component';
import { WattChipComponent } from './watt-chip.component';

export type WattMenuChipRole = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

@Component({
  standalone: true,
  imports: [CommonModule, WattChipComponent, WattIconComponent],
  selector: 'watt-menu-chip',
  styles: [
    `
      :host {
        display: block;
      }

      button {
        all: unset;
        pointer-events: none;
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
    <watt-chip [disabled]="disabled" [selected]="selected">
      <button
        [attr.aria-haspopup]="role"
        [attr.aria-expanded]="opened"
        (click)="toggle.emit()"
        [disabled]="disabled"
      >
        <ng-content />
      </button>
      <watt-icon
        size="s"
        name="arrowDropDown"
        class="menu-icon"
        [class.opened]="opened"
        [class.selected]="selected"
        [class.disabled]="disabled"
      />
    </watt-chip>
  `,
})
export class WattMenuChipComponent {
  @Input() opened = false;
  @Input() disabled = false;
  @Input() name?: string;
  @Input() value?: string;
  @Input() selected = false;
  @Input() role: WattMenuChipRole = 'menu';
  @Output() toggle = new EventEmitter<void>();
}
