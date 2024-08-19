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
  computed,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { switchMap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { dayjs, WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/picker/datepicker';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import { DhEmDashFallbackPipe, streamToFile } from '@energinet-datahub/dh/shared/ui-util';
import { GetImbalancePricesMonthOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhStatusBadgeComponent } from '../status-badge/dh-status-badge.component';
import { dhValueChangeAnimationTrigger } from './dh-value-change-animation-trigger';
import { DhImbalancePrice, DhImbalancePricesForMonth } from '../dh-imbalance-prices';
import { DhTableDayViewComponent } from '../table-day-view/dh-table-day-view.component';

@Component({
  selector: 'dh-imbalance-prices-drawer',
  standalone: true,
  templateUrl: './dh-drawer.component.html',
  animations: [dhValueChangeAnimationTrigger],
  styles: [
    `
      :host {
        display: block;
      }

      h2 {
        margin-block: var(--watt-space-s);
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

      watt-drawer-content {
        padding: 0 var(--watt-space-ml) var(--watt-space-ml);
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
    TranslocoPipe,
    TranslocoDirective,

    WATT_DRAWER,
    WattDatePipe,
    VaterFlexComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    DhEmDashFallbackPipe,
    DhStatusBadgeComponent,
    DhTableDayViewComponent,
  ],
})
export class DhImbalancePricesDrawerComponent {
  private readonly toastService = inject(WattToastService);
  private readonly httpClient = inject(HttpClient);
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

  imbalancePricesForMonth = signal<DhImbalancePricesForMonth[]>([]);
  isLoading = signal(false);
  lastUpdated = computed(() => {
    const [firstDay] = this.imbalancePricesForMonth();

    return firstDay?.importedAt;
  });

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  constructor() {
    effect(
      () => {
        if (this.imbalancePrice()) {
          this.drawer?.open();

          this.fetchData();
        }
      },
      { allowSignalWrites: true }
    );
  }

  onClose(): void {
    this.closed.emit();
  }

  downloadCSV(url: string) {
    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      name: 'imbalance-prices-' + dayjs(this.imbalancePrice()?.name).format('MMMM YYYY'),
      type: 'text/csv',
    };

    this.httpClient
      .get(url, { responseType: 'text' })
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          });
        },
      });
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
