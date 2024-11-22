import { inject, output, signal, Component, ChangeDetectionStrategy } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import {
  SortEnumType,
  GetFilteredUserRolesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhUserRole } from '@energinet-datahub/dh/admin/data-access-api';
import { DhRoleStatusComponent } from '@energinet-datahub/dh/admin/shared';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { GetFilteredUserRolesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import {
  WattDataTableComponent,
  WattDataFiltersComponent,
  WattDataActionsComponent,
} from '@energinet-datahub/watt/data';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';

import { DhUserRolesFilterComponent } from './filter.component';
import { DhUserRolesDownloadComponent } from './download.component';

type Variables = Partial<GetFilteredUserRolesQueryVariables>;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-user-roles-table',
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_TABLE,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDataActionsComponent,

    VaterUtilityDirective,

    DhRoleStatusComponent,
    DhUserRolesFilterComponent,
    DhUserRolesDownloadComponent,
    DhPermissionRequiredDirective,
  ],
  template: `<watt-data-table
    *transloco="let t; read: 'admin.userManagement.tabs.roles'"
    vater
    inset="ml"
    [searchLabel]="'shared.search' | transloco"
    [error]="dataSource.error"
    [ready]="dataSource.called"
  >
    <h3>{{ t('tabLabel') }}</h3>

    <watt-data-actions>
      <dh-user-roles-download [userRoles]="dataSource.filteredData" />
      <watt-button
        *dhPermissionRequired="['user-roles:manage']"
        icon="plus"
        variant="secondary"
        (click)="create.emit()"
        >{{ t('createuserrole') }}
      </watt-button>
    </watt-data-actions>

    <watt-data-filters>
      <dh-user-roles-filter (filter)="fetch($event)" />
    </watt-data-filters>

    <watt-table
      *transloco="let resolveHeader; read: 'admin.userManagement.tabs.roles.table.columns'"
      [dataSource]="dataSource"
      [columns]="columns"
      [loading]="dataSource.loading"
      [resolveHeader]="resolveHeader"
      [activeRow]="selection()"
      (rowClick)="onRowClick($event)"
    >
      <ng-container *wattTableCell="columns.name; let row">
        {{ row.name }}
      </ng-container>

      <ng-container *wattTableCell="columns.eicFunction; let row">
        {{ 'marketParticipant.marketRoles.' + row.eicFunction | transloco }}
      </ng-container>

      <ng-container *wattTableCell="columns['status']; let role">
        <dh-role-status [status]="role.status" />
      </ng-container>
    </watt-table>
  </watt-data-table>`,
})
export class DhUserRolesTableComponent {
  private navigation = inject(DhNavigationService);

  open = output<DhUserRole>();
  create = output<void>();

  variables = signal<Variables>({});

  dataSource = new GetFilteredUserRolesDataSource({
    skip: true,
    variables: {
      order: { name: SortEnumType.Asc },
    },
  });
  columns: WattTableColumnDef<DhUserRole> = {
    name: { accessor: 'name' },
    eicFunction: { accessor: 'eicFunction' },
    status: { accessor: 'status' },
  };

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };

  fetch = (variables: Variables) => {
    this.dataSource.refetch(variables);
    this.variables.set(variables);
  };

  reset(): void {
    this.dataSource.refetch();
  }

  onRowClick(row: DhUserRole): void {
    this.open.emit(row);
  }
}
