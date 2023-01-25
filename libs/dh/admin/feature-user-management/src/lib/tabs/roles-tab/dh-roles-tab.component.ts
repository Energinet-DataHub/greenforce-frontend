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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';

import { DhRolesTabTableComponent } from './dh-roles-tab-table.component';
import { DhRolesTabListFilterComponent } from './dh-roles-tab-list-filter.component';
import { DhTabDataGeneralErrorComponent } from '../general-error/dh-tab-data-general-error.component';
import { DhAdminUserRolesManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import {
  EicFunction,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { take } from 'rxjs';

@Component({
  selector: 'dh-roles-tab',
  templateUrl: './dh-roles-tab.component.html',
  styleUrls: ['./dh-roles-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore),
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    WattButtonModule,
    WattCardModule,
    WattSpinnerModule,
    PushModule,
    DhRolesTabTableComponent,
    DhSharedUiPaginatorComponent,
    DhRolesTabListFilterComponent,
    DhTabDataGeneralErrorComponent,
    LetModule,
  ],
})
export class DhUserRolesTabComponent {
  private readonly store = inject(DhAdminUserRolesManagementDataAccessApiStore);

  roles$ = this.store.rolesFiltered$;
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  updateFilterStatus(status: UserRoleStatus | null) {
    this.store.setFilterStatus(status);
  }

  updateFilterEicFunction(eicFunctions: EicFunction[] | null) {
    this.store.setFilterEicFunction(eicFunctions);
  }

  reloadRoles(): void {
    this.store.getRoles();
  }

  async download() {
    this.roles$.pipe(take(1)).subscribe((roles) => {
      const basePath = 'admin.userManagement.tabs.roles.table.columns.';

      const header = `${translate(basePath + 'name')};${translate(
        basePath + 'marketrole'
      )};${translate(basePath + 'status')}`;

      const csv = roles
        .map((x) => `${x.name};${x.eicFunction};${x.status}`)
        .join('\n');

      const a = document.createElement('a');
      a.href = URL.createObjectURL(
        new Blob([`${header}\n${csv}`], { type: 'text/csv;charset=utf-8;' })
      );
      a.download = 'result.csv';
      a.click();
    });
  }
}
