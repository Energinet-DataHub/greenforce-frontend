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
import { Component, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { map, Subscription } from 'rxjs';

import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattTabsComponent, WattTabComponent } from '@energinet-datahub/watt/tabs';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhEditPermissionModalComponent } from '@energinet-datahub/dh/admin/feature-edit-permission-modal';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';

import { DhPermissionAuditLogsComponent } from './tabs/dh-admin-permission-audit-logs.component';
import { getPermissionsWatchQuery } from '../shared/dh-get-permissions-watch-query';
import { DhAdminPermissionRolesComponent } from './tabs/dh-admin-permission-roles.component';
import { DhAdminPermissionMarketRolesComponent } from './tabs/dh-admin-permission-market-roles.component';

@Component({
  selector: 'dh-admin-permission-detail',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dh-admin-permission-detail.component.html',
  imports: [
    NgIf,
    WATT_DRAWER,
    TranslocoModule,
    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattTabsComponent,
    WattTabComponent,
    WattButtonComponent,
    DhPermissionRequiredDirective,
    DhEditPermissionModalComponent,
    DhPermissionAuditLogsComponent,
    DhAdminPermissionRolesComponent,
    DhAdminPermissionMarketRolesComponent,
  ],
})
export class DhAdminPermissionDetailComponent {
  private getPermissionsQuery = getPermissionsWatchQuery();
  private subscription?: Subscription;

  @ViewChild(WattDrawerComponent)
  drawer!: WattDrawerComponent;

  selectedPermission: PermissionDto | null = null;
  isEditPermissionModalVisible = false;

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
    this.selectedPermission = null;
    this.subscription?.unsubscribe();
  }

  open(permission: PermissionDto): void {
    this.subscription?.unsubscribe();
    this.loadData(permission.id);
    this.drawer.open();
  }

  modalOnClose({ saveSuccess }: { saveSuccess: boolean }): void {
    this.isEditPermissionModalVisible = false;

    if (saveSuccess) {
      this.updated.emit();
      this.refreshData();
    }
  }

  private loadData(permissionId: number): void {
    this.subscription = this.getPermissionsQuery.valueChanges
      .pipe(
        map((result) =>
          result.data.permissions.find((permission) => permission.id === permissionId)
        )
      )
      .subscribe({
        next: (permission) => {
          this.selectedPermission = permission ? { ...permission } : null;
        },
      });
  }

  private refreshData(): void {
    this.getPermissionsQuery.refetch();
  }
}
