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
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { WattDescriptionListGroups } from './watt-description-list-term';

/**
 * Usage:
 * `import { WattDescriptionListComponent } from '@energinet-datahub/watt/description-list';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-description-list',
  styleUrls: ['./watt-description-list.component.scss'],
  templateUrl: './watt-description-list.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class WattDescriptionListComponent {
  @Input() groups: WattDescriptionListGroups = [];
  @HostBinding('style.--watt-description-list-groups-per-row')
  @Input()
  groupsPerRow!: number;
}
