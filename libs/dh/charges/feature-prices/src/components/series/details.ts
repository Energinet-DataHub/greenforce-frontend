import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, viewChild } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  ChargeSeries,
  ChargeResolution,
  ChargeSeriesPoint,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { WATT_MENU } from '@energinet/watt/menu';
import { WattBadgeComponent } from '@energinet/watt/badge';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDataTableComponent } from '@energinet/watt/data';
import { WattDatePipe, WattRange } from '@energinet/watt/core/date';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet/watt/drawer';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';

import { Charge } from '../../types';
import formatTime from '../../format-time';

@Component({
  selector: 'dh-charge-series-details',
  imports: [
    WATT_MENU,
    WATT_TABLE,
    WATT_DRAWER,
    WATT_DESCRIPTION_LIST,

    WattDatePipe,
    WattBadgeComponent,
    WattButtonComponent,
    WattDataTableComponent,

    DecimalPipe,
    TranslocoDirective,
  ],
  template: `
    <watt-drawer size="small" *transloco="let t; prefix: 'charges.series.details'">
      <watt-drawer-heading>
        <h1>{{ chargeIdName() }}</h1>
        <watt-description-list variant="inline-flow">
          <watt-description-list-item [label]="t('time')">
            @switch (resolution()) {
              @case ('Daily') {
                {{ currentPoint()?.fromDateTime | wattDate }}
              }
              @case ('Monthly') {
                {{ currentPoint()?.fromDateTime | wattDate: 'monthYear' }}
              }
              @default {
                {{ currentPoint()?.fromDateTime | wattDate }} -
                {{ formatTime(index(), resolution()) }}
              }
            }
          </watt-description-list-item>
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-content>
        <watt-data-table inset="0" [autoSize]="true" [header]="false" [enablePaginator]="false">
          <watt-table
            *transloco="let resolveHeader; prefix: 'charges.series.details.columns'"
            [resolveHeader]="resolveHeader"
            [columns]="columns"
            [dataSource]="dataSource"
            [stickyFooter]="true"
          >
            <ng-container *wattTableCell="columns.time; let series">
              {{ series.fromDateTime | wattDate }}
            </ng-container>
            <ng-container *wattTableCell="columns.price; let series">
              {{ series.price | number: '1.6-6' }}
            </ng-container>
            <ng-container *wattTableCell="columns.status; let series">
              @if (series.fromDateTime.getTime() === currentPoint()?.fromDateTime?.getTime()) {
                <watt-badge type="success">{{ t('current') }}</watt-badge>
              }
            </ng-container>
            <ng-container *wattTableCell="columns.menu">
              <watt-button variant="icon" [wattMenuTriggerFor]="menu" icon="moreVertical" />
              <watt-menu #menu>
                <watt-menu-item> Kopier besked-ID </watt-menu-item>
                <watt-menu-item> Gå til besked </watt-menu-item>
              </watt-menu>
            </ng-container>
          </watt-table>
        </watt-data-table>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhChargeSeriesDetailsComponent {
  private series = signal<ChargeSeries | null>(null);

  protected points = computed(() => this.series()?.points ?? []);
  protected currentPoint = computed(() => this.series()?.currentPoint);
  protected currentPointTime = computed<WattRange<Date>>(() => ({
    start: this.currentPoint()?.fromDateTime!,
    end: this.currentPoint()?.toDateTime ?? null,
  }));

  protected resolution = signal<ChargeResolution>('Unknown');
  protected index = signal<number>(0);
  protected charge = signal<Charge | null>(null);
  protected chargeIdName = computed(() => `${this.charge()?.code} • ${this.charge()?.name}`);

  protected dataSource = new WattTableDataSource<ChargeSeriesPoint>();

  protected drawer = viewChild.required(WattDrawerComponent);

  protected columns = {
    price: { accessor: (row) => row.price },
    time: { accessor: (row) => row.fromDateTime },
    status: { accessor: (row) => row.fromDateTime, header: '' },
    menu: { accessor: null, header: '' },
  } satisfies WattTableColumnDef<ChargeSeriesPoint>;

  protected formatTime = (index: number, resolution: ChargeResolution) =>
    formatTime(index, resolution);

  open(index: number, series: ChargeSeries, resolution: ChargeResolution, charge: Charge) {
    this.series.set(series);
    this.index.set(index);
    this.charge.set(charge);
    this.resolution.set(resolution);
    this.dataSource.data = series.points;
    this.drawer().open();
  }
}
