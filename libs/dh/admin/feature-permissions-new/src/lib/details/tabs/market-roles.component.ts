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
