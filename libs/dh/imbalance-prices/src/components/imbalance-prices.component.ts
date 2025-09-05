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
import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetImbalancePricesOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDatePipe, wattFormatDate } from '@energinet-datahub/watt/date';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhImbalancePrice } from '../types';
import { DhImbalancePricesUploaderComponent } from './file-uploader/dh-imbalance-prices-uploader.component';
import {
  WattDataActionsComponent,
  WattDataFiltersComponent,
  WattDataTableComponent,
} from '@energinet-datahub/watt/data';
import { DhStatusBadgeComponent } from './status-badge/dh-status-badge.component';
import { DhImbalancePricesDetailsComponent } from './details/details.component';

@Component({
  selector: 'dh-imbalance-prices',
  templateUrl: './imbalance-prices.component.html',
  styles: [
    `
      h3 {
        margin: 0;
      }
    `,
  ],
  imports: [
    FormsModule,
    TranslocoDirective,
    WATT_CARD,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,
    WattDropdownComponent,
    VaterUtilityDirective,
    DhPermissionRequiredDirective,
    WattDatePipe,
    DhStatusBadgeComponent,
    DhImbalancePricesDetailsComponent,
    DhImbalancePricesUploaderComponent,
  ],
})
export class DhImbalancePricesComponent {
  private readonly pricePeriodsData = computed(
    () => this.query.data()?.imbalancePricesOverview.pricePeriods ?? []
  );
  readonly query = query(GetImbalancePricesOverviewDocument);

  columns: WattTableColumnDef<DhImbalancePrice> = {
    period: { accessor: 'name' },
    priceArea: { accessor: 'priceAreaCode' },
    status: { accessor: 'status' },
  };

  dataSource = new WattTableDataSource<DhImbalancePrice>([]);

  uploadUrl = computed(() => this.query.data()?.imbalancePricesOverview.uploadImbalancePricesUrl);

  selectedPeriod: string | null = null;

  activeRow = signal<DhImbalancePrice | undefined>(undefined);

  monthYearOptions: Signal<WattDropdownOptions> = computed(() => {
    const periods = this.pricePeriodsData().map((period) => period.name.toISOString());

    return [...new Set(periods)].map((period) => ({
      value: period,
      displayValue: wattFormatDate(period, 'monthYear') as string,
    }));
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.pricePeriodsData();
    });
  }

  onRowClick(entry: DhImbalancePrice): void {
    this.activeRow.set(entry);
  }

  onClose(): void {
    this.activeRow.set(undefined);
  }

  onUploadSuccess(): void {
    this.dataSource.data = [];
    this.query.refetch();
  }

  onPeriodChange(): void {
    const pricePeriodsData = this.pricePeriodsData();

    this.dataSource.data = this.selectedPeriod
      ? pricePeriodsData.filter((period) => period.name.toISOString() === this.selectedPeriod)
      : pricePeriodsData;
  }
}
