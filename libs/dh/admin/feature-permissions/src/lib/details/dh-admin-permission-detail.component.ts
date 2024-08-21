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
import { Component, ViewEncapsulation, viewChild, output, signal, computed } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattTabsComponent, WattTabComponent } from '@energinet-datahub/watt/tabs';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';

import { DhPermissionAuditLogsComponent } from './tabs/dh-admin-permission-audit-logs.component';
import { DhAdminPermissionRolesComponent } from './tabs/dh-admin-permission-roles.component';
import { DhAdminPermissionMarketRolesComponent } from './tabs/dh-admin-permission-market-roles.component';
import { DhEditPermissionModalComponent } from '../edit/dh-edit-permission-modal.component';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetPermissionsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-admin-permission-detail',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dh-admin-permission-detail.component.html',
  imports: [
    TranslocoDirective,

    WATT_DRAWER,
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
  private query = query(GetPermissionsDocument, { variables: { searchTerm: '' } });

  drawer = viewChild.required(WattDrawerComponent);

  selectedPermission = computed(() =>
    this.query
      .data()
      ?.permissions?.permissions.find((permission) => permission.id === this.permissionId())
  );
  isEditPermissionModalVisible = false;

  permissionId = signal<number | undefined>(undefined);

  closed = output<void>();
  updated = output<void>();

  onClose(): void {
    this.drawer().close();
    this.closed.emit();
  }

  open(permission: PermissionDto): void {
    this.permissionId.set(permission.id);
    this.drawer().open();
  }

  modalOnClose({ saveSuccess }: { saveSuccess: boolean }): void {
    this.isEditPermissionModalVisible = false;

    if (saveSuccess) {
      this.updated.emit();
    }
  }
}
