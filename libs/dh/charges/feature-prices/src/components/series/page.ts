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
import { input, signal, computed, Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { translate, TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import {
  WattDataTableComponent,
  WattDataFiltersComponent,
  WattDataActionsComponent,
} from '@energinet/watt/data';
import { dayjs } from '@energinet/watt/core/date';
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import {
  ChargeSeries,
  ChargeResolution,
  ChargeSeriesPoint,
  GetChargeSeriesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  DhCircleComponent,
  DhDownloadButtonComponent,
  GenerateCSV,
} from '@energinet-datahub/dh/shared/ui-util';

import { DhChargesIntervalField } from '../interval-field';
import { DhChargeSeriesDetailsComponent } from './details';
import { DhChargesPeriodPipe } from '../../period-pipe';

@Component({
  selector: 'dh-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,
    WattDataActionsComponent,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WattSlideToggleComponent,
    WATT_TABLE,
    DhCircleComponent,
    DhChargeSeriesDetailsComponent,
    DhChargesIntervalField,
    DhChargesPeriodPipe,
    DhDownloadButtonComponent,
  ],
  template: `
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
        <vater-stack direction="row" align="baseline" gap="xl">
          <dh-charges-interval-field
            [resolution]="resolution()"
            (intervalChange)="query.refetch({ interval: $event })"
          />
          <watt-slide-toggle [(checked)]="showHistory">
            {{ t('showHistory') }}
          </watt-slide-toggle>
        </vater-stack>
      </watt-data-filters>

      <watt-data-actions>
        <dh-download-button (clicked)="download()" />
      </watt-data-actions>

      <watt-table
        *transloco="let resolveHeader; prefix: 'charges.series.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        (rowClick)="activeRow.set($event)"
        [activeRow]="activeRow()"
        [stickyFooter]="true"
      >
        @let dateHeader = t('resolution.' + resolution());
        <ng-container *wattTableCell="columns.date; header: dateHeader; let series">
          {{ series.period | dhChargesPeriod: resolution() }}
        </ng-container>
        <ng-container *wattTableCell="columns.price; let series">
          {{ series.price | number: '1.6-6' }}
        </ng-container>
        <ng-container *wattTableCell="columns.hasChanged; header: ''; let series">
          @if (series.hasChanged) {
            <dh-circle />
          }
        </ng-container>
        <ng-container *wattTableCell="columns.history; header: ''; let series">
          @if (showHistory()) {
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
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
    <dh-charge-series-details [(series)]="activeRow" [resolution]="resolution()" />
  `,
})
export class DhChargeSeriesPage {
  id = input.required<string>();
  resolution = input.required<ChargeResolution>();

  private transloco = inject(TranslocoService);
  protected query = query(GetChargeSeriesDocument, () => ({
    skip: true,
    variables: {
      chargeId: this.id(),
    },
  }));

  charge = computed(() => this.query.data()?.chargeById);
  series = computed(() => this.charge()?.series ?? []);

  activeRow = signal<ChargeSeries | undefined>(undefined);
  showHistory = signal(false);
  isHistoric = (point: ChargeSeriesPoint) => !point.isCurrent;

  dataSource = dataSource(() => this.series());
  columns: WattTableColumnDef<ChargeSeries> = {
    date: { accessor: null, sort: false },
    price: {
      accessor: (row) => row.points.find((r) => r.isCurrent)?.price,
      align: 'right',
      size: 'minmax(200px, auto)',
      sort: false,
    },
    hasChanged: {
      accessor: 'hasChanged',
      tooltip: this.transloco.translate('charges.series.columns.tooltip'),
      size: 'min-content',
      align: 'center',
      sort: false,
    },
    history: { accessor: null, size: '1fr', sort: false },
  };

  generateCSV = GenerateCSV.fromSignalArray(this.series);
  download = () => {
    const basePath = 'charges.series.csv.columns';
    this.generateCSV
      .addHeaders([
        `"${translate(basePath + '.owner')}"`,
        `"${translate(basePath + '.gln')}"`,
        `"${translate(basePath + '.type')}"`,
        `"${translate(basePath + '.id')}"`,
        `"${translate(basePath + '.resolution')}"`,
        `"${translate(basePath + '.from')}"`,
        `"${translate(basePath + '.to')}"`,
      ])
      .mapLines((series) =>
        series.map((x) => [
          `"${this.charge()?.owner?.name}"`,
          `"${this.charge()?.owner?.glnOrEicNumber}"`,
          `"${translate('charges.chargeTypes.' + this.charge()?.type)}"`,
          `"${this.charge()?.id}"`,
          `"${translate('charges.resolutions.' + this.charge()?.resolution)}"`,
          `"${dayjs(x.period.start).format('YYYY-MM-DDTHH:mm:ss')}"`,
          `"${dayjs(x.period.end).format('YYYY-MM-DDTHH:mm:ss')}"`,
          `"${x.price?.toFixed(6)}"`,
        ])
      )
      .generate('charges.series.csv.fileName');
  };
}
