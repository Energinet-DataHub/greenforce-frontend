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
import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
} from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import {
  WattIconModule,
  WattIconSize,
  WattButtonModule,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dh-charges-prices-result',
  templateUrl: './dh-charges-prices-result.component.html',
  styleUrls: ['./dh-charges-prices-result.component.scss'],
})
export class DhChargesPricesResultComponent
  implements OnInit, OnDestroy, OnChanges
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();

  iconSizes = WattIconSize;
  searchResult: Array<object> = [
    // {
    //   id: 1,
    //   name: 'test name',
    //   owner: 'test owner',
    //   isTax: false,
    //   isTransparentInvoicing: true,
    //   chargeType: 'Abonnement',
    //   resolution: 'Måned',
    //   validFromDate: '01-01-2000',
    //   validToDate: '02-01-2000',
    // },
  ];
  displayedColumns = [
    'priceId',
    'priceName',
    'owner',
    'icons',
    'chargeType',
    'resolution',
    'validFromDate',
    'validToDate',
  ];

  readonly dataSource: MatTableDataSource<object> =
    new MatTableDataSource<object>(this.searchResult);

  constructor(
    private translocoService: TranslocoService,
    private matPaginatorIntl: MatPaginatorIntl
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.setupPaginatorTranslation();
  }

  ngOnChanges() {
    this.dataSource.data = this.searchResult;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private readonly setupPaginatorTranslation = () => {
    const temp = this.matPaginatorIntl.getRangeLabel;
    this.matPaginatorIntl.getRangeLabel = (page, pageSize, length) =>
      temp(page, pageSize, length).replace(
        'of',
        this.translocoService.translate('charges.prices.paginator.of')
      );

    this.translocoService
      .selectTranslateObject('charges.prices.paginator')
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.matPaginatorIntl.itemsPerPageLabel = value.itemsPerPageLabel;
        this.matPaginatorIntl.nextPageLabel = value.next;
        this.matPaginatorIntl.previousPageLabel = value.previous;
        this.matPaginatorIntl.firstPageLabel = value.first;
        this.matPaginatorIntl.lastPageLabel = value.last;
        this.dataSource.paginator = this.paginator;
      });
  };
}

@NgModule({
  declarations: [DhChargesPricesResultComponent],
  exports: [DhChargesPricesResultComponent],
  imports: [
    CommonModule,
    MatTableModule,
    TranslocoModule,
    LetModule,
    WattIconModule,
    MatPaginatorModule,
    WattButtonModule,
    WattEmptyStateModule,
    DhFeatureFlagDirectiveModule,
  ],
})
export class DhChargesPricesResultScam {}
