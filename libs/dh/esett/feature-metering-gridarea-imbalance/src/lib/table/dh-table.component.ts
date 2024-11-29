import { Component, viewChild, input, output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { DhMeteringGridAreaImbalance } from '../dh-metering-gridarea-imbalance';
import { DhMeteringGridAreaImbalanceDrawerComponent } from '../drawer/dh-drawer.component';

@Component({
  selector: 'dh-metering-gridarea-imbalance-table',
  standalone: true,
  templateUrl: './dh-table.component.html',
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
    WattDatePipe,
    WattEmptyStateComponent,

    VaterFlexComponent,
    VaterStackComponent,

    DhEmDashFallbackPipe,
    DhMeteringGridAreaImbalanceDrawerComponent,
  ],
})
export class DhMeteringGridAreaImbalanceTableComponent {
  activeRow: DhMeteringGridAreaImbalance | undefined = undefined;

  drawer = viewChild.required(DhMeteringGridAreaImbalanceDrawerComponent);

  columns: WattTableColumnDef<DhMeteringGridAreaImbalance> = {
    documentDateTime: { accessor: 'documentDateTime' },
    receivedDateTime: { accessor: 'receivedDateTime' },
    id: { accessor: 'id' },
    gridArea: { accessor: 'gridArea' },
    period: { accessor: null },
  };

  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

  tableDataSource = input.required<WattTableDataSource<DhMeteringGridAreaImbalance>>();

  sortMetadata = input.required<Sort>();

  sortChange = output<Sort>();

  onRowClick(activeRow: DhMeteringGridAreaImbalance): void {
    this.activeRow = activeRow;
    this.drawer().open(activeRow);
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
