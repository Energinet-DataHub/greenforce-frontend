import { Component, DestroyRef, computed, inject } from '@angular/core';

import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { provideComponentStore } from '@ngrx/component-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, debounceTime } from 'rxjs';
import { translate, TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { wattFormatDate } from '@energinet-datahub/watt/date';

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
  UsersToDownload,
} from '@energinet-datahub/dh/admin/data-access-api';

import {
  GetFilteredActorsDocument,
  MarketParticipantSortDirctionType,
  UserOverviewSortProperty,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhInviteUserModalComponent } from './invite/invite.component';
import { DhUsersOverviewFiltersComponent } from './filters/filters.component';
import { DhUsersTabTableComponent } from './table/users-table.component';

export const debounceTimeValue = 250;

@Component({
  standalone: true,
  selector: 'dh-user-management',
  template: `<watt-card
    *transloco="let t; read: 'admin.userManagement.tabs.users'"
    vater
    inset="ml"
  >
    <vater-flex fill="vertical" gap="m">
      <vater-stack direction="row" gap="s">
        <h3>{{ t('tabLabel') }}</h3>
        <span class="watt-chip-label">{{ totalUserCount$ | push }}</span>

        <vater-spacer />

        <watt-search [label]="'shared.search' | transloco" (search)="searchInput$.next($event)" />

        <watt-button
          *dhPermissionRequired="['fas']"
          icon="download"
          variant="text"
          (click)="download()"
          [loading]="isDownloading()"
          >{{ 'shared.download' | transloco }}</watt-button
        >

        <watt-button
          *dhPermissionRequired="['users:manage']"
          icon="plus"
          variant="secondary"
          [title]="t('inviteUser')"
          (click)="showInviteUserModal()"
          >{{ t('inviteUser') }}</watt-button
        >
      </vater-stack>

      <vater-stack direction="row" gap="m">
        <dh-users-overview-filters
          [statusValue]="initialStatusValue$ | push"
          [actorOptions]="actorOptions()"
          [userRoleOptions]="userRolesOptions$ | push"
          [canChooseMultipleActors]="canChooseMultipleActors()"
          (filtersChanges)="updateFilters($event)"
        />
      </vater-stack>

      <ng-container *rxLet="users$ as users">
        <dh-users-overview-table
          [users]="users"
          [sortChanged]="sortChanged"
          [isLoading]="isLoading$ | push"
          [hasGeneralError]="hasGeneralError$ | push"
          (reload)="reloadUsers()"
        />
      </ng-container>

      <watt-paginator
        [length]="totalUserCount$ | push"
        [pageSize]="pageSize$ | push"
        [pageIndex]="pageIndex$ | push"
        (changed)="onPageChange($event)"
      />
    </vater-flex>
  </watt-card> `,
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
    DhUsersOverviewFiltersComponent,
  ],
})
export class DhUserManagementComponent {
  private destroyRef = inject(DestroyRef);
  private store = inject(DhAdminUserManagementDataAccessApiStore);
  private userRolesStore = inject(DhAdminUserRolesManagementDataAccessApiStore);
  private profileModalService = inject(DhProfileModalService);
  private modalService = inject(WattModalService);
  private environment = inject(dhAppEnvironmentToken);
  private toastService = inject(WattToastService);

  readonly users$ = this.store.users$;
  readonly totalUserCount$ = this.store.totalUserCount$;

  readonly pageIndex$ = this.store.paginatorPageIndex$;
  readonly pageSize$ = this.store.pageSize$;

  readonly actors = query(GetFilteredActorsDocument);
  readonly actorOptions = computed<WattDropdownOptions>(() =>
    (this.actors.data()?.filteredActors ?? []).map((actor) => ({
      displayValue:
        actor.name + ' (' + translate(`marketParticipant.marketRoles.${actor.marketRole}`) + ')',
      value: actor.id,
    }))
  );
  readonly canChooseMultipleActors = computed(() => this.actorOptions().length > 1);
  readonly isLoading$ =
    this.store.isLoading$ || this.actors.loading() || this.userRolesStore.isLoading$;
  readonly hasGeneralError$ = this.store.hasGeneralError$;

  readonly initialStatusValue$ = this.store.initialStatusValue$;
  readonly userRolesOptions$: Observable<WattDropdownOptions> =
    this.userRolesStore.activeUserRoleOptions$;

  readonly isDownloading = this.store.isDownloading;

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

  download(): void {
    const onSuccess = (usersToDownload: UsersToDownload) => {
      const basePath = 'admin.userManagement.downloadUsers';

      const headers = [
        `"${translate(basePath + '.userName')}"`,
        `"${translate(basePath + '.email')}"`,
        `"${translate(basePath + '.marketParticipantName')}"`,
        `"${translate(basePath + '.latestLogin')}"`,
        `"${translate(basePath + '.organisationName')}"`,
      ];

      const lines = usersToDownload.map((x) => [
        `"${x.userName}"`,
        `"${x.userEmail}"`,
        `"${x.marketParticipantName}"`,
        `"${(x.latestLoginAt && wattFormatDate(x.latestLoginAt, 'short')) || ''}"`,
        `"${x.organizationName}"`,
      ]);

      const fileName = translate(`${basePath}.fileName`, {
        datetime: wattFormatDate(new Date(), 'long'),
        env: translate(`envinronementName.${this.environment.current}`),
      });

      exportToCSV({
        headers,
        lines,
        fileName,
      });

      this.toastService.dismiss();
    };

    const onError = () => {
      this.toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });
    };

    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    this.store
      .downloadUsers()
      .then((value) => onSuccess(value))
      .catch(() => onError());
  }

  private onSearchInput(): void {
    this.searchInput$
      .pipe(debounceTime(debounceTimeValue), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.store.updateSearchText(value));
  }
}
