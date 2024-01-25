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
import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  input,
  effect,
  signal,
  inject,
} from '@angular/core';
import { TranslocoDirective, translate } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { GetImbalancePricesMonthOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

import {
  DhImbalancePrice,
  DhImbalancePricesForDay,
  DhImbalancePricesForMonth,
} from '../dh-imbalance-prices';
import { DhStatusBadgeComponent } from '../status-badge/dh-status-badge.component';
import { DhTableDayViewComponent } from '../table-day-view/dh-table-day-view.component';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { ImbalancePricesHttp } from '@energinet-datahub/dh/shared/domain';
import { switchMap } from 'rxjs';
import { streamToFile } from '@energinet-datahub/dh/wholesale/domain';

@Component({
  selector: 'dh-imbalance-prices-drawer',
  standalone: true,
  templateUrl: './dh-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h2 {
        margin-bottom: var(--watt-space-s);
      }

      .entry-metadata {
        display: flex;
        gap: var(--watt-space-ml);
      }

      .entry-metadata__item {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
      }

      .prices-note {
        color: var(--watt-color-neutral-grey-700);
        margin-top: 0;
      }

      watt-drawer-content {
        padding-right: var(--watt-space-ml);
        padding-left: var(--watt-space-ml);
      }

      watt-expandable-card {
        display: block;

        &:not(:first-of-type) {
          margin-top: var(--watt-space-s);
        }
      }

      watt-expandable-card-title {
        display: contents;

        dh-status-badge {
          margin-left: auto;
        }
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WATT_DRAWER,
    WattDatePipe,
    WATT_EXPANDABLE_CARD_COMPONENTS,
    WattButtonComponent,
    WattSpinnerComponent,
    VaterFlexComponent,
    DhStatusBadgeComponent,
    DhEmDashFallbackPipe,
    DhTableDayViewComponent,
    DhFeatureFlagDirective,
  ],
  providers: [WattDatePipe],
})
export class DhImbalancePricesDrawerComponent {
  private readonly toastService = inject(WattToastService);
  private readonly httpClient = inject(ImbalancePricesHttp);
  private readonly wattDatePipe = inject(WattDatePipe);
  private readonly apollo = inject(Apollo);

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  imbalancePrice = input<DhImbalancePrice>();
  imbalancePricesForMonth = signal<DhImbalancePricesForMonth[]>([]);
  isLoading = signal(false);

  @Output() closed = new EventEmitter<void>();

  query = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetImbalancePricesMonthOverviewDocument,
    variables: undefined,
  });

  constructor() {
    effect((onCleanup) => {
      if (this.imbalancePrice()) {
        this.drawer?.open();

        this.query.setVariables({
          year: this.imbalancePrice()!.name.getFullYear(),
          month: this.imbalancePrice()!.name.getMonth(),
          areaCode: this.imbalancePrice()!.priceAreaCode,
        });

        const subscription = this.fetchData();

        onCleanup(() => subscription.unsubscribe());
      }
    });
  }

  onClose(): void {
    this.closed.emit();
  }

  toSignal(prices: DhImbalancePricesForDay[]) {
    return signal(prices);
  }

  downloadCSV() {
    this.toastService.open({
      type: 'loading',
      message: translate('imbalancePrices.drawer.downloadStart'),
    });

    const fileOptions = {
      name:
        this.wattDatePipe.transform(this.imbalancePrice()?.name, 'monthYear') || 'imbalance-prices',
      type: 'text/csv',
    };
    const year = this.imbalancePricesForMonth()[0].timeStamp.getFullYear();
    const month = this.imbalancePricesForMonth()[0].timeStamp.getMonth();

    this.httpClient
      .v1ImbalancePricesDownloadImbalanceCSVGet(month, year)
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: translate('imbalancePrices.drawer.downloadFailed'),
          });
        },
      });
  }

  private fetchData() {
    return this.query.valueChanges.subscribe({
      next: (result) => {
        this.isLoading.set(result.loading);

        this.imbalancePricesForMonth.set(result.data?.imbalancePricesForMonth ?? []);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
