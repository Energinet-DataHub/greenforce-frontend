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
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { WattIconModule } from '../../foundations/icon/icon.module';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-chip',
  styleUrls: ['./watt-chip.component.scss'],
  templateUrl: './watt-chip.component.html',
  standalone: true,
  imports: [CommonModule, WattIconModule],
})
export class WattChipComponent {
  @Input() selected = false;
  @Input() disabled = false;
  @Input() @HostBinding('attr.aria-label') ariaLabel?: string;
  @Input() @HostBinding('attr.role') role = 'checkbox';
  @Output() selectionChange = new EventEmitter<boolean>();

  @HostBinding('attr.tabindex') get tabindex() {
    return this.disabled ? -1 : 0;
  }
  @HostBinding('attr.aria-disabled') get ariaDisabled() {
    return this.disabled;
  }
  @HostBinding('attr.aria-checked') get ariaChecked() {
    return this.selected;
  }
  @HostBinding('class') get className() {
    return this.selected ? 'watt-chip watt-chip--selected' : 'watt-chip';
  }

  @HostListener('click')
  onClick() {
    if (this.disabled) return;
    this.selected = !this.selected;
    this.selectionChange.emit(this.selected);
  }
}
