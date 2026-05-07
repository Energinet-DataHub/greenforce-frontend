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
import { input, signal, computed, Component, ChangeDetectionStrategy } from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WattDataTableComponent, WattDataFiltersComponent } from '@energinet/watt/data';
import { dayjs } from '@energinet/watt/core/date';
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import {
  ChargeSeriesPoint,
  GetChargeSeriesDocument,
  ChargeSeriesPointChange,
  GetChargeByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  // DhCircleComponent,
  DhDownloadButtonComponent,
  GenerateCSV,
} from '@energinet-datahub/dh/shared/ui-util';
import {
  DhChargesIntervalField,
  DhChargeIntervalPipe,
} from '@energinet-datahub/dh/charges/feature-ui-shared';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';

import { DhChargesSeriesDetails } from './series-details';
import { DhChargesSeriesGaps } from './series-gaps';

@Component({
  selector: 'dh-charges-series-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    TranslocoDirective,
    VATER,
    WATT_TABLE,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WattSlideToggleComponent,
    // DhCircleComponent,
    DhChargesIntervalField,
    DhChargeIntervalPipe,
    DhChargesSeriesDetails,
    DhChargesSeriesGaps,
    DhDownloadButtonComponent,
    DhFeatureFlagDirective,
  ],
  template: `
    <watt-data-table
      vater
      inset="ml"
      [error]="chargeSeriesQuery.error()"
      [ready]="ready()"
      [enablePaginator]="false"
      [header]="false"
      *transloco="let t; prefix: 'charges.series'"
    >
      <watt-data-filters>
        <vater-stack fill="horizontal" wrap direction="row" align="start" gap="m">
          <dh-charges-interval-field [resolution]="resolution()" [(date)]="date" />
          @if (enableHistoryToggle()) {
            <watt-slide-toggle [(checked)]="showHistory">{{ t('showHistory') }}</watt-slide-toggle>
          }
          <dh-charges-series-gaps
            *dhFeatureFlag="'charges-missing-prices'"
            [id]="id()"
            [resolution]="resolution()"
            [(date)]="date"
          />
          <vater-spacer />
          <dh-download-button (click)="download()" />
        </vater-stack>
      </watt-data-filters>

      <watt-table
        *transloco="let resolveHeader; prefix: 'charges.series.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [dataSource]="dataSource"
        [loading]="chargeSeriesQuery.loading()"
        (rowClick)="activeRow.set($event)"
        [activeRow]="activeRow()"
        [stickyFooter]="true"
      >
        @let dateHeader = t('resolution.' + (resolution() ?? 'UNKNOWN'));
        <ng-container *wattTableCell="columns.date; header: dateHeader; let series">
          {{ series.interval | dhChargeInterval: resolution() }}
        </ng-container>
        <ng-container *wattTableCell="columns.price; let series">
          {{ series.price | number: '1.6-6' }}
        </ng-container>
        <!-- <ng-container *wattTableCell="columns.hasChanged; header: ''; let series">
          @if (series.hasChanged) {
            <dh-circle />
          }
        </ng-container> -->
        <ng-container *wattTableCell="columns.history; header: ''; let series">
          @if (showHistory()) {
            <vater-stack scrollable direction="row" gap="ml">
              @for (point of series.changes.filter(isHistoric); track $index) {
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
    <dh-charges-series-details [(series)]="activeRow" [resolution]="resolution()" />
  `,
})
export class DhChargesSeriesTable {
  id = input.required<string>();

  protected chargeByIdQuery = query(GetChargeByIdDocument, () => ({
    variables: { id: this.id() },
  }));

  protected date = signal<Date>(new Date());
  protected interval = computed(() => {
    const start = this.date();
    const resolution = this.resolution();
    if (!resolution) return undefined;
    switch (resolution) {
      case 'DAILY':
        return { start, end: dayjs(start).endOf('month').toDate() };
      case 'MONTHLY':
        return { start, end: dayjs(start).endOf('year').toDate() };
      case 'HOURLY':
      case 'QUARTER_HOURLY':
        return { start, end: dayjs(start).endOf('day').toDate() };
    }
  });

  protected chargeSeriesQuery = query(GetChargeSeriesDocument, () => {
    const interval = this.interval();
    if (!interval) return { skip: true };
    return {
      variables: {
        interval,
        chargeId: this.id(),
      },
    };
  });

  ready = computed(() => this.chargeByIdQuery.called() && this.chargeSeriesQuery.called());

  charge = computed(() => this.chargeByIdQuery.data()?.chargeById);
  resolution = computed(() => this.charge()?.resolution);
  series = computed(() => this.chargeSeriesQuery.data()?.chargeById?.series ?? []);

  activeRow = signal<ChargeSeriesPoint | undefined>(undefined);
  enableHistoryToggle = computed(() => this.series().some((point) => point.hasChanged));
  showHistory = signal(false);
  isHistoric = (change: ChargeSeriesPointChange) => !change.isCurrent;

  dataSource = dataSource(() => this.series());
  columns: WattTableColumnDef<ChargeSeriesPoint> = {
    date: { accessor: null, sort: false },
    price: {
      accessor: (row) => row.changes.find((r) => r.isCurrent)?.price,
      align: 'right',
      size: 'minmax(200px, auto)',
      sort: false,
    },
    // hasChanged: {
    //   accessor: 'hasChanged',
    //   tooltip: this.transloco.translate('charges.series.columns.tooltip'),
    //   size: 'min-content',
    //   align: 'center',
    //   sort: false,
    // },
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
          `"${this.charge()?.typeDisplayName}"`,
          `"${this.charge()?.code}"`,
          `"${translate('charges.resolutions.' + this.charge()?.resolution)}"`,
          `"${dayjs(x.interval.start).format('YYYY-MM-DDTHH:mm:ss')}"`,
          `"${dayjs(x.interval.end).format('YYYY-MM-DDTHH:mm:ss')}"`,
          `"${x.price?.toFixed(6)}"`,
        ])
      )
      .generate('charges.series.csv.fileName');
  };
}
