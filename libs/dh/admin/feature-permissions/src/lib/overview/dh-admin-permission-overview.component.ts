import { Component, inject, OnInit } from '@angular/core';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/ui-permissions-table';
import { CommonModule } from '@angular/common';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { ApolloError } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { labels } from '@energinet-datahub/dh/globalization/assets-localization';
import { TranslocoModule } from '@ngneat/transloco';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattCardModule } from '@energinet-datahub/watt/card';
@Component({
  selector: 'dh-admin-permission-overview',
  standalone: true,
  templateUrl: './dh-admin-permission-overview.component.html',
  styleUrls: ['./dh-admin-permission-overview.component.scss'],
  imports: [
    CommonModule,
    TranslocoModule,
    DhPermissionsTableComponent,
    WattSpinnerModule,
    WattEmptyStateModule,
    WattCardModule,
    DhEmDashFallbackPipeScam,
    WATT_TABLE,
  ],
})
export class DhAdminPermissionOverviewComponent implements OnInit {
  private apollo = inject(Apollo);
  permissions?: graphql.Permission[];
  loading = false;
  error?: ApolloError;
  sharedLabels = labels.shared;
  permissionsLabels = labels.admin.userManagement.permissionsTab;

  columns: WattTableColumnDef<graphql.Permission> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  dataSource = new WattTableDataSource<graphql.Permission>();
  activeRow: graphql.Permission | undefined = undefined;

  ngOnInit(): void {
    this.apollo
      .watchQuery({
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: graphql.GetPermissionsDocument,
      })
      .valueChanges.subscribe((result) => {
        this.permissions = result.data?.permissions ?? undefined;
        this.loading = result.loading;
        this.error = result.error;
        this.dataSource.data = result.data?.permissions ?? [];
      });
  }

  onRowClick(row: graphql.Permission): void {
    this.activeRow = row;
  }
}
