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
import { Component, computed, effect, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import type { ResultOf } from '@graphql-typed-document-node/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { GetPermissionDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

type UserRole = ResultOf<
  typeof GetPermissionDetailsDocument
>['permissionById']['userRoles'][number];

@Component({
  selector: 'dh-admin-permission-roles',
  templateUrl: './dh-admin-permission-roles.component.html',
  standalone: true,
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WattSpinnerComponent,
    WattEmptyStateComponent,

    VaterFlexComponent,
  ],
})
export class DhAdminPermissionRolesComponent {
  private readonly getPermissionQuery = lazyQuery(GetPermissionDetailsDocument);
  private readonly userRoles = computed(
    () => this.getPermissionQuery.data()?.permissionById?.userRoles ?? []
  );

  selectedPermission = input.required<PermissionDto>();

  userRolesCount = computed(() => this.userRoles().length);
  loading = this.getPermissionQuery.loading;
  hasError = computed(() => this.getPermissionQuery.error() !== undefined);

  dataSource = new WattTableDataSource<UserRole>();

  columns: WattTableColumnDef<UserRole> = {
    name: { accessor: 'name' },
    eicFunction: { accessor: 'eicFunction' },
  };

  constructor() {
    effect(() => {
      this.dataSource.data = this.userRoles();
    });

    effect(() => {
      this.getPermissionQuery.refetch({ id: this.selectedPermission().id });
    });
  }
}
