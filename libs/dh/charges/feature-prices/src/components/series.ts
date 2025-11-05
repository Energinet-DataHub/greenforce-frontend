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
import { input, signal, effect, computed, Component, ChangeDetectionStrategy } from '@angular/core';

import { translate, TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';

import {
  WattDataTableComponent,
  WattDataFiltersComponent,
  WattDataActionsComponent,
} from '@energinet/watt/data';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';

import {
  ChargeSeries,
  ChargeSeriesPoint,
  GetChargeSeriesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhCircleComponent, GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';

import formatTime from '../format-time';
import { DhChargesIntervalField } from './interval-field';
import { DhChargeSeriesDetailsComponent } from './series/details';
import { DateRange } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    TranslocoPipe,
    TranslocoDirective,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_TABLE,
    WattButtonComponent,
    WattSpinnerComponent,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,
    DhCircleComponent,
    DhChargesIntervalField,
    DhChargeSeriesDetailsComponent,
  ],
  template: `
    @if (resolution(); as resolution) {
      <watt-data-table
        vater
        inset="ml"
        gap="ml"
        [error]="query.error()"
        [ready]="query.called()"
        [enablePaginator]="false"
        [enableCount]="false"
        [enableSearch]="false"
        *transloco="let t; prefix: 'charges.series'"
      >
        <watt-data-filters>
          <dh-charges-interval-field [resolution]="resolution" />
        </watt-data-filters>

        <watt-data-actions>
          <watt-button icon="download" variant="text" (click)="download()">{{
            'shared.download' | transloco
          }}</watt-button>
        </watt-data-actions>

        <watt-table
          *transloco="let t; prefix: 'charges.series.columns'"
          [resolveHeader]="t"
          [columns]="columns"
          [dataSource]="dataSource"
          [loading]="query.loading()"
          (rowClick)="
            activeRow.set($event); details.open(getIndex($event), $event, resolution, charge())
          "
          [activeRow]="activeRow()"
          [stickyFooter]="true"
        >
          <ng-container *wattTableCell="columns.date; header: t(resolution); let _; let i = index">
            {{ formatTime(i) }}
          </ng-container>
          <ng-container *wattTableCell="columns.price; header: t(resolution); let series">
            {{ getCurrentPrice(series) | number: '1.6-6' }}
          </ng-container>
          <ng-container *wattTableCell="columns.hasChanged; header: ''; let series">
            @if (series.hasChanged) {
              <dh-circle />
            }
          </ng-container>
          <ng-container *wattTableCell="columns.history; header: ''; let series">
            <vater-stack scrollable direction="row" gap="ml">
              @for (point of series.points.filter(isHistoric); track $index) {
                <span
                  class="watt-on-light--medium-emphasis"
                  style="text-align: right;"
                  [style.flexBasis.px]="120"
                >
                  {{ point.price | number: '1.6-6' }}
                </span>
              }
            </vater-stack>
          </ng-container>
        </watt-table>
      </watt-data-table>
    } @else {
      <vater-flex fill="both">
        <watt-spinner vater center />
      </vater-flex>
    }
    <dh-charge-series-details #details (closed)="activeRow.set(undefined)" />
  `,
})
export class DhChargeSeriesPage {
  private series = computed(() => this.query.data()?.chargeById?.series ?? []);
  private generateCSV = GenerateCSV.fromSignalArray(this.series);

  id = input.required<string>();
  resolution = computed(() => this.charge()?.resolution);
  query = query(GetChargeSeriesDocument, () => ({
    variables: {
      chargeId: this.id(),
      interval: null as DateRange | null,
    },
  }));

  charge = computed(() => this.query.data()?.chargeById);
  dataSource = new WattTableDataSource<ChargeSeries>();

  columns: WattTableColumnDef<ChargeSeries> = {
    date: { accessor: null, sort: false },
    price: {
      accessor: (row) => row.points.find((r) => r.isCurrent)?.price,
      align: 'right',
      sort: false,
    },
    hasChanged: {
      accessor: 'hasChanged',
      tooltip: 'What', // TODO: Fix
      size: 'min-content',
      align: 'center',
      sort: false,
    },
    history: { accessor: null, size: '1fr', sort: false },
  };

  activeRow = signal<ChargeSeries | undefined>(undefined);

  getIndex = (selectedSeries: ChargeSeries) => this.series().indexOf(selectedSeries) ?? 0;

  isHistoric = (point: ChargeSeriesPoint) => !point.isCurrent;

  formatTime = (index: number) =>
    formatTime(index, this.resolution(), this.query.variables().interval?.start);

  getCurrentPrice(series: ChargeSeries): number | undefined {
    return series.points.find((point) => point.isCurrent)?.price;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.series();
    });
  }

  download() {
    const basePath = 'charges.series.csv.columns';

    this.generateCSV
      .addHeaders([
        `"${translate(basePath + '.owner')}"`,
        `"${translate(basePath + '.type')}"`,
        `"${translate(basePath + '.id')}"`,
        `"${translate(basePath + '.resolution')}"`,
        `"${translate(basePath + '.from')}"`,
        `"${translate(basePath + '.to')}"`,
      ])
      .mapLines((series) =>
        series.map((x) => [
          `"${this.charge()?.owner}"`,
          `"${translate('charges.chargeTypes.' + this.charge()?.chargeType)}"`,
          `"${this.charge()?.id}"`,
          `"${translate('charges.resolutions.' + this.charge()?.resolution)}"`,
          `"${x.currentPoint.fromDateTime.toISOString()}"`,
          `"${x.currentPoint.toDateTime.toISOString()}"`,
          `"${x.currentPoint.price.toPrecision(6)}"`,
        ])
      )
      .generate('charges.series.csv.fileName');
  }
}
