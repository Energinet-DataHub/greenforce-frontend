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
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { DhOutgoingMessagesTableComponent } from "./table/dh-table.component";
import { DhMeteringGridAreaImbalance } from './dh-metering-gridarea-imbalance';
import { WattTableDataSource } from '@energinet-datahub/watt/table';

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
        DhOutgoingMessagesTableComponent
    ]
})
export class DhMeteringGridAreaImbalanceComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  tableDataSource = new WattTableDataSource<DhMeteringGridAreaImbalance>([]);
  totalCount = 0;

  private pageMetaData$ = new BehaviorSubject<Pick<PageEvent, 'pageIndex' | 'pageSize'>>({
    pageIndex: 0,
    pageSize: 100,
  });

  pageSize$ = this.pageMetaData$.pipe(map(({ pageSize }) => pageSize));

  isLoading = false;
  hasError = false;

  documentIdSearch$ = new BehaviorSubject<string>('');

  ngOnInit() {
    const testData = [
      { __typename: "MeteringGridAreaImbalanceSearchResult", id: '1', gridAreaCode: 'DK1', documentDateTime: new Date('2021-01-01'), receivedDateTime: new Date('2021-01-03'), periodStart: new Date('2021-01-01'), periodEnd: new Date('2021-01-02'), storageId: '1' },
      { __typename: "MeteringGridAreaImbalanceSearchResult", id: '2', gridAreaCode: 'DK2', documentDateTime: new Date('2021-01-02'), receivedDateTime: new Date('2021-01-04'), periodStart: new Date('2021-01-02'), periodEnd: new Date('2021-01-03'), storageId: '2' }
    ];

    this.tableDataSource.data = testData as DhMeteringGridAreaImbalance[];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handlePageEvent({ pageIndex, pageSize }: PageEvent): void {
    this.pageMetaData$.next({ pageIndex, pageSize });
  }
}
