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
import {
  output,
  inject,
  computed,
  Component,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattTabsComponent, WattTabComponent } from '@energinet-datahub/watt/tabs';

import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetPermissionDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhEditPermissionModalComponent } from '../edit/dh-edit-permission-modal.component';
import { DhAdminPermissionRolesComponent } from './tabs/dh-admin-permission-roles.component';
import { DhPermissionAuditLogsComponent } from './tabs/dh-admin-permission-audit-logs.component';
import { DhAdminPermissionMarketRolesComponent } from './tabs/dh-admin-permission-market-roles.component';

@Component({
  selector: 'dh-admin-permission-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-admin-permission-detail.component.html',
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    WATT_DRAWER,
    WattTabComponent,
    WattCardComponent,
    WattTabsComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhPermissionRequiredDirective,
    DhPermissionAuditLogsComponent,
    DhAdminPermissionRolesComponent,
    DhAdminPermissionMarketRolesComponent,
    VaterFlexComponent,
  ],
})
export class DhAdminPermissionDetailComponent {
  private modalService = inject(WattModalService);
  private query = lazyQuery(GetPermissionDetailsDocument);

  drawer = viewChild.required(WattDrawerComponent);

  permission = computed(() => this.query.data()?.permissionById);

  isLoading = this.query.loading;
  hasError = this.query.hasError;

  closed = output<void>();

  onClose(): void {
    this.drawer().close();
    this.closed.emit();
  }

  open(permission: PermissionDto): void {
    this.query.query({ variables: { id: permission.id } });
    this.drawer().open();
  }

  edit() {
    this.modalService.open({
      component: DhEditPermissionModalComponent,
      data: this.permission(),
    });
  }
}
