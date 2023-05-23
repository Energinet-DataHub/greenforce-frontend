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
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  HostBinding,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { WattChipComponent } from '../chip/watt-chip.component';
import { WattIconModule } from '../../foundations/icon/icon.module';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-chip-menu',
  styleUrls: ['./watt-chip-menu.component.scss'],
  templateUrl: './watt-chip-menu.component.html',
  standalone: true,
  imports: [CommonModule, WattChipComponent, WattIconModule],
})
export class WattChipMenuComponent {
  @Input() opened = false;
  @Input() selected = false;
  @Input() @HostBinding('attr.aria-haspopup') hasPopup:
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog' = 'menu';

  @Output() toggle = new EventEmitter<void>();

  @HostBinding('attr.aria-disabled') get ariaExpanded() { return this.opened; }

  toggleMenu() {
    this.toggle.emit();
  }
}
