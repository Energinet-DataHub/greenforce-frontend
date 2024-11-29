//#region License
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
//#endregion
import { Component, computed, effect, input } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import type { ResultOf } from '@graphql-typed-document-node/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import { PermissionDetailDto } from '@energinet-datahub/dh/shared/domain';
import { GetPermissionDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

type MarketRole = ResultOf<
  typeof GetPermissionDetailsDocument
>['permissionById']['assignableTo'][number];

@Component({
  selector: 'dh-admin-permission-market-roles',
  templateUrl: './market-roles.component.html',
  standalone: true,
  imports: [TranslocoDirective, WATT_CARD, WATT_TABLE, VaterFlexComponent],
})
export class DhAdminPermissionMarketRolesComponent {
  private readonly marketRoles = computed(() => {
    return this.selectedPermission().assignableTo ?? [];
  });

  selectedPermission = input.required<PermissionDetailDto>();

  dataSource = new WattTableDataSource<MarketRole>();

  columns: WattTableColumnDef<MarketRole> = {
    name: { accessor: null },
  };

  marketRolesCount = computed(() => this.marketRoles().length);

  constructor() {
    effect(() => {
      this.dataSource.data = this.marketRoles();
    });
  }
}
