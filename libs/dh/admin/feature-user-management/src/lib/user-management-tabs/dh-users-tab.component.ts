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
import { Component, inject } from '@angular/core';
import { PushModule } from '@rx-angular/template';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  selector: 'dh-users-tab',
  templateUrl: './dh-users-tab.component.html',
  styleUrls: ['./dh-users-tab.component.scss'],
  standalone: true,
  providers: [DhAdminUserManagementDataAccessApiStore],
  imports: [CommonModule, PushModule, TranslocoModule, WattCardModule],
})
export class DhUsersTabComponent {
  private store = inject(DhAdminUserManagementDataAccessApiStore);

  usersCount$ = this.store.usersCount$;
}
