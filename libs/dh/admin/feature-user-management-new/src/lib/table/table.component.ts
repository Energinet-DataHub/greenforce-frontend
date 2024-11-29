import { Component, inject, output, signal } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import {
  WattDataActionsComponent,
  WattDataFiltersComponent,
  WattDataTableComponent,
} from '@energinet-datahub/watt/data';

import { GetUsersQueryVariables, SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhUserStatusComponent } from '@energinet-datahub/dh/admin/shared';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { GetUsersDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { DhUserLatestLoginComponent } from '../user-latest-login.component';
import { DhUsersOverviewFiltersComponent } from '../filters/filters.component';
import { DhDownloadUsersCsvComponent } from './download-users-csv.component';
import { DhUser } from '@energinet-datahub/dh/admin/data-access-api';

type Variables = Partial<GetUsersQueryVariables>;

@Component({
  selector: 'dh-users',
  standalone: true,
  imports: [
    TranslocoDirective,

    WATT_TABLE,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDataActionsComponent,

    VaterUtilityDirective,

    DhEmDashFallbackPipe,
    DhUserStatusComponent,
    DhUserLatestLoginComponent,
    DhPermissionRequiredDirective,
    DhUsersOverviewFiltersComponent,
    DhDownloadUsersCsvComponent,
  ],
  template: ` <watt-data-table
    *transloco="let t; read: 'admin.userManagement.tabs.users'"
    vater
    inset="ml"
    [searchLabel]="t('search')"
    [error]="dataSource.error"
    [ready]="dataSource.called"
    (clear)="reset()"
  >
    <h3>{{ t('tabLabel') }}</h3>

    <watt-data-actions>
      <dh-download-users-csv *dhPermissionRequired="['fas']" [filters]="variables()" />
      <watt-button
        *dhPermissionRequired="['users:manage']"
        icon="plus"
        variant="secondary"
        [title]="t('inviteUser')"
        (click)="invite.emit()"
        >{{ t('inviteUser') }}
      </watt-button>
    </watt-data-actions>

    <watt-data-filters>
      <dh-users-overview-filters (filter)="fetch($event)" (clear)="reset()" />
    </watt-data-filters>

    <watt-table
      *transloco="let resolveHeader; read: 'admin.userManagement.tabs.users.columns'"
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

      <ng-container *wattTableCell="columns.email; let row">
        {{ row.email }}
      </ng-container>

      <ng-container *wattTableCell="columns.phoneNumber; let row">
        {{ row.phoneNumber | dhEmDashFallback }}
      </ng-container>

      <ng-container *wattTableCell="columns.latestLoginAt; let row">
        <dh-user-latest-login [latestLoginAt]="row.latestLoginAt" />
      </ng-container>

      <ng-container *wattTableCell="columns.status; let row">
        <dh-user-status [status]="row.status" />
      </ng-container>
    </watt-table>
  </watt-data-table>`,
})
export class DhUsersComponent {
  private navigation = inject(DhNavigationService);

  columns: WattTableColumnDef<DhUser> = {
    name: { accessor: 'name' },
    email: { accessor: 'email' },
    phoneNumber: { accessor: 'phoneNumber' },
    latestLoginAt: { accessor: 'latestLoginAt' },
    status: { accessor: 'status' },
  };

  open = output<DhUser>();
  invite = output<void>();

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };

  variables = signal<Variables>({});

  dataSource = new GetUsersDataSource({
    skip: true,
    variables: {
      order: {
        name: SortEnumType.Asc,
      },
    },
  });

  fetch = (variables: Variables) => {
    this.dataSource.refetch(variables);
    this.variables.set(variables);
  };

  reset(): void {
    this.dataSource.refetch();
  }

  onRowClick(row: DhUser): void {
    this.open.emit(row);
  }
}
