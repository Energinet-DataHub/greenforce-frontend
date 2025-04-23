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

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe, WattSupportedLocales } from '@energinet-datahub/watt/date';
import { Quality } from '@energinet-datahub/dh/shared/domain/graphql';

import { MeasurementPosition } from '../../types';
import { DhFormatObservationTimePipe } from './dh-format-observation-time.pipe';
import { dhFormatNumber } from '../../utils/dh-format-number';

type MeasurementColumns = {
  quantity: string;
  quality: Quality | undefined;
  registeredByGridAccessProvider: string;
  registeredInDataHub: Date | undefined;
  isCurrent: boolean;
};

@Component({
  selector: 'dh-drawer-day-view',
  standalone: true,
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_DRAWER,
    WATT_TABLE,
    WATT_CARD,
    WattDatePipe,
    WattBadgeComponent,
    VaterStackComponent,
    DhFormatObservationTimePipe,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      watt-card {
        margin: var(--watt-space-ml);
      }
    `,
  ],
  template: `
    @let measurementView = measurement();

    <watt-drawer
      #drawer
      [autoOpen]="measurement()?.index"
      [key]="measurement()?.index"
      [animateOnKeyChange]="true"
      (closed)="closed.emit()"
      *transloco="let t; read: 'meteringPoint.measurements.drawer'"
    >
      <watt-drawer-heading>
        @if (measurementView) {
          <h2 class="watt-space-stack-m">{{ selectedDay() | wattDate: 'short' }}</h2>

          <vater-stack direction="row" gap="ml">
            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('position') }}</span>
              <span>{{ measurementView.index }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('observationTime') }}</span>
              <span>{{
                measurementView.observationTime
                  | dhFormatObservationTime: measurementView.current.resolution
              }}</span>
            </vater-stack>
          </vater-stack>
        }
      </watt-drawer-heading>

      @if (drawer.isOpen()) {
        <watt-drawer-content>
          <watt-card
            variant="solid"
            *transloco="let resolveHeader; read: 'meteringPoint.measurements.drawer.columns'"
          >
            <watt-table
              [columns]="columns()"
              [dataSource]="dataSource"
              [resolveHeader]="resolveHeader"
            >
              <ng-container *wattTableCell="columns().quantity; let element">
                @if (element.quality === Quality.Estimated) {
                  ≈
                }
                {{ formatNumber(element.quantity) }}
              </ng-container>

              <ng-container *wattTableCell="columns().registeredInDataHub; let element">
                {{ element.registeredInDataHub | wattDate: 'long' }}
              </ng-container>

              <ng-container *wattTableCell="columns().isCurrent; let element">
                @if (element.isCurrent) {
                  <watt-badge type="neutral">
                    {{ 'meteringPoint.measurements.drawer.currentValueBadge' | transloco }}
                  </watt-badge>
                }
              </ng-container>
            </watt-table>
          </watt-card>
        </watt-drawer-content>
      }
    </watt-drawer>
  `,
})
export class DhDrawerDayViewComponent {
  locale = inject<WattSupportedLocales>(LOCALE_ID);

  selectedDay = input<string>();
  measurement = input<MeasurementPosition | undefined>();
  meteringPointType = input<string>();

  closed = output<void>();

  dataSource = new WattTableDataSource<MeasurementColumns>([]);

  columns = computed<WattTableColumnDef<MeasurementColumns>>(() => {
    return {
      quantity: {
        accessor: (row) => this.formatNumber(row.quantity),
        align: 'right',
      },
      registeredByGridAccessProvider: {
        accessor: 'registeredByGridAccessProvider',
      },
      registeredInDataHub: {
        accessor: 'registeredInDataHub',
      },
      isCurrent: {
        accessor: null,
        header: '',
      },
    };
  });

  Quality = Quality;

  constructor() {
    effect(() => {
      const firstRow = {
        quantity: this.measurement()?.current.quantity,
        quality: this.measurement()?.current.quality,
        registeredByGridAccessProvider: '-',
        registeredInDataHub: this.measurement()?.observationTime,
        isCurrent: true,
      };

      const remainingRows =
        this.measurement()?.measurementPoints.map((measurement) => {
          return {
            quantity: measurement.quantity,
            quality: measurement.quality,
            registeredByGridAccessProvider: '-',
            registeredInDataHub: measurement.created,
            isCurrent: false,
          };
        }) ?? [];

      this.dataSource.data = [firstRow, ...remainingRows];
    });
  }

  formatNumber(value: string) {
    return dhFormatNumber(value, this.locale);
  }
}
