/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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

export type WattIconSize =
  | 'XSmall'
  | 'Small'
  | 'Medium'
  | 'Large'
  | 'XLarge'
  | 'XXLarge';

@Component({
  selector: 'watt-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WattIconComponent implements OnChanges {
  @Input() name!: WattIcon;
  /**
   * @description used for `aria-label`
   */
  @Input() label!: string;
  @Input() size: WattIconSize = 'Medium';

  @HostBinding('class') get currentSize(): string[] {
    return [`icon-${this.size}`];
  }

  /**
   * @ignore
   */
  icon!: string;
  /**
   * @ignore
   */
  customIcon!: string;

  constructor(private iconRegistry: WattIconService) {}

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
    if (!name) return;
    const iconName = this.iconRegistry.getIconName(name);
    this.iconRegistry.isCustomIcon(name)
      ? (this.customIcon = iconName)
      : (this.icon = iconName);
  }
}
