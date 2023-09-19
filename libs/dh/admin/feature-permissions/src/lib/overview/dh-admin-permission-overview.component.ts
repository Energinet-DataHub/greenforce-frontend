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
import { translate, TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/ui-permissions-table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { DhEmDashFallbackPipe, exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_CARD } from '@energinet-datahub/watt/card';

import { DhAdminPermissionDetailComponent } from '../details/dh-admin-permission-detail.component';
import { getPermissionsWatchQuery } from '../shared/dh-get-permissions-watch-query';
import { DhSharedUiSearchComponent } from '@energinet-datahub/dh/shared/ui-search';

@Component({
  selector: 'dh-admin-permission-overview',
  standalone: true,
  templateUrl: './dh-admin-permission-overview.component.html',
  styleUrls: ['./dh-admin-permission-overview.component.scss'],
  imports: [
    CommonModule,
    TranslocoModule,
    DhPermissionsTableComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WATT_CARD,
    DhEmDashFallbackPipe,
    WATT_TABLE,
    DhAdminPermissionDetailComponent,
    DhSharedUiSearchComponent,
  ],
})
export class DhAdminPermissionOverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  query = getPermissionsWatchQuery();
  permissions: PermissionDto[] = [];
  loading = false;
  error?: ApolloError;
  searchTerm?: string;

  columns: WattTableColumnDef<PermissionDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  dataSource = new WattTableDataSource<PermissionDto>();
  activeRow: PermissionDto | undefined = undefined;

  @ViewChild(DhAdminPermissionDetailComponent)
  permissionDetail!: DhAdminPermissionDetailComponent;

  ngOnInit(): void {
    this.query.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.permissions = result.data?.permissions ?? [];
        this.loading = result.loading;
        this.error = result.error;
        this.dataSource.data = result.data?.permissions ?? [];
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRowClick(row: PermissionDto): void {
    this.activeRow = row;
    this.permissionDetail.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }

  search(searchTerm?: string): void {
    this.searchTerm = searchTerm;
    this.refresh();
  }

  refresh(): void {
    this.query.refetch({ searchTerm: this.searchTerm ?? '' });
  }

  exportAsCsv(): void {
    if (this.dataSource.sort) {
      const basePath = 'admin.userManagement.permissionsTab.';
      const headers = [
        `"${translate(basePath + 'permissionName')}"`,
        `"${translate(basePath + 'permissionDescription')}"`,
      ];

      const marketRoles = this.dataSource.sortData(
        [...this.dataSource.filteredData],
        this.dataSource.sort
      );

      const lines = marketRoles.map((x) => [`"${x.name}"`, `"${x.description}"`]);

      exportToCSV({ headers, lines });
    }
  }
}
