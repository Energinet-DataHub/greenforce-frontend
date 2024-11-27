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
  OnChanges,
  input,
  output,
  viewChild,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
  WattTableComponent,
} from '@energinet-datahub/watt/table';

import { PermissionDetailsDto } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-permissions-table',
  standalone: true,
  template: `<ng-container *transloco="let t; read: 'admin.userManagement.permissionsTable'">
    @if (permissions().length > 0) {
      <watt-table
        description="permissions"
        [dataSource]="dataSource"
        [columns]="columns"
        [selectable]="true"
        [loading]="loading()"
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
    } @else {
      <!-- Empty -->
      <vater-flex direction="column" offset="m" justify="center">
        <watt-empty-state
          [icon]="hasError() ? 'custom-power' : 'custom-no-results'"
          size="small"
          [title]="hasError() ? 'shared.error.title' : ('shared.empty.title' | transloco)"
          [message]="hasError() ? 'shared.error.message' : ('' | transloco)"
        />
      </vater-flex>
    }
  </ng-container>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    WATT_TABLE,
    WattEmptyStateComponent,
    VaterFlexComponent,
    TranslocoPipe,
  ],
})
export class DhPermissionsTableComponent implements OnChanges {
  permissions = input<PermissionDetailsDto[]>([]);
  loading = input.required<boolean>();
  hasError = input.required<boolean>();
  initialSelection = input<PermissionDetailsDto[]>([]);

  selectionChanged = output<PermissionDetailsDto[]>();

  permissionsTable = viewChild(WattTableComponent);

  readonly dataSource = new WattTableDataSource<PermissionDetailsDto>();

  columns: WattTableColumnDef<PermissionDetailsDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  ngOnChanges(): void {
    this.dataSource.data = this.permissions();

    if (this.permissionsTable()) {
      this.permissionsTable()?.clearSelection();
    }
  }
}
