//#region License
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
//#endregion
import {
  input,
  inject,
  effect,
  computed,
  viewChild,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { TranslocoDirective } from '@ngneat/transloco';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattTabsComponent, WattTabComponent } from '@energinet-datahub/watt/tabs';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetPermissionDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhPermissionAuditLogsComponent } from './tabs/audit-logs.component';
import { DhAdminPermissionRolesComponent } from './tabs/admin-permission-roles.component';
import { DhAdminPermissionMarketRolesComponent } from './tabs/market-roles.component';

@Component({
  selector: 'dh-permission-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail.component.html',
  imports: [
    RouterOutlet,
    TranslocoDirective,
    WATT_DRAWER,
    WattTabComponent,
    WattCardComponent,
    WattTabsComponent,
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhResultComponent,
    DhPermissionRequiredDirective,
    DhPermissionAuditLogsComponent,
    DhAdminPermissionRolesComponent,
    DhAdminPermissionMarketRolesComponent,
  ],
})
export class DhPermissionDetailComponent {
  private navigationService = inject(DhNavigationService);
  private query = lazyQuery(GetPermissionDetailsDocument);

  drawer = viewChild.required(WattDrawerComponent);

  // param id
  id = input.required<string>();

  permission = computed(() => this.query.data()?.permissionById);

  loading = this.query.loading;
  hasError = this.query.hasError;

  constructor() {
    effect(() => {
      this.query.query({ variables: { id: parseInt(this.id()) } });
      this.drawer().open();
    });
  }

  onClose(): void {
    this.navigationService.navigate('list');
  }

  edit() {
    this.navigationService.navigate('edit', this.id());
  }
}
