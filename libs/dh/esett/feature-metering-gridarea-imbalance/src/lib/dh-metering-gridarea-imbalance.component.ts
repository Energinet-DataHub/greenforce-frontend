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
import { Component, OnDestroy, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import {
  BehaviorSubject,
  Subject,
  map,
} from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { WattSearchComponent } from '@energinet-datahub/watt/search';

@Component({
  standalone: true,
  selector: 'dh-metering-gridarea-imbalance',
  templateUrl: './dh-metering-gridarea-imbalance.component.html',
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
    TranslocoPipe,
    RxPush,

    WATT_CARD,
    WattPaginatorComponent,
    WattButtonComponent,
    WattSearchComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,
  ],
})
export class DhMeteringGridAreaImbalanceComponent implements OnDestroy {
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  totalCount = 0;

  private pageMetaData$ = new BehaviorSubject<Pick<PageEvent, 'pageIndex' | 'pageSize'>>({
    pageIndex: 0,
    pageSize: 100,
  });

  pageSize$ = this.pageMetaData$.pipe(map(({ pageSize }) => pageSize));

  isLoading = false;
  hasError = false;

  documentIdSearch$ = new BehaviorSubject<string>('');

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handlePageEvent({ pageIndex, pageSize }: PageEvent): void {
    this.pageMetaData$.next({ pageIndex, pageSize });
  }
}
