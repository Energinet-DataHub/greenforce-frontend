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

import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WattIconModule } from '../../foundations/icon/icon.module';
import { WattChipComponent } from './watt-chip.component';

@Component({
  standalone: true,
  imports: [CommonModule, WattChipComponent, WattIconModule],
  selector: 'watt-menu-chip',
  styles: [
    `
      :host {
        display: block;
      }

      watt-chip[ng-reflect-disabled="true"] .menu-icon {
        color: var(--watt-on-light-low-emphasis);
      }

      button {
        all: unset;
      }

      .menu-icon {
        margin-left: var(--watt-space-xs);
        transition: linear 0.2s all;
        color: var(--watt-color-primary);
      }

      .opened {
        transform: rotate(180deg);
      }

      .selected {
        color: var(--watt-color-neutral-white);
      }
    `,
  ],
  template: `
    <watt-chip [disabled]="disabled" [selected]="selected">
      <button (click)="toggleMenu()" [disabled]="disabled">
        <ng-content />
      </button>
      <watt-icon
        size="s"
        name="arrowDropDown"
        class="menu-icon"
        [class.opened]="opened"
        [class.selected]="selected"
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
  @Input() @HostBinding('attr.aria-haspopup') hasPopup:
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog' = 'menu';

  @Output() toggle = new EventEmitter<void>();

  @HostBinding('attr.aria-expanded') get ariaExpanded() {
    return this.opened;
  }

  toggleMenu() {
    this.toggle.emit();
  }
}
