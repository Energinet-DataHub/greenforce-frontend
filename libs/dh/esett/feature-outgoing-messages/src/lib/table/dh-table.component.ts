import { Component, input, output, ViewChild } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { Sort } from '@angular/material/sort';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { DhOutgoingMessage } from '../dh-outgoing-message';
import { DhOutgoingMessageDrawerComponent } from '../drawer/dh-outgoing-message-drawer.component';
import { DhOutgoingMessageStatusBadgeComponent } from '../status-badge/dh-outgoing-message-status-badge.component';

@Component({
  selector: 'dh-outgoing-messages-table',
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
    TranslocoPipe,

    WATT_TABLE,
    WattEmptyStateComponent,
    WattDatePipe,
    VaterFlexComponent,
    VaterStackComponent,

    DhOutgoingMessageDrawerComponent,
    DhOutgoingMessageStatusBadgeComponent,
    DhEmDashFallbackPipe,
  ],
})
export class DhOutgoingMessagesTableComponent {
  activeRow: DhOutgoingMessage | undefined = undefined;

  @ViewChild(DhOutgoingMessageDrawerComponent)
  drawer: DhOutgoingMessageDrawerComponent | undefined;

  columns: WattTableColumnDef<DhOutgoingMessage> = {
    lastDispatched: { accessor: 'lastDispatched' },
    id: { accessor: 'documentId' },
    energySupplier: { accessor: null },
    calculationType: { accessor: 'calculationType' },
    messageType: { accessor: 'timeSeriesType' },
    gridArea: { accessor: 'gridArea' },
    gridAreaCodeOut: { accessor: null },
    status: { accessor: 'documentStatus' },
  };

  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();
  tableDataSource = input.required<WattTableDataSource<DhOutgoingMessage>>();
  sortMetadata = input.required<Sort>();

  sortChange = output<Sort>();

  onRowClick(activeRow: DhOutgoingMessage): void {
    this.activeRow = activeRow;
    this.drawer?.open(activeRow.documentId);
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
