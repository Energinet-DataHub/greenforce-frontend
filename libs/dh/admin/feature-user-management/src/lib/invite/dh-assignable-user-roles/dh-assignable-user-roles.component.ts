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
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, output, viewChild } from '@angular/core';

import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';

import { MatDividerModule } from '@angular/material/divider';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
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
    RxLet,
    RxPush,
    FormsModule,
    TranslocoPipe,
    NgTemplateOutlet,
    MatDividerModule,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WattSpinnerComponent,
    WattEmptyStateComponent,
  ],
  styleUrls: ['./dh-assignable-user-roles.component.scss'],
  templateUrl: './dh-assignable-user-roles.component.html',
})
export class DhAssignableUserRolesComponent {
  private readonly userRolesTable = viewChild<WattTableComponent<UserRoleItem>>(WattTableComponent);

  actorId = input.required<string>();

  assignableUserRoles = lazyQuery(GetUserRolesByActorIdDocument);

  readonly isLoading = computed(() => this.assignableUserRoles.loading());
  readonly hasError = computed(() => this.assignableUserRoles.error());

  readonly dataSource = new WattTableDataSource<UserRoleItem>([]);

  readonly selectedUserRoles = output<UserRoleItem[]>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.assignableUserRoles.data()?.userRolesByActorId ?? [];

      this.userRolesTable()?.clearSelection();
    });

    effect(() => this.assignableUserRoles.query({ variables: { actorId: this.actorId() } }));
  }

  columns: WattTableColumnDef<UserRoleItem> = {
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  selectionChanged(userRoles: UserRoleItem[]) {
    this.selectedUserRoles.emit(userRoles);
  }
}
