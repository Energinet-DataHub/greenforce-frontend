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
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/ui-permissions-table';
import { CommonModule } from '@angular/common';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { ApolloError } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { TranslocoModule } from '@ngneat/transloco';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { Subscription } from 'rxjs';
import { DhAdminPermissionDetailComponent } from '../details/dh-admin-permission-detail.component';
import { Permission } from '../permission';

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
  private apollo = inject(Apollo);
  subscription!: Subscription;
  permissions?: Permission[];
  loading = false;
  error?: ApolloError;

  columns: WattTableColumnDef<Permission> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  dataSource = new WattTableDataSource<Permission>();
  activeRow: Permission | undefined = undefined;

  @ViewChild(DhAdminPermissionDetailComponent)
  permissionDetail!: DhAdminPermissionDetailComponent;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.apollo
      .watchQuery({
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: graphql.GetPermissionsDocument,
      })
      .valueChanges.subscribe({
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

  onRowClick(row: Permission): void {
    this.activeRow = row;
    this.permissionDetail.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }
}
