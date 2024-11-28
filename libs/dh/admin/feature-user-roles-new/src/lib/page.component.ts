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

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import { DhUserRolesTableComponent } from './table.component';
import { DhUserRoleDetailsComponent } from './details/details.component';

@Component({
  standalone: true,
  selector: 'dh-user-roles-page',
  template: `
    <dh-user-roles-table (open)="details.open($event.id)" />
    <dh-user-role-details #details />
  `,
  imports: [DhUserRolesTableComponent, DhUserRoleDetailsComponent],
  providers: [DhNavigationService],
})
export class DhUserRolesPageComponent {}
