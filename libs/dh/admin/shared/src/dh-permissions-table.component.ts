import {
  input,
  output,
  effect,
  Component,
  viewChild,
  ChangeDetectionStrategy,
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
  standalone: true,
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
    effect(() => {
      this.dataSource.data = this.permissions();
    });
  }
}
