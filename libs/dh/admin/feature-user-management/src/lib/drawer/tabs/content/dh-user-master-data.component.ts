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
import { Component, Input } from '@angular/core';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import {
  WattDescriptionListComponent,
  WattDescriptionListGroups,
} from '@energinet-datahub/watt/description-list';
import { emDash } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-user-master-data',
  standalone: true,
  templateUrl: './dh-user-master-data.component.html',
  styles: [
    `
      :host {
        margin: var(--watt-space-ml);
        display: block;
      }
    `,
  ],
  imports: [WattCardModule, WattDescriptionListComponent, TranslocoModule],
})
export class DhUserMasterDataComponent {
  @Input() user: UserOverviewItemDto | null = null;

  getMasterData(): WattDescriptionListGroups {
    if (!this.user) return [];

    return [
      {
        term: translate('admin.userManagement.tabs.masterData.name'),
        description: this.user.name,
      },
      {
        term: translate('admin.userManagement.tabs.masterData.email'),
        description: this.user.email,
      },
      {
        term: translate('admin.userManagement.tabs.masterData.phone'),
        description: this.user.phoneNumber ?? emDash,
      },
    ];
  }
}
