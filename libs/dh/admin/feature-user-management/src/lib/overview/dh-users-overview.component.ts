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
import { Component, DestroyRef, computed, inject } from '@angular/core';

import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { provideComponentStore } from '@ngrx/component-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, debounceTime } from 'rxjs';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattPaginatorComponent } from '@energinet-datahub/watt/table';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { DhProfileModalService } from '@energinet-datahub/dh/profile/feature-profile-modal';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import {
  DhAdminUserManagementDataAccessApiStore,
  DhAdminUserRolesManagementDataAccessApiStore,
  DhUserManagementFilters,
} from '@energinet-datahub/dh/admin/data-access-api';

import {
  GetFilteredActorsDocument,
  MarketParticipantSortDirctionType,
  UserOverviewSortProperty,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhUsersTabTableComponent } from './dh-users-overview-table.component';
import { DhInviteUserModalComponent } from '../invite/dh-invite-user-modal.component';
import { DhUsersOverviewFiltersComponent } from './filters/dh-filters.component';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

export const debounceTimeValue = 250;

@Component({
  selector: 'dh-users-overview',
  standalone: true,
  templateUrl: './dh-users-overview.component.html',
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
    provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore),
  ],
  imports: [
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
    DhPermissionRequiredDirective,
    DhInviteUserModalComponent,
    DhUsersOverviewFiltersComponent,
  ],
})
export class DhUsersOverviewComponent {
  private destroyRef = inject(DestroyRef);
  private store = inject(DhAdminUserManagementDataAccessApiStore);
  private userRolesStore = inject(DhAdminUserRolesManagementDataAccessApiStore);
  private profileModalService = inject(DhProfileModalService);
  private modalService = inject(WattModalService);

  readonly users$ = this.store.users$;
  readonly totalUserCount$ = this.store.totalUserCount$;

  readonly pageIndex$ = this.store.paginatorPageIndex$;
  readonly pageSize$ = this.store.pageSize$;

  readonly actors = query(GetFilteredActorsDocument);
  readonly actorOptions = computed<WattDropdownOptions>(() =>
    (this.actors.data()?.filteredActors ?? []).map((actor) => ({
      displayValue: actor.displayName,
      value: actor.id,
    }))
  );
  readonly canChooseMultipleActors = computed(() => this.actorOptions().length > 1);
  readonly isLoading$ =
    this.store.isLoading$ || this.actors.loading() || this.userRolesStore.isLoading$;
  readonly hasGeneralError$ = this.store.hasGeneralError$;

  readonly initialStatusValue$ = this.store.initialStatusValue$;
  readonly userRolesOptions$: Observable<WattDropdownOptions> = this.userRolesStore.rolesOptions$;

  searchInput$ = new BehaviorSubject<string>('');

  constructor() {
    this.onSearchInput();

    this.profileModalService.onProfileUpdate$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.store.reloadUsers());
  }

  onPageChange(event: PageEvent): void {
    this.store.updatePageMetadata({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  updateFilters(value: DhUserManagementFilters): void {
    this.store.updateFilters(value);
  }

  sortChanged = (
    sortProperty: UserOverviewSortProperty,
    direction: MarketParticipantSortDirctionType
  ) => this.store.updateSort(sortProperty, direction);

  reloadUsers(): void {
    this.store.reloadUsers();
  }

  showInviteUserModal(): void {
    this.modalService.open({
      component: DhInviteUserModalComponent,
      disableClose: true,
    });
  }

  private onSearchInput(): void {
    this.searchInput$
      .pipe(debounceTime(debounceTimeValue), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.store.updateSearchText(value));
  }
}
