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
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { TranslocoModule } from '@ngneat/transloco';

import {
  DhAdminUserManagementDataAccessApiStore,
  DhAdminUserRolesManagementDataAccessApiStore,
  DhUserActorsDataAccessApiStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import {
  SortDirection,
  UserOverviewSortProperty,
  UserStatus,
} from '@energinet-datahub/dh/shared/domain';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattButtonModule } from '@energinet-datahub/watt/button';

import { DhUsersTabGeneralErrorComponent } from './general-error/dh-users-tab-general-error.component';
import { DhUsersTabTableComponent } from './dh-users-tab-table.component';
import { DhUsersTabSearchComponent } from './dh-users-tab-search.component';
import { DhUsersTabStatusFilterComponent } from './dh-users-tab-status-filter.component';
import { DhUsersTabActorFilterComponent } from './dh-users-tab-actor-filter.component';
import { DhUsersTabUserRoleFilterComponent } from './dh-users-tab-userrole-filter.component';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhInviteUserModalComponent } from '@energinet-datahub/dh/admin/feature-invite-user-modal';

@Component({
  selector: 'dh-users-tab',
  standalone: true,
  templateUrl: './dh-users-tab.component.html',
  styles: [
    `
      :host {
        display: block;
        /* TODO: Add spacing variable for 24px */
        margin: 24px var(--watt-space-s);
      }

      .filter-container {
        display: inline-flex;
        gap: var(--watt-space-m);
      }

      .users-overview {
        &__spinner {
          display: flex;
          justify-content: center;
          padding: var(--watt-space-l) 0;
        }

        &__error {
          padding: var(--watt-space-xl) 0;
        }
      }

      h4 {
        margin: 0;
      }

      .card-title__container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
  providers: [
    provideComponentStore(DhAdminUserManagementDataAccessApiStore),
    provideComponentStore(DhUserActorsDataAccessApiStore),
    provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore),
  ],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    TranslocoModule,
    WattSpinnerModule,
    WattCardModule,
    DhUsersTabTableComponent,
    DhUsersTabSearchComponent,
    DhUsersTabStatusFilterComponent,
    DhSharedUiPaginatorComponent,
    DhUsersTabGeneralErrorComponent,
    DhUsersTabActorFilterComponent,
    DhUsersTabUserRoleFilterComponent,
    WattButtonModule,
    DhPermissionRequiredDirective,
    DhInviteUserModalComponent,
  ],
})
export class DhUsersTabComponent {
  readonly users$ = this.store.users$;
  readonly totalUserCount$ = this.store.totalUserCount$;

  readonly pageIndex$ = this.store.paginatorPageIndex$;
  readonly pageSize$ = this.store.pageSize$;

  readonly isLoading$ =
    this.store.isLoading$ || this.actorStore.isLoading$ || this.userRolesStore.isLoading$;
  readonly hasGeneralError$ = this.store.hasGeneralError$;

  readonly initialStatusFilter$ = this.store.initialStatusFilter$;
  isInviteUserModalVisible = false;
  readonly actorOptions$ = this.actorStore.actors$;
  readonly userRolesOptions$ = this.userRolesStore.rolesOptions$;
  readonly canChooseMultipleActors$ = this.actorStore.canChooseMultipleActors$;

  constructor(
    private store: DhAdminUserManagementDataAccessApiStore,
    private actorStore: DhUserActorsDataAccessApiStore,
    private userRolesStore: DhAdminUserRolesManagementDataAccessApiStore
  ) {
    this.actorStore.getActors();
    this.userRolesStore.getRoles();
  }

  onPageChange(event: PageEvent): void {
    this.store.updatePageMetadata({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  onSearch(value: string): void {
    this.store.updateSearchText(value);
  }

  onStatusChanged(value: UserStatus[]): void {
    this.store.updateStatusFilter(value);
  }

  sortChanged = (sortProperty: UserOverviewSortProperty, direction: SortDirection) =>
    this.store.updateSort(sortProperty, direction);

  onActorFilterChanged(actorId: string | undefined): void {
    this.store.updateActorFilter(actorId);
  }

  onUserRolesFilterChanged(userRoles: string[]): void {
    this.store.updateUserRoleFilter(userRoles);
  }

  reloadUsers(): void {
    this.store.reloadUsers();
  }

  modalOnClose(): void {
    this.isInviteUserModalVisible = false;
  }

  showInviteUserModal(): void {
    this.isInviteUserModalVisible = true;
  }
}
