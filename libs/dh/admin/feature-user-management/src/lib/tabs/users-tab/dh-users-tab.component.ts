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
import { Component, DestroyRef, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { BehaviorSubject, Observable, debounceTime, delay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  DhAdminUserManagementDataAccessApiStore,
  DhAdminUserRolesManagementDataAccessApiStore,
  DhUserActorsDataAccessApiStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import {
  MarketParticipantSortDirection,
  MarketParticipantUserOverviewSortProperty,
  MarketParticipantUserStatus,
} from '@energinet-datahub/dh/shared/domain';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhInviteUserModalComponent } from '@energinet-datahub/dh/admin/feature-invite-user-modal';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { DhProfileModalService } from '@energinet-datahub/dh/profile/feature-profile-modal';

import { DhUsersTabTableComponent } from './dh-users-tab-table.component';
import { DhUsersTabStatusFilterComponent } from './dh-users-tab-status-filter.component';
import { DhUsersTabActorFilterComponent } from './dh-users-tab-actor-filter.component';
import { DhUsersTabUserRoleFilterComponent } from './dh-users-tab-userrole-filter.component';

export const debounceTimeValue = 250;

@Component({
  selector: 'dh-users-tab',
  standalone: true,
  templateUrl: './dh-users-tab.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }

      watt-paginator {
        --watt-space-ml--negative: calc(var(--watt-space-ml) * -1);

        display: block;
        margin: 0 var(--watt-space-ml--negative) var(--watt-space-ml--negative)
          var(--watt-space-ml--negative);
      }
    `,
  ],
  providers: [
    provideComponentStore(DhAdminUserManagementDataAccessApiStore),
    provideComponentStore(DhUserActorsDataAccessApiStore),
    provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore),
  ],
  imports: [
    NgIf,
    RxLet,
    RxPush,
    TranslocoDirective,
    TranslocoPipe,

    VaterStackComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    WATT_CARD,
    WattButtonComponent,
    WattPaginatorComponent,
    WattSearchComponent,

    DhUsersTabTableComponent,
    DhUsersTabStatusFilterComponent,
    DhUsersTabActorFilterComponent,
    DhUsersTabUserRoleFilterComponent,
    DhPermissionRequiredDirective,
    DhInviteUserModalComponent,
  ],
})
export class DhUsersTabComponent {
  private destroyRef = inject(DestroyRef);
  private store = inject(DhAdminUserManagementDataAccessApiStore);
  private actorStore = inject(DhUserActorsDataAccessApiStore);
  private userRolesStore = inject(DhAdminUserRolesManagementDataAccessApiStore);
  private profileModalService = inject(DhProfileModalService);

  readonly users$ = this.store.users$;
  readonly totalUserCount$ = this.store.totalUserCount$;

  readonly pageIndex$ = this.store.paginatorPageIndex$;
  readonly pageSize$ = this.store.pageSize$;

  readonly isLoading$ =
    this.store.isLoading$ || this.actorStore.isLoading$ || this.userRolesStore.isLoading$;
  readonly hasGeneralError$ = this.store.hasGeneralError$;

  readonly initialStatusFilter$ = this.store.initialStatusFilter$;
  readonly actorOptions$: Observable<WattDropdownOptions> = this.actorStore.actors$;
  readonly userRolesOptions$: Observable<WattDropdownOptions> = this.userRolesStore.rolesOptions$;
  readonly canChooseMultipleActors$ = this.actorStore.canChooseMultipleActors$;

  searchInput$ = new BehaviorSubject<string>('');
  isInviteUserModalVisible = false;

  constructor() {
    this.actorStore.getActors();
    this.userRolesStore.getRoles();

    this.onSearchInput();

    this.profileModalService.onProfileUpdate$
      .pipe(delay(1000), takeUntilDestroyed())
      .subscribe(() => this.store.reloadUsers());
  }

  onPageChange(event: PageEvent): void {
    this.store.updatePageMetadata({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  onStatusChanged(value: MarketParticipantUserStatus[]): void {
    this.store.updateStatusFilter(value);
  }

  sortChanged = (
    sortProperty: MarketParticipantUserOverviewSortProperty,
    direction: MarketParticipantSortDirection
  ) => this.store.updateSort(sortProperty, direction);

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

  private onSearchInput(): void {
    this.searchInput$
      .pipe(debounceTime(debounceTimeValue), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.store.updateSearchText(value));
  }
}
