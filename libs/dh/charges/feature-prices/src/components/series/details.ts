//#region License
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
//#endregion
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
import { WattDatePipe } from '@energinet/watt/core/date';
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
                <watt-menu-item> {{ t('copyMessage') }} </watt-menu-item>
                <watt-menu-item> {{ t('navigateToMessage') }} </watt-menu-item>
              </watt-menu>
            </ng-container>
          </watt-table>
        </watt-data-table>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhChargeSeriesDetailsComponent {
  private drawer = viewChild.required(WattDrawerComponent);
  private series = signal<ChargeSeries | null>(null);
  private charge = signal<Charge | null>(null);

  protected currentPoint = computed(() => this.series()?.currentPoint);
  protected resolution = signal<ChargeResolution>('Unknown');
  protected index = signal<number>(0);
  protected chargeIdName = computed(() => `${this.charge()?.code} • ${this.charge()?.name}`);
  protected dataSource = new WattTableDataSource<ChargeSeriesPoint>();

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
