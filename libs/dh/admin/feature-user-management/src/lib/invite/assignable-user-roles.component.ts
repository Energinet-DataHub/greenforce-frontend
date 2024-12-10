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
import { FormsModule } from '@angular/forms';
import { Component, effect, input, output, viewChild } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  WattTableColumnDef,
  WattTableDataSource,
  WATT_TABLE,
  WattTableComponent,
} from '@energinet-datahub/watt/table';

import { UserRoleItem } from '@energinet-datahub/dh/admin/data-access-api';
import { GetUserRolesByActorIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-assignable-user-roles',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoPipe,
    MatDividerModule,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WattEmptyStateComponent,
  ],
  styles: `
    watt-empty-state {
      padding: var(--watt-space-xl);
    }
  `,
  template: `<watt-card *transloco="let t; read: 'admin.userManagement.inviteUser'" variant="solid">
    <watt-card-title>
      <h4>
        @if (dataSource.totalCount === 1) {
          {{ t('singular', { userRolesCount: dataSource.totalCount }) }}
        } @else {
          {{ t('plural', { userRolesCount: dataSource.totalCount }) }}
        }
      </h4>
    </watt-card-title>

    @if (hasError()) {
      <watt-empty-state
        icon="custom-power"
        [title]="'shared.error.title' | transloco"
        [message]="'shared.error.message' | transloco"
      />
    } @else {
      <watt-table
        [dataSource]="dataSource"
        [loading]="isLoading()"
        [columns]="columns"
        sortDirection="asc"
        [selectable]="true"
        (selectionChange)="selectionChanged($event)"
      >
        <ng-container *wattTableCell="columns['name']; header: t('columns.name'); let element">
          {{ element.name }}
        </ng-container>

        <ng-container
          *wattTableCell="columns['description']; header: t('columns.description'); let element"
        >
          {{ element.description }}
        </ng-container>
      </watt-table>
    }
  </watt-card>`,
})
export class DhAssignableUserRolesComponent {
  private table = viewChild.required(WattTableComponent);

  actorId = input.required<string>();

  assignableUserRolesQuery = lazyQuery(GetUserRolesByActorIdDocument);

  isLoading = this.assignableUserRolesQuery.loading;
  hasError = this.assignableUserRolesQuery.hasError;

  dataSource = new WattTableDataSource<UserRoleItem>([]);

  selectedUserRoles = output<UserRoleItem[]>();

  constructor() {
    effect(() => this.assignableUserRolesQuery.query({ variables: { actorId: this.actorId() } }));
    effect(() => {
      this.dataSource.data = this.assignableUserRolesQuery.data()?.userRolesByActorId ?? [];
      this.table().clearSelection();
    });
  }

  columns: WattTableColumnDef<UserRoleItem> = {
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  selectionChanged(userRoles: UserRoleItem[]) {
    this.selectedUserRoles.emit(userRoles);
  }
}
