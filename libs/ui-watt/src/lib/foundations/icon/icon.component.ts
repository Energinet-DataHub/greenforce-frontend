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
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

import { WattIconService } from './icon.service';
import { WattIcon } from './icons';
import { WattIconSize } from './watt-icon-size';
import { WattIconState } from './watt-icon-state';

@Component({
  selector: 'watt-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WattIconComponent implements OnChanges {
  @Input() name?: WattIcon;

  /**
   * @description used for `aria-label`
   */
  @Input() label: string | null = null;
  @Input() size: WattIconSize = WattIconSize.Medium;
  @Input() state?: WattIconState;

  @HostBinding('class') get _cssClass(): string[] {
    const classesToAdd = [`icon-size-${this.size}`];

    if (this.state) {
      classesToAdd.push(`icon-state-${this.state}`);
    }

    return classesToAdd;
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
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.setIcon(changes.name?.currentValue);
  }

  /**
   * @ignore
   * @param name
   * @returns
   */
  private setIcon(name: WattIcon) {
    if (!name) {
      console.warn('No icon was provided!');
      return;
    }

    const iconName = this.iconService.getIconName(name);

    this.iconService.isCustomIcon(name)
      ? (this.customIcon = iconName)
      : (this.icon = iconName);
  }
}
