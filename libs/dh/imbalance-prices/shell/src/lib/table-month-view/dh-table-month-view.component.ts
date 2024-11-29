import { Component, input, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhImbalancePrice } from '../dh-imbalance-prices';
import { DhStatusBadgeComponent } from '../status-badge/dh-status-badge.component';
import { DhImbalancePricesDrawerComponent } from '../drawer/dh-drawer.component';

@Component({
  selector: 'dh-table-month-view',
  standalone: true,
  templateUrl: './dh-table-month-view.component.html',
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
    WattDatePipe,
    VaterFlexComponent,
    VaterStackComponent,

    DhStatusBadgeComponent,
    DhImbalancePricesDrawerComponent,
  ],
})
export class DhTableMonthViewComponent {
  columns: WattTableColumnDef<DhImbalancePrice> = {
    period: { accessor: 'name' },
    priceArea: { accessor: 'priceAreaCode' },
    status: { accessor: 'status' },
  };

  activeRow = signal<DhImbalancePrice | undefined>(undefined);

  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

  tableDataSource = input.required<WattTableDataSource<DhImbalancePrice>>();

  onRowClick(entry: DhImbalancePrice): void {
    this.activeRow.set(entry);
  }

  onClose(): void {
    this.activeRow.set(undefined);
  }
}
