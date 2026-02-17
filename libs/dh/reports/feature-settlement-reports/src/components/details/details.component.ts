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
import { Component, input, output, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet/watt/drawer';
import { WattDatePipe } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';
import { WATT_CARD } from '@energinet/watt/card';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { DhSettlementReport } from '@energinet-datahub/dh/shared/domain';

import { DhDuration } from './duration.component';
import { DhReportStatus } from '../report-status.component';

@Component({
  selector: 'dh-details',
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    VaterStackComponent,
    VaterFlexComponent,
    WATT_CARD,
    WATT_TABLE,
    WATT_DRAWER,
    WattDatePipe,
    VaterStackComponent,
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhDuration,
    DhReportStatus,
  ],
  styles: [
    `
      .report-heading {
        margin: 0;
      }

      .card-metadata {
        width: 60%;
      }
    `,
  ],
  template: `
    <watt-drawer
      #drawer
      autoOpen
      [key]="report()"
      (closed)="closed.emit()"
      *transloco="let t; prefix: 'reports.settlementReports'"
    >
      <watt-drawer-topbar>
        @if (report().statusType !== 'COMPLETED') {
          <dh-report-status [status]="report().statusType" />
        }
      </watt-drawer-topbar>

      <watt-drawer-heading>
        <h2 class="report-heading">{{ t('calculationTypes.' + report().calculationType) }}</h2>
        <watt-description-list variant="inline-flow">
          <watt-description-list-item [label]="t('columns.startedAt')">
            {{ report().executionTime.start | wattDate: 'long' }}
          </watt-description-list-item>
          <watt-description-list-item [label]="t('columns.executionTime')">
            <dh-duration [value]="report().executionTime" />
          </watt-description-list-item>
          <watt-description-list-item [label]="t('columns.actorName')">
            {{ report().actor?.name }}
          </watt-description-list-item>
        </watt-description-list>
      </watt-drawer-heading>

      @if (report().statusType === 'COMPLETED' && report().gridAreas.length > 0) {
        <watt-drawer-actions>
          <watt-button
            type="button"
            variant="secondary"
            icon="fileDownload"
            (click)="download.emit(report())"
          >
            {{ 'reports.settlementReports.reportStatus.download' | transloco }}
          </watt-button>
        </watt-drawer-actions>
      }

      <watt-drawer-content>
        <vater-flex gap="ml">
          <watt-card variant="solid" class="card-metadata">
            <watt-description-list variant="stack">
              <watt-description-list-item
                [label]="t('columns.period')"
                [value]="report().period | wattDate: 'short'"
              />

              <watt-description-list-item
                [label]="t('columns.basisData')"
                [value]="(report().includesBasisData ? 'yes' : 'no') | transloco"
              />

              <watt-description-list-item
                [label]="t('drawer.monthlySum')"
                [value]="(report().includeMonthlyAmount ? 'yes' : 'no') | transloco"
              />

              <watt-description-list-item
                [label]="t('drawer.combined')"
                [value]="(report().combineResultInASingleFile ? 'yes' : 'no') | transloco"
              />
            </watt-description-list>
          </watt-card>

          <watt-card variant="solid">
            <vater-stack direction="row" gap="s" align="center">
              <h4>{{ t('drawer.gridAreas') }}</h4>
              <span class="watt-chip-label">{{ tableSource.data.length }}</span>
            </vater-stack>

            @if (tableSource.data.length > 0) {
              <watt-table
                [dataSource]="tableSource"
                [columns]="columns"
                [hideColumnHeaders]="true"
                [suppressRowHoverHighlight]="true"
              />
            } @else {
              {{ t('noData') }}
            }
          </watt-card>
        </vater-flex>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhDetails {
  readonly drawer = viewChild.required<WattDrawerComponent>(WattDrawerComponent);

  readonly report = input.required<DhSettlementReport>();
  readonly closed = output();
  readonly download = output<DhSettlementReport>();

  tableSource = dataSource(() => this.report().gridAreas ?? []);
  columns: WattTableColumnDef<string> = {
    code: { accessor: (value) => value },
  };
}
