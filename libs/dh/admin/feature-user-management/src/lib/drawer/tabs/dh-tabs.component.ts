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
import { TranslocoModule } from '@ngneat/transloco';

import { WattTabsModule } from '@energinet-datahub/watt/tabs';

import { DhUserBasicdataComponent } from './content/dh-user-basicdata.component';
import { DhUserRolesComponent } from './content/dh-user-roles.component';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-user-management-drawer-tabs',
  standalone: true,
  templateUrl: './dh-tabs.component.html',
  styles: [``],
  imports: [
    TranslocoModule,
    WattTabsModule,
    DhUserBasicdataComponent,
    DhUserRolesComponent,
  ],
})
export class DhTabsComponent {
  @Input() user: UserOverviewItemDto | null = null;
}
