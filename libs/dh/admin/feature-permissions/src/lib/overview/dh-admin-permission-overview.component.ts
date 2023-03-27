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
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloError } from '@apollo/client';
import { TranslocoModule } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/ui-permissions-table';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattCardModule } from '@energinet-datahub/watt/card';

import { DhAdminPermissionDetailComponent } from '../details/dh-admin-permission-detail.component';
import { getPermissionsWatchQuery } from '../shared/dh-get-permissions-watch-query';

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
    DhAdminPermissionDetailComponent,
  ],
})
export class DhAdminPermissionOverviewComponent implements OnInit, OnDestroy {
  private getPermissionsQuery = getPermissionsWatchQuery();
  private subscription!: Subscription;

  permissions?: PermissionDto[];
  loading = false;
  error?: ApolloError;

  columns: WattTableColumnDef<PermissionDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  dataSource = new WattTableDataSource<PermissionDto>();
  activeRow: PermissionDto | undefined = undefined;

  @ViewChild(DhAdminPermissionDetailComponent)
  permissionDetail!: DhAdminPermissionDetailComponent;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.getPermissionsQuery.valueChanges.subscribe({
      next: (result) => {
        this.permissions = result.data?.permissions ?? undefined;
        this.loading = result.loading;
        this.error = result.error;
        this.dataSource.data = result.data?.permissions ?? [];
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  onRowClick(row: PermissionDto): void {
    this.activeRow = row;
    this.permissionDetail.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }

  onRefreshData(): void {
    this.getPermissionsQuery.refetch();
  }
}
