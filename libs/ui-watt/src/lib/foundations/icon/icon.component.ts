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
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { WattIcon } from './icons';
import { WattIconService } from './icon.service';
import { WattIconSize } from './watt-icon-size';
import { WattIconState } from './watt-icon-state';

@Component({
  selector: 'watt-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WattIconComponent {
  @Input() set name(value: WattIcon | undefined) {
    this.setIcon(value);

    this.state = this.getDefaultStateForIcon(value);
  }

  /**
   * @description used for `aria-label`
   */
  @Input() label: string | null = null;
  @Input() size: WattIconSize = 'm';
  @Input() state: WattIconState = 'default';

  @HostBinding('class') get _cssClass(): string[] {
    return [`icon-size-${this.size}`, `icon-state-${this.state}`];
  }

  /**
   * @ignore
   */
  icon: string | null = null;
  /**
   * @ignore
   */
  customIcon = '';

  constructor(private iconService: WattIconService) {}

  /**
   * @ignore
   * @param name
   * @returns
   */
  private setIcon(name?: WattIcon) {
    if (!name) {
      console.warn('No icon was provided!');
      return;
    }

    const iconName = this.iconService.getIconName(name);

    this.iconService.isCustomIcon(name)
      ? (this.customIcon = iconName)
      : (this.icon = iconName);
  }

  /**
   * @ignore
   * @param name
   * @returns
   */
  private getDefaultStateForIcon(name?: WattIcon): WattIconState {
    switch (name) {
      case 'success':
      case 'danger':
      case 'warning':
      case 'info':
        return name;
      default:
        return 'default';
    }
  }
}
