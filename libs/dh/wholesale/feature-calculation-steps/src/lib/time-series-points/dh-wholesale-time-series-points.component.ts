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
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslocoModule } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { TimeSeriesPointDto } from '@energinet-datahub/dh/shared/domain';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    MatSortModule,
    TranslocoModule,
    WattEmptyStateModule,
    DhSharedUiPaginatorComponent,
    WattCardModule,
    DhSharedUiDateTimeModule,
  ],
  selector: 'dh-wholesale-time-series-points',
  templateUrl: './dh-wholesale-time-series-points.component.html',
  styleUrls: ['./dh-wholesale-time-series-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleTimeSeriesPointsComponent implements AfterViewInit {
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;

  @Input() set data(timeSeriesPoints: TimeSeriesPointDto[]) {
    this._data = new WattTableDataSource(timeSeriesPoints);
    this._data.paginator = this.paginator?.instance;
  }

  _data: WattTableDataSource<TimeSeriesPointDto> = new WattTableDataSource(
    undefined
  );
  columns: WattTableColumnDef<TimeSeriesPointDto> = {
    time: { accessor: 'time' },
    quantity: { accessor: 'quantity' },
  };

  ngAfterViewInit() {
    if (!this._data) return;
    this._data.paginator = this.paginator?.instance;
  }
}
