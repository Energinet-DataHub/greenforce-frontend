import { TranslocoDirective } from '@ngneat/transloco';

import { Component, OnInit, input } from '@angular/core';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { MeteringGridAreaImbalancePerDayDto } from '../dh-metering-gridarea-imbalance';
import { DecimalPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'dh-metering-gridarea-imbalance-table',
  template: `<vater-flex
    fill="vertical"
    scrollable
    *transloco="let t; read: 'eSett.meteringGridAreaImbalance.drawer.table'"
    ><watt-table [columns]="columns" [dataSource]="data()!">
      <ng-container
        *wattTableCell="columns['imbalanceDay']; header: t('columns.date'); let imbalance"
      >
        {{ imbalance.imbalanceDay | wattDate: 'short' }}
      </ng-container>

      <ng-container *wattTableCell="columns['time']; header: t('columns.time'); let imbalance">
        {{ imbalance.firstOccurrenceOfImbalance | wattDate: 'time' }} ({{
          t('columns.position') + imbalance.firstPositionOfImbalance
        }})
      </ng-container>

      <ng-container
        *wattTableCell="columns['quantity']; header: t('columns.imbalance'); let imbalance"
      >
        {{ imbalance.quantity | number: '1.3-6' }}
      </ng-container>
    </watt-table>
  </vater-flex>`,
  styles: `
    watt-table {
      margin: var(--watt-space-m) 0;
    }
  `,
  imports: [WATT_TABLE, VaterFlexComponent, DecimalPipe, WattDatePipe, TranslocoDirective],
})
export class DhDrawerImbalanceTableComponent implements OnInit {
  data = input<WattTableDataSource<MeteringGridAreaImbalancePerDayDto>>();

  columns!: WattTableColumnDef<MeteringGridAreaImbalancePerDayDto>;

  ngOnInit(): void {
    this.columns = {
      imbalanceDay: { accessor: 'imbalanceDay', sort: false },
      time: { accessor: 'firstOccurrenceOfImbalance', sort: false },
      quantity: { accessor: 'quantity', sort: false, align: 'right' },
    };
  }
}
