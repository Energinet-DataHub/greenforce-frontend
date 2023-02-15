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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { translate } from '@ngneat/transloco';

import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
  WattTableComponent,
} from '@energinet-datahub/watt/table';
import { SelectablePermissionsDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-create-userrole-permissions-tab-table',
  standalone: true,
  templateUrl: './dh-create-userrole-permissions-tab-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [WATT_TABLE],
})
export class DhCreateRolePermissionTabTableComponent implements OnChanges {
  @Output() selectionChanged = new EventEmitter<SelectablePermissionsDto[]>();
  @Input() permissions: SelectablePermissionsDto[] = [];

  @ViewChild(WattTableComponent<SelectablePermissionsDto>)
  permissionsTable!: WattTableComponent<SelectablePermissionsDto>;

  readonly dataSource: WattTableDataSource<SelectablePermissionsDto> =
    new WattTableDataSource<SelectablePermissionsDto>();

  columns: WattTableColumnDef<SelectablePermissionsDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  translateHeader = (key: string) =>
    translate(
      `admin.userManagement.createrole.tabs.permissions.table.columns.${key}`
    );

  ngOnChanges() {
    this.dataSource.data = this.permissions;
    if (this.permissionsTable) this.permissionsTable.clearSelection();
  }

  onSelectionChange(selections: SelectablePermissionsDto[]): void {
    this.selectionChanged.emit(selections);
  }
}
