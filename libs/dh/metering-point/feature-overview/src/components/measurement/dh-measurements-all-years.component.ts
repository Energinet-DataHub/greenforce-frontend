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
import { ActivatedRoute, Router } from '@angular/router';
import { Component, computed, effect, inject, input, LOCALE_ID } from '@angular/core';

import qs from 'qs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WattSupportedLocales } from '@energinet-datahub/watt/date';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import {
  Quality,
  GetAggregatedMeasurementsForAllYearsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { getPath, MeasurementsSubPaths } from '@energinet-datahub/dh/core/routing';

import { AggregatedMeasurementsForAllYears } from '../../types';
import { dhFormatMeasurementNumber } from '../../utils/dh-format-measurement-number';

@Component({
  selector: 'dh-measurements-all-years',
  imports: [TranslocoDirective, WATT_TABLE, WattDataTableComponent, VaterUtilityDirective],
  template: `
    <watt-data-table
      [enableSearch]="false"
      [enableCount]="false"
      [error]="query.error()"
      [ready]="query.called()"
      [enablePaginator]="false"
      *transloco="let t; read: 'meteringPoint.measurements'"
    >
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.measurements.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [stickyFooter]="true"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        sortDirection="desc"
        [sortClear]="false"
        (rowClick)="navigateToYear($event.year)"
      >
        <ng-container *wattTableCell="columns.year; let element">
          {{ element.year }}
        </ng-container>

        <ng-container *wattTableCell="columns.currentQuantity; let element">
          {{ formatNumber(element.quantity) }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsAllYearsComponent {
  private router = inject(Router);
  private transloco = inject(TranslocoService);
  private route = inject(ActivatedRoute);
  private locale = inject<WattSupportedLocales>(LOCALE_ID);
  private measurements = computed(() => this.query.data()?.aggregatedMeasurementsForAllYears ?? []);
  meteringPointId = input.required<string>();
  query = query(GetAggregatedMeasurementsForAllYearsDocument, () => ({
    variables: { meteringPointId: this.meteringPointId() },
  }));

  Quality = Quality;

  columns: WattTableColumnDef<AggregatedMeasurementsForAllYears> = {
    year: {
      accessor: 'year',
      size: 'min-content',
    },
    currentQuantity: {
      accessor: 'quantity',
      align: 'right',
      tooltip: `${this.transloco.translate('meteringPoint.measurements.qualityNotAvailableInThisResolution')}`,
    },
    filler: {
      accessor: null,
      header: '',
      size: '1fr',
    },
  };

  dataSource = new WattTableDataSource<AggregatedMeasurementsForAllYears>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.measurements() ?? [];
    });
  }

  formatNumber(value: number) {
    return dhFormatMeasurementNumber(value, this.locale);
  }

  navigateToYear(year: number | undefined | null) {
    if (!year) return;

    this.router.navigate(['../', this.getLink('year')], {
      queryParams: { filters: qs.stringify({ year }) },
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }

  private getLink = (key: MeasurementsSubPaths) => getPath<MeasurementsSubPaths>(key);
}
