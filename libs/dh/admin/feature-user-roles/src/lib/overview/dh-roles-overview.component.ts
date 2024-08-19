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
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  DestroyRef,
  computed,
  signal,
} from '@angular/core';
import { translate, TranslocoDirective, TranslocoService, TranslocoPipe } from '@ngneat/transloco';
import { take, BehaviorSubject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattPaginatorComponent } from '@energinet-datahub/watt/table';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import {
  UserRoleDto,
  EicFunction,
  UserRoleStatus,
  GetUserRolesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhRolesTabTableComponent } from './dh-roles-overview-table.component';
import { DhRolesOverviewListFilterComponent } from './dh-roles-overview-list-filter.component';
import { DhCreateUserRoleModalComponent } from '../create/dh-create-user-role-modal.component';

type Filters = {
  status: UserRoleStatus | null;
  eicFunctions: EicFunction[] | null;
  searchTerm: string | null;
};

@Component({
  selector: 'dh-roles-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-roles-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }

      watt-paginator {
        --watt-space-ml--negative: calc(var(--watt-space-ml) * -1);

        display: block;
        margin: 0 var(--watt-space-ml--negative) var(--watt-space-ml--negative)
          var(--watt-space-ml--negative);
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    VaterStackComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    WATT_CARD,
    WattSearchComponent,
    WattButtonComponent,
    WattPaginatorComponent,

    DhRolesTabTableComponent,
    DhRolesOverviewListFilterComponent,
    DhPermissionRequiredDirective,
    DhCreateUserRoleModalComponent,
  ],
})
export class DhUserRolesOverviewComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly transloco = inject(TranslocoService);

  private rolesGraphQL = query(GetUserRolesDocument);

  searchInput$ = new BehaviorSubject<string>('');
  isCreateUserRoleModalVisible = false;

  filters = signal<Filters>({
    status: UserRoleStatus.Active,
    eicFunctions: null,
    searchTerm: null,
  });

  roles = computed(() => this.rolesGraphQL.data()?.userRoles ?? []);
  rolesFiltered = computed(() => this.filterRoles(this.roles(), this.filters()));

  isLoading = this.rolesGraphQL.loading;
  hasGeneralError = computed(() => Boolean(this.rolesGraphQL.error()));

  constructor() {
    this.onSearchInput();
  }

  updateFilterStatus(status: UserRoleStatus | null) {
    this.filters.update((state) => ({ ...state, status }));
  }

  updateFilterEicFunction(eicFunctions: EicFunction[] | null) {
    this.filters.update((state) => ({ ...state, eicFunctions }));
  }

  reloadRoles(): void {
    this.rolesGraphQL.refetch();
  }

  modalOnClose(): void {
    this.isCreateUserRoleModalVisible = false;
  }

  async download(roles: UserRoleDto[]) {
    this.transloco
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(take(1))
      .subscribe((rolesTranslations) => {
        const basePath = 'admin.userManagement.tabs.roles.table.columns.';

        const headers = [
          `"${translate(basePath + 'name')}"`,
          `"${translate(basePath + 'marketRole')}"`,
          `"${translate(basePath + 'status')}"`,
        ];

        const lines = roles.map((role) => [
          `"${role.name}"`,
          `"${rolesTranslations[role.eicFunction]}"`,
          `"${translate('admin.userManagement.roleStatus.' + role.status)}"`,
        ]);

        exportToCSV({ headers, lines, fileName: 'user-roles' });
      });
  }

  private onSearchInput(): void {
    this.searchInput$
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.filters.update((state) => ({ ...state, searchTerm: value }));
      });
  }

  private filterRoles(roles: UserRoleDto[], filter: Filters): UserRoleDto[] {
    return roles.filter(
      (role) =>
        (!filter.status || role.status == filter.status) &&
        (!filter.eicFunctions ||
          filter.eicFunctions.length == 0 ||
          filter.eicFunctions.includes(role.eicFunction)) &&
        (!filter.searchTerm || role.name.toUpperCase().includes(filter.searchTerm.toUpperCase()))
    );
  }
}
