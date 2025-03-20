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
  output,
  Component,
  viewChild,
  ChangeDetectionStrategy,
  afterRenderEffect,
} from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import {
  WATT_TABLE,
  WattTableComponent,
  WattTableColumnDef,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';

import { PermissionDetailsDto } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-permissions-table',
  template: ` <dh-result
    [loading]="loading()"
    [hasError]="hasError()"
    [empty]="permissions().length === 0"
  >
    <watt-table
      *transloco="let t; read: 'admin.userManagement.permissionsTable'"
      description="permissions"
      [dataSource]="dataSource"
      [columns]="columns"
      [selectable]="true"
      [initialSelection]="initialSelection()"
      sortBy="name"
      sortDirection="asc"
      (selectionChange)="selectionChanged.emit($event)"
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
  </dh-result>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, WATT_TABLE, DhResultComponent],
})
export class DhPermissionsTableComponent {
  table = viewChild.required(WattTableComponent);
  permissions = input<PermissionDetailsDto[]>([]);
  loading = input.required<boolean>();
  hasError = input.required<boolean>();
  initialSelection = input<PermissionDetailsDto[]>([]);

  selectionChanged = output<PermissionDetailsDto[]>();

  permissionsTable = viewChild(WattTableComponent);

  dataSource = new WattTableDataSource<PermissionDetailsDto>();

  columns: WattTableColumnDef<PermissionDetailsDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  constructor() {
    afterRenderEffect(() => {
      // Clear selection when permissions change
      this.table().clearSelection();
      this.dataSource.data = this.permissions();
    });
  }
}
