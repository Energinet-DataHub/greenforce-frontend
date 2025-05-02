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
import { Component, computed, effect, inject, input, LOCALE_ID, output } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WattDatePipe, WattSupportedLocales } from '@energinet-datahub/watt/date';
import { WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetMeasurementPointsDocument,
  MeteringPointSubType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { Quality } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';

import { MeasurementPosition } from '../../types';
import { DhFormatObservationTimePipe } from './dh-format-observation-time.pipe';
import { dhFormatMeasurementNumber } from '../../utils/dh-format-measurement-number';

type MeasurementColumns = {
  quantity: string;
  quality: Quality;
  registrationTime: Date;
  registeredInDataHub: Date;
  isCurrent: boolean;
};

@Component({
  selector: 'dh-measurements-day-details',
  standalone: true,
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_DRAWER,
    WATT_TABLE,
    WattDatePipe,
    WattBadgeComponent,
    WattDataTableComponent,
    VaterStackComponent,
    DhFormatObservationTimePipe,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      watt-data-table {
        display: block;
        margin: var(--watt-space-ml);
      }
    `,
  ],
  template: `
    @let measurementPositionView = measurementPosition();

    <watt-drawer
      #drawer
      [autoOpen]="measurementPositionView.index"
      [key]="measurementPositionView.index"
      [animateOnKeyChange]="true"
      (closed)="closed.emit()"
      [loading]="query.loading()"
      *transloco="let t; read: 'meteringPoint.measurements.drawer'"
    >
      <watt-drawer-heading>
        @if (measurementPositionView) {
          <h2 class="watt-space-stack-m">{{ selectedDay() | wattDate: 'short' }}</h2>

          <vater-stack direction="row" gap="ml">
            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('position') }}</span>
              <span>{{ measurementPositionView.index }}</span>
            </vater-stack>

            @let current = measurementPositionView.current;
            @if (current) {
              <vater-stack direction="row" gap="s">
                <span class="watt-label">{{ t('observationTime') }}</span>
                <span>{{
                  measurementPositionView.observationTime
                    | dhFormatObservationTime: current.resolution
                }}</span>
              </vater-stack>
            }
          </vater-stack>
        }
      </watt-drawer-heading>

      @if (drawer.isOpen()) {
        <watt-drawer-content>
          <watt-data-table
            *transloco="let resolveHeader; read: 'meteringPoint.measurements.drawer.columns'"
            variant="solid"
            [enableCount]="false"
            [enableSearch]="false"
            [enablePaginator]="false"
          >
            <watt-table
              [columns]="columns"
              [displayedColumns]="displayedColumns()"
              [dataSource]="dataSource"
              [resolveHeader]="resolveHeader"
              [loading]="loading()"
              [sortBy]="sortBy()"
              [sortClear]="false"
              sortDirection="desc"
            >
              <ng-container *wattTableCell="columns.quantity; let element">
                @if (element.quality === Quality.Estimated) {
                  ≈
                }
                {{ formatNumber(element.quantity) }}
              </ng-container>

              <ng-container *wattTableCell="columns.registrationTime; let element">
                {{ element.registrationTime | wattDate: 'long' }}
              </ng-container>

              <ng-container *wattTableCell="columns.registeredInDataHub; let element">
                {{ element.registeredInDataHub | wattDate: 'long' }}
              </ng-container>

              <ng-container *wattTableCell="columns.isCurrent; let element">
                @if (element.isCurrent) {
                  <watt-badge type="neutral">
                    {{ 'meteringPoint.measurements.drawer.currentValueBadge' | transloco }}
                  </watt-badge>
                }
              </ng-container>
            </watt-table>
          </watt-data-table>
        </watt-drawer-content>
      }
    </watt-drawer>
  `,
})
export class DhMeasurementsDayDetailsComponent {
  private locale = inject<WattSupportedLocales>(LOCALE_ID);

  protected query = query(GetMeasurementPointsDocument, () => ({
    variables: {
      index: this.measurementPosition().index,
      date: this.selectedDay(),
      meteringPointId: this.meteringPointId(),
    },
  }));

  private subType = computed(() => this.query.data()?.meteringPoint.metadata.subType);

  loading = this.query.loading;

  selectedDay = input.required<string>();
  meteringPointId = input.required<string>();
  measurementPosition = input.required<MeasurementPosition>();
  meteringPointType = input<string>();

  closed = output<void>();

  dataSource = new WattTableDataSource<MeasurementColumns>([]);

  displayedColumns = computed(() => {
    const columns = Object.keys(this.columns);

    if (this.subType() === MeteringPointSubType.Calculated) {
      return columns.filter((column) => column !== 'registrationTime');
    }

    return columns;
  });

  sortBy = computed(() => {
    if (this.query.data()?.measurementPoints.length === 0) return '';

    if (this.subType() === MeteringPointSubType.Calculated) {
      return 'registeredInDataHub';
    }

    return 'registrationTime';
  });

  columns: WattTableColumnDef<MeasurementColumns> = {
    quantity: {
      accessor: (row) => this.formatNumber(row.quantity),
      align: 'right',
    },
    registrationTime: {
      accessor: 'registrationTime',
    },
    registeredInDataHub: {
      accessor: 'registeredInDataHub',
    },
    isCurrent: {
      accessor: null,
      header: '',
    },
  };

  Quality = Quality;

  constructor() {
    effect(() => {
      this.dataSource.data =
        this.query.data()?.measurementPoints.map((measurement, index) => ({
          quantity: measurement.quantity,
          quality: measurement.quality,
          registrationTime: measurement.registrationTime,
          registeredInDataHub: measurement.persistedTime,
          isCurrent: index === 0,
        })) ?? [];
    });
  }

  formatNumber(value: string) {
    return dhFormatMeasurementNumber(value, this.locale);
  }
}
