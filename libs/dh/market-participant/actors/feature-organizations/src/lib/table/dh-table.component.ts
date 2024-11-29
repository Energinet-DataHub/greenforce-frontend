import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhOrganization } from '@energinet-datahub/dh/market-participant/actors/domain';

@Component({
  selector: 'dh-organizations-table',
  standalone: true,
  templateUrl: './dh-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WATT_TABLE,
    WattEmptyStateComponent,
    VaterFlexComponent,
    VaterStackComponent,
  ],
})
export class DhOrganizationsTableComponent {
  columns: WattTableColumnDef<DhOrganization> = {
    cvrOrBusinessRegisterId: { accessor: 'businessRegisterIdentifier' },
    name: { accessor: 'name' },
  };

  id = input<string>();
  dataSource = input.required<WattTableDataSource<DhOrganization>>();
  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

  selectedRow = output<DhOrganization>();

  getActiveRow = () => this.dataSource().filteredData.find((row) => row.id === this.id());
}
