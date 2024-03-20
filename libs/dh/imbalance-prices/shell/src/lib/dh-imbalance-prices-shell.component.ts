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
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattTableDataSource, WattPaginatorComponent } from '@energinet-datahub/watt/table';
import { GetImbalancePricesOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhTableMonthViewComponent } from './table-month-view/dh-table-month-view.component';
import { DhImbalancePrice } from './dh-imbalance-prices';
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
    VaterUtilityDirective,
    VaterSpacerComponent,
    WattPaginatorComponent,

    DhTableMonthViewComponent,
    DhImbalancePricesUploaderComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhImbalancePricesShellComponent {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);

  private readonly getImbalancePricesOverview$ = this.apollo.query({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    query: GetImbalancePricesOverviewDocument,
  });

  tableDataSource = new WattTableDataSource<DhImbalancePrice>([]);
  totalCount = 0;

  isLoading = false;
  hasError = false;

  constructor() {
    this.fetchData();
  }

  onUploadSuccess(): void {
    this.tableDataSource.data = [];
    this.fetchData();
  }

  private fetchData(): void {
    this.isLoading = true;

    this.getImbalancePricesOverview$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ loading, data }) => {
        this.isLoading = loading;

        this.tableDataSource.data = data.imbalancePricesOverview.pricePeriods;
        this.totalCount = data.imbalancePricesOverview.pricePeriods.length;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }
}
