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
import { Component, computed, effect, Signal, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattDataTableComponent,
  WattDataActionsComponent,
  WattDataFiltersComponent,
} from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetImbalancePricesOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { wattFormatDate, WattDatePipe } from '@energinet-datahub/watt/date';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhImbalancePrice } from './dh-imbalance-prices';
import { DhStatusBadgeComponent } from './status-badge/dh-status-badge.component';
import { DhImbalancePricesDrawerComponent } from './drawer/dh-drawer.component';
import { DhImbalancePricesUploaderComponent } from './file-uploader/dh-imbalance-prices-uploader.component';

@Component({
  selector: 'dh-imbalance-prices-shell',
  templateUrl: './dh-imbalance-prices-shell.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    FormsModule,
    TranslocoDirective,
    TranslocoPipe,
    WattDropdownComponent,
    VaterUtilityDirective,
    WATT_TABLE,
    WattDatePipe,
    DhStatusBadgeComponent,
    DhImbalancePricesDrawerComponent,
    DhPermissionRequiredDirective,
    DhImbalancePricesUploaderComponent,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,
  ],
})
export class DhImbalancePricesShellComponent {
  private readonly getImbalancePricesOverview = query(GetImbalancePricesOverviewDocument);
  private readonly pricePeriodsData = computed(
    () => this.getImbalancePricesOverview.data()?.imbalancePricesOverview.pricePeriods ?? []
  );

  tableDataSource = new WattTableDataSource<DhImbalancePrice>([]);

  isLoading = this.getImbalancePricesOverview.loading;
  hasError = this.getImbalancePricesOverview.hasError;
  uploadUrl = computed(
    () => this.getImbalancePricesOverview.data()?.imbalancePricesOverview.uploadImbalancePricesUrl
  );

  selectedPeriod: string | null = null;

  monthYearOptions: Signal<WattDropdownOptions> = computed(() => {
    const periods = this.pricePeriodsData().map((period) => period.name.toISOString());

    return [...new Set(periods)].map((period) => ({
      value: period,
      displayValue: wattFormatDate(period, 'monthYear') as string,
    }));
  });

  columns: WattTableColumnDef<DhImbalancePrice> = {
    period: { accessor: (entry) => entry.name },
    priceArea: { accessor: 'priceAreaCode' },
    status: { accessor: 'status' },
  };

  activeRow = signal<DhImbalancePrice | undefined>(undefined);

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.pricePeriodsData();
    });
  }

  onUploadSuccess(): void {
    this.tableDataSource.data = [];
    this.getImbalancePricesOverview.refetch();
  }

  onRowClick(row: DhImbalancePrice): void {
    this.activeRow.set(row);
  }

  onClose(): void {
    this.activeRow.set(undefined);
  }

  onPeriodChange(): void {
    const pricePeriodsData = this.pricePeriodsData();

    this.tableDataSource.data = this.selectedPeriod
      ? pricePeriodsData.filter((period) => period.name.toISOString() === this.selectedPeriod)
      : pricePeriodsData;
  }
}
