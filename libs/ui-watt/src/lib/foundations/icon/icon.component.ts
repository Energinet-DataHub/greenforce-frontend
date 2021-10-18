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
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { WattColors } from '@energinet-datahub/watt';
import { WattIconService } from './icon.service';
import { WattIcon } from './icons';

@Component({
  selector: 'watt-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WattIconComponent implements OnChanges {
  @Input() name!: WattIcon;
  @Input() label!: string;
  @Input() color: WattColors = WattColors.primary;

  icon!: string;
  customIcon!: string;

  constructor(private iconRegistry: WattIconService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.setIcon(changes.name?.currentValue);
  }

  private setIcon(name: WattIcon) {
    if (!name) return;
    const iconName = this.iconRegistry.getIconName(name);
    this.iconRegistry.isCustomIcon(name)
      ? (this.customIcon = iconName)
      : (this.icon = iconName);
  }
}
