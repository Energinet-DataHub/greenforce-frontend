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
import { Component, input, inject, computed, output } from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { danishTimeZoneIdentifier } from '@energinet/watt/datepicker';
import { dayjs, WattDatePipe, wattFormatDate } from '@energinet/watt/date';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet/watt/expandable-card';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import {
  GenerateCSV,
  DhEmDashFallbackPipe,
  DhDownloadButtonComponent,
  DhResultComponent,
} from '@energinet-datahub/dh/shared/ui-util';
import { GetImbalancePricesMonthOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhStatusBadgeComponent } from '../status-badge/dh-status-badge.component';
import { DhImbalancePrice } from '../../types';
import { DhTableDayViewComponent } from './table-day-view/dh-table-day-view.component';

@Component({
  selector: 'dh-imbalance-prices-details',
  imports: [
    TranslocoDirective,
    VATER,
    WATT_DESCRIPTION_LIST,
    WATT_DRAWER,
    WATT_EXPANDABLE_CARD_COMPONENTS,
    WattDatePipe,
    WattSpinnerComponent,
    DhDownloadButtonComponent,
    DhEmDashFallbackPipe,
    DhResultComponent,
    DhStatusBadgeComponent,
    DhTableDayViewComponent,
  ],
  template: `
    <watt-drawer
      #drawer
      autoOpen
      [key]="imbalancePrice()"
      [animateOnKeyChange]="true"
      (closed)="closed.emit()"
      size="small"
      *transloco="let t; prefix: 'imbalancePrices.drawer'"
    >
      <watt-drawer-topbar>
        <dh-status-badge [status]="imbalancePrice().status" />
      </watt-drawer-topbar>

      <watt-drawer-heading>
        <h2>{{ imbalancePrice().name | wattDate: 'monthYear' }}</h2>
      </watt-drawer-heading>

      <watt-drawer-actions>
        <dh-download-button (click)="downloadCSV()" />
      </watt-drawer-actions>

      <watt-drawer-content>
        <vater-flex fill="vertical">
          <watt-description-list variant="inline-flow">
            <watt-description-list-item [label]="t('priceAreaLabel')">
              {{ imbalancePrice().priceAreaCode | dhEmDashFallback }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('updatedLabel')">
              {{ lastUpdated() | wattDate: 'short' | dhEmDashFallback }}
            </watt-description-list-item>
          </watt-description-list>

          <p class="watt-on-light--medium-emphasis">{{ t('pricesNote') }}</p>

          <dh-result vater fill="vertical" [query]="query">
            @for (day of imbalancePricesForMonth(); track day.timeStamp) {
              <watt-expandable-card variant="solid" togglePosition="before">
                <watt-expandable-card-title vater fill="horizontal">
                  <vater-stack direction="row" fill="horizontal" justify="space-between">
                    {{ day.timeStamp | wattDate: 'short' }}
                    @if (day.status !== 'COMPLETE') {
                      <dh-status-badge [status]="day.status" />
                    }
                  </vater-stack>
                </watt-expandable-card-title>
                <dh-table-day-view [data]="day.imbalancePrices" />
              </watt-expandable-card>
            }
          </dh-result>
        </vater-flex>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhImbalancePricesDetailsComponent {
  private readonly env = inject(dhAppEnvironmentToken);
  private readonly yearAndMonth = computed(() => {
    const imbalancePrice = this.imbalancePrice();
    const date = dayjs(imbalancePrice.name).tz(danishTimeZoneIdentifier);
    return { year: date.get('year'), month: date.get('month') + 1 };
  });

  readonly imbalancePrice = input.required<DhImbalancePrice>();
  readonly closed = output<void>();

  query = query(GetImbalancePricesMonthOverviewDocument, () => ({
    variables: {
      areaCode: this.imbalancePrice().priceAreaCode,
      year: this.yearAndMonth().year,
      month: this.yearAndMonth().month,
    },
  }));

  imbalancePricesForMonth = computed(() => this.query.data()?.imbalancePricesForMonth ?? []);
  firstDay = computed(() => this.query.data()?.imbalancePricesForMonth[0]);
  url = computed(() => this.firstDay()?.imbalancePricesDownloadImbalanceUrl ?? '');
  lastUpdated = computed(() => this.firstDay()?.importedAt);

  private generateCSV = GenerateCSV.fromStream(() => this.url());
  protected downloadCSV = () => {
    const period = dayjs(this.imbalancePrice().name).format('MMMM YYYY');
    const imbalancePrice = translate('imbalancePrices.fileName');
    const envDate = translate('shared.downloadNameParams', {
      datetime: wattFormatDate(new Date(), 'long'),
      env: translate(`environmentName.${this.env.current}`),
    });

    this.generateCSV.withFileName(`${imbalancePrice} - ${period} - ${envDate}`).generate();
  };
}
