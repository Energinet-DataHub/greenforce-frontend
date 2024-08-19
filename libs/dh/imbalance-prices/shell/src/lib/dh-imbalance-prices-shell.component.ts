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
import { Component, computed, effect } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/table';
import { GetImbalancePricesOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhImbalancePrice } from './dh-imbalance-prices';
import { DhTableMonthViewComponent } from './table-month-view/dh-table-month-view.component';
import { DhImbalancePricesUploaderComponent } from './file-uploader/dh-imbalance-prices-uploader.component';

@Component({
  selector: 'dh-imbalance-prices-shell',
  standalone: true,
  templateUrl: './dh-imbalance-prices-shell.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }

      watt-paginator {
        --watt-space-ml--negative: calc(var(--watt-space-ml) * -1);

        display: block;
        margin: 0 var(--watt-space-ml--negative) var(--watt-space-ml--negative)
          var(--watt-space-ml--negative);
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WATT_CARD,
    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    WattPaginatorComponent,

    DhTableMonthViewComponent,
    DhPermissionRequiredDirective,
    DhImbalancePricesUploaderComponent,
  ],
})
export class DhImbalancePricesShellComponent {
  private readonly getImbalancePricesOverview = query(GetImbalancePricesOverviewDocument);

  tableDataSource = new WattTableDataSource<DhImbalancePrice>([]);

  isLoading = this.getImbalancePricesOverview.loading;
  hasError = this.getImbalancePricesOverview.error() !== undefined;
  uploadUrl = computed(
    () => this.getImbalancePricesOverview.data()?.imbalancePricesOverview.uploadImbalancePricesUrl
  );

  constructor() {
    effect(() => {
      this.tableDataSource.data =
        this.getImbalancePricesOverview.data()?.imbalancePricesOverview.pricePeriods ?? [];
    });
  }

  onUploadSuccess(): void {
    this.tableDataSource.data = [];
    this.getImbalancePricesOverview.refetch();
  }
}
