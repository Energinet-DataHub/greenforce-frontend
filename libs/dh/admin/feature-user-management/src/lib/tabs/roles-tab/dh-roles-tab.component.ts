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
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { DhAdminUserRolesManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import {
  MarketParticipantEicFunction,
  MarketParticipantUserRoleDto,
  MarketParticipantUserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhCreateUserRoleModalComponent } from '@energinet-datahub/dh/admin/feature-create-user-role-modal';
import { WattModalModule } from '@energinet-datahub/watt/modal';
import { exportCsv } from '@energinet-datahub/dh/shared/ui-util';

import { DhRolesTabTableComponent } from './dh-roles-tab-table.component';
import { DhRolesTabListFilterComponent } from './dh-roles-tab-list-filter.component';
import { DhTabDataGeneralErrorComponent } from '../general-error/dh-tab-data-general-error.component';

@Component({
  selector: 'dh-roles-tab',
  templateUrl: './dh-roles-tab.component.html',
  styleUrls: ['./dh-roles-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore)],
  imports: [
    CommonModule,
    TranslocoModule,
    WattButtonModule,
    WattCardModule,
    WattSpinnerModule,
    PushModule,
    DhRolesTabTableComponent,
    DhSharedUiPaginatorComponent,
    WattButtonModule,
    DhRolesTabListFilterComponent,
    DhTabDataGeneralErrorComponent,
    LetModule,
    DhPermissionRequiredDirective,
    DhCreateUserRoleModalComponent,
    WattModalModule,
  ],
})
export class DhUserRolesTabComponent {
  @Input() roles: MarketParticipantUserRoleDto[] = [];

  private readonly store = inject(DhAdminUserRolesManagementDataAccessApiStore);
  private readonly trans = inject(TranslocoService);

  roles$ = this.store.rolesFiltered$;
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  isCreateUserRoleModalVisible = false;

  updateFilterStatus(status: MarketParticipantUserRoleStatus | null) {
    this.store.setFilterStatus(status);
  }

  updateFilterEicFunction(eicFunctions: MarketParticipantEicFunction[] | null) {
    this.store.setFilterEicFunction(eicFunctions);
  }

  reloadRoles(): void {
    this.store.getRoles();
  }

  modalOnClose({ saveSuccess }: { saveSuccess: boolean }): void {
    this.isCreateUserRoleModalVisible = false;

    if (saveSuccess) {
      this.reloadRoles();
    }
  }

  async download(roles: MarketParticipantUserRoleDto[]) {
    this.trans
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(take(1))
      .subscribe((rolesTranslations) => {
        const basePath = 'admin.userManagement.tabs.roles.table.columns.';

        const headers = [
          translate(basePath + 'name'),
          translate(basePath + 'marketRole'),
          translate(basePath + 'status'),
        ];

        const lines = roles.map((x) => [x.name, rolesTranslations[x.eicFunction], x.status]);

        exportCsv(headers, lines);
      });
  }

  readonly createUserRole = () => {
    console.log('create user role');
  };
}
