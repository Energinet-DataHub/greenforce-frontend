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
import { Component, input, effect, signal, inject, computed, output } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { dayjs, wattFormatDate } from '@energinet/watt/date';
import { WattDatePipe } from '@energinet/watt/date';
import { VaterFlexComponent } from '@energinet/watt/vater';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { danishTimeZoneIdentifier } from '@energinet/watt/datepicker';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet/watt/expandable-card';

import { GenerateCSV, DhEmDashFallbackPipe, DhDownloadButtonComponent } from '@energinet-datahub/dh/shared/ui-util';
import { GetImbalancePricesMonthOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhStatusBadgeComponent } from '../status-badge/dh-status-badge.component';
import { DhImbalancePrice, DhImbalancePricesForMonth } from '../../types';
import { DhTableDayViewComponent } from './table-day-view/dh-table-day-view.component';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

@Component({
  selector: 'dh-imbalance-prices-details',
  templateUrl: './details.component.html',
  styles: [
    `
      :host {
        display: block;
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
    VaterFlexComponent,
    WattSpinnerComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,
    DhEmDashFallbackPipe,
    DhStatusBadgeComponent,
    DhTableDayViewComponent,
    DhDownloadButtonComponent,
  ],
})
export class DhImbalancePricesDetailsComponent {
  private readonly env = inject(dhAppEnvironmentToken);
  private readonly apollo = inject(Apollo);

  private readonly yearAndMonth = computed(() => {
    const imbalancePrice = this.imbalancePrice();

    if (!imbalancePrice) {
      return { year: 0, month: 0 };
    }

    const date = dayjs(imbalancePrice.name).tz(danishTimeZoneIdentifier);

    return { year: date.get('year'), month: date.get('month') + 1 };
  });

  imbalancePrice = input<DhImbalancePrice>();

  url = signal<string>('');

  private generateCSV = GenerateCSV.fromStream(() => this.url());

  imbalancePricesForMonth = signal<DhImbalancePricesForMonth[]>([]);
  isLoading = signal(false);
  lastUpdated = computed(() => {
    const [firstDay] = this.imbalancePricesForMonth();

    return firstDay?.importedAt;
  });

  closed = output<void>();

  constructor() {
    effect(() => {
      if (this.imbalancePrice()) {
        this.fetchData();
      }
    });
  }

  onClose(): void {
    this.closed.emit();
  }

  downloadCSV() {
    const period = dayjs(this.imbalancePrice()?.name).format('MMMM YYYY');
    const imbalancePrice = translate('imbalancePrices.fileName');
    const envDate = translate('shared.downloadNameParams', {
      datetime: wattFormatDate(new Date(), 'long'),
      env: translate(`environmentName.${this.env.current}`),
    });
    this.generateCSV.withFileName(`${imbalancePrice} - ${period} - ${envDate}`).generate();
  }

  private fetchData() {
    this.isLoading.set(true);
    this.imbalancePricesForMonth.set([]);

    const imbalancePrice = this.imbalancePrice();

    if (!imbalancePrice) return;

    const { year, month } = this.yearAndMonth();

    return this.apollo
      .query({
        query: GetImbalancePricesMonthOverviewDocument,
        variables: {
          year,
          month,
          areaCode: imbalancePrice.priceAreaCode,
        },
      })
      .subscribe({
        next: (result) => {
          this.isLoading.set(result.loading);
          this.url.set(result.data.imbalancePricesForMonth[0].imbalancePricesDownloadImbalanceUrl);
          this.imbalancePricesForMonth.set(result.data.imbalancePricesForMonth);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }
}
