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
import { Component, inject, output, signal, viewChild } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import {
  WattDataActionsComponent,
  WattDataFiltersComponent,
  WattDataTableComponent,
} from '@energinet-datahub/watt/data';

import {
  GetUsersDocument,
  MarketParticipantSortDirctionType,
  UserOverviewSearchQueryVariables,
  UserOverviewSortProperty,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhUserStatusComponent } from '@energinet-datahub/dh/admin/shared';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { GetUsersDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { DhUserLatestLoginComponent } from '../user-latest-login.component';
import { DhUsersOverviewFiltersComponent } from '../filters/filters.component';
import { DhDownloadUsersCsvComponent } from './download-users-csv.component';
import type { ResultOf } from '@graphql-typed-document-node/core';

type Variables = Partial<UserOverviewSearchQueryVariables>;

export type DhUsers = NonNullable<ResultOf<typeof GetUsersDocument>['users']>['nodes'];

export type DhUser = NonNullable<DhUsers>[0];

@Component({
  selector: 'dh-users',
  standalone: true,
  imports: [
    TranslocoDirective,

    WATT_TABLE,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDataActionsComponent,

    VaterUtilityDirective,

    DhEmDashFallbackPipe,
    DhUserStatusComponent,
    DhUserLatestLoginComponent,
    DhPermissionRequiredDirective,
    DhUsersOverviewFiltersComponent,
    DhDownloadUsersCsvComponent,
  ],
  template: ` <watt-data-table
    *transloco="let t; read: 'admin.userManagement.tabs.users'"
    vater
    inset="ml"
    [searchLabel]="t('search')"
    [error]="dataSource.error"
    [ready]="dataSource.called"
    (clear)="reset()"
  >
    <h3>{{ t('tabLabel') }}</h3>

    <watt-data-actions>
      <dh-download-users-csv *dhPermissionRequired="['fas']" [filters]="variables()" />
      <watt-button
        *dhPermissionRequired="['users:manage']"
        icon="plus"
        variant="secondary"
        [title]="t('inviteUser')"
        (click)="invite.emit()"
        >{{ t('inviteUser') }}
      </watt-button>
    </watt-data-actions>

    <watt-data-filters>
      <dh-users-overview-filters (filter)="fetch($event)" (clear)="reset()" />
    </watt-data-filters>

    <watt-table
      *transloco="let resolveHeader; read: 'admin.userManagement.tabs.users.columns'"
      #table
      [dataSource]="dataSource"
      [columns]="columns"
      [loading]="dataSource.loading"
      [resolveHeader]="resolveHeader"
      [activeRow]="selection()"
      (rowClick)="onRowClick($event)"
    >
      <ng-container *wattTableCell="columns.name; let row">
        {{ row.name }}
      </ng-container>

      <ng-container *wattTableCell="columns.email; let row">
        {{ row.email }}
      </ng-container>

      <ng-container *wattTableCell="columns.phoneNumber; let row">
        {{ row.phoneNumber | dhEmDashFallback }}
      </ng-container>

      <ng-container *wattTableCell="columns.latestLoginAt; let row">
        <dh-user-latest-login [latestLoginAt]="row.latestLoginAt" />
      </ng-container>

      <ng-container *wattTableCell="columns.status; let row">
        <dh-user-status [status]="row.status" />
      </ng-container>
    </watt-table>
  </watt-data-table>`,
})
export class DhUsersComponent {
  private dataTable = viewChild.required(WattDataTableComponent);
  private navigation = inject(DhNavigationService);

  columns: WattTableColumnDef<DhUser> = {
    name: { accessor: 'name' },
    email: { accessor: 'email' },
    phoneNumber: { accessor: 'phoneNumber' },
    latestLoginAt: { accessor: 'latestLoginAt' },
    status: { accessor: 'status' },
  };

  open = output<DhUser>();
  invite = output<void>();

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };

  variables = signal<Variables>({});

  dataSource = new GetUsersDataSource({
    skip: true,
    variables: {
      sortDirection: MarketParticipantSortDirctionType.Asc,
      sortProperty: UserOverviewSortProperty.FirstName,
    },
  });

  fetch = (variables: Variables) => {
    // Empty the table in order to show loading state
    // TODO: Come up with a solution that doesn't require calling this method
    this.dataSource.reset();
    this.dataSource.refetch(variables);
    this.variables.set(variables);
  };

  reset(): void {
    this.dataSource.reset();
    this.dataTable().reset();
  }

  onRowClick(row: DhUser): void {
    this.open.emit(row);
  }
}
