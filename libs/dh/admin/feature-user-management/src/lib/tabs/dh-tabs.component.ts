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
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattTabsModule } from '@energinet-datahub/watt/tabs';

import { DhUsersTabContainerComponent } from './users-tab/dh-users-tab-container.component';
import { DhUserRolesTabComponent } from './roles-tab/dh-roles-tab.component';

@Component({
  selector: 'dh-tabs',
  standalone: true,
  templateUrl: './dh-tabs.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoModule,
    WattTabsModule,
    DhUsersTabContainerComponent,
    DhUserRolesTabComponent,
  ],
})
export class DhTabsComponent {}
