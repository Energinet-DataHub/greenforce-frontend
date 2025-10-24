import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { ActorUserRole } from '@energinet-datahub/dh/admin/data-access-api';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhUserByIdMarketParticipant } from './types';

@Component({
  selector: 'dh-user-roles-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, WATT_TABLE],
  styles: ``,
  template: `
    <watt-table
      *transloco="let t; prefix: 'admin.userManagement.tabs.roles'"
      [dataSource]="dataSource"
      [selection]="initialSelection"
      [columns]="columns"
      sortBy="name"
      sortDirection="asc"
      [selectable]="selectMode()"
      (selectionChange)="selectionChanged.emit($event)"
    >
      <ng-container
        *wattTableCell="columns['name']; header: t('assigned.columns.name'); let element"
      >
        {{ element.name }}
      </ng-container>
      <ng-container
        *wattTableCell="
          columns['description'];
          header: t('assigned.columns.description');
          let element
        "
      >
        {{ element.description }}
      </ng-container>
    </watt-table>
  `,
})
export class DhUserRolesTableComponent {
  readonly dataSource = new WattTableDataSource<ActorUserRole>([]);
  initialSelection: DhUserByIdMarketParticipant['userRoles'] = [];

  columns: WattTableColumnDef<ActorUserRole> = {
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  actor = input.required<DhUserByIdMarketParticipant>();
  selectMode = input.required<boolean>();

  selectionChanged = output<ActorUserRole[]>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.actor().userRoles.filter(
        (userRole) => userRole.assigned || this.selectMode()
      );

      if (this.selectMode()) {
        this.initialSelection = this.actor().userRoles.filter((userRole) => userRole.assigned);
      }
    });
  }
}
