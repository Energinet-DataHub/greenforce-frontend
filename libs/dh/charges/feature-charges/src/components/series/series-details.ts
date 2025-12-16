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
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input, model } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattDataTableComponent } from '@energinet/watt/data';
import { WattDatePipe } from '@energinet/watt/core/date';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { WATT_MENU } from '@energinet/watt/menu';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import {
  ChargeSeries,
  ChargeResolution,
  ChargeSeriesPoint,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhChargesPeriodPipe } from '@energinet-datahub/dh/charges/ui-shared';

@Component({
  selector: 'dh-charges-series-details',
  imports: [
    DecimalPipe,
    TitleCasePipe,
    TranslocoDirective,
    WATT_DESCRIPTION_LIST,
    WATT_DRAWER,
    WATT_MENU,
    WATT_TABLE,
    // WattBadgeComponent,
    WattButtonComponent,
    WattDataTableComponent,
    WattDatePipe,
    DhChargesPeriodPipe,
  ],
  template: `
    <watt-drawer
      [autoOpen]="series()"
      [key]="series()"
      (closed)="series.set(undefined)"
      size="small"
      *transloco="let t; prefix: 'charges.series'"
    >
      <watt-drawer-heading>
        @switch (resolution()) {
          @case ('MONTHLY') {
            <h1>{{ start() | wattDate: 'monthYear' | titlecase }}</h1>
          }
          @case ('DAILY') {
            <h1>{{ start() | wattDate }}</h1>
          }
          @default {
            <h1>{{ start() | wattDate }}</h1>
            <watt-description-list variant="inline-flow">
              <watt-description-list-item [label]="t('resolution.' + resolution())">
                {{ series()?.period | dhChargesPeriod: resolution() }}
              </watt-description-list-item>
            </watt-description-list>
          }
        }
      </watt-drawer-heading>
      <watt-drawer-content>
        <watt-data-table [autoSize]="true" [header]="false" [enablePaginator]="false">
          <watt-table
            *transloco="let resolveHeader; prefix: 'charges.series.details.columns'"
            [resolveHeader]="resolveHeader"
            [columns]="columns"
            [dataSource]="dataSource"
          >
            <!-- <ng-container *wattTableCell="columns.time; let series">
              {{ series.fromDateTime | wattDate }}
            </ng-container> -->
            <ng-container *wattTableCell="columns.price; let series">
              {{ series.price | number: '1.6-6' }}
            </ng-container>
            <!-- <ng-container *wattTableCell="columns.status; let series">
              @if (series.isCurrent) {
                <watt-badge type="success">{{ t('details.current') }}</watt-badge>
              }
            </ng-container> -->
            <ng-container *wattTableCell="columns.menu">
              <watt-button variant="icon" [wattMenuTriggerFor]="menu" icon="moreVertical" />
              <watt-menu #menu>
                <watt-menu-item>{{ t('details.copyMessage') }}</watt-menu-item>
                <watt-menu-item>{{ t('details.navigateToMessage') }}</watt-menu-item>
              </watt-menu>
            </ng-container>
          </watt-table>
        </watt-data-table>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhChargesSeriesDetails {
  readonly resolution = input.required<ChargeResolution>();
  readonly series = model<ChargeSeries>();
  protected points = computed(() => this.series()?.points ?? []);
  protected start = computed(() => this.series()?.period.start);
  protected dataSource = dataSource(() => this.points());
  protected columns = {
    price: { accessor: (row) => row.price },
    // time: { accessor: (row) => row.fromDateTime },
    // status: { accessor: (row) => row.fromDateTime, header: '' },
    menu: { accessor: null, header: '' },
  } satisfies WattTableColumnDef<ChargeSeriesPoint>;
}
