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
  AfterViewInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  Input,
} from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import {
  WattIconModule,
  WattButtonModule,
  WattEmptyStateModule,
  WattTooltipModule,
  WattSpinnerModule,
} from '@energinet-datahub/watt';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  DhChargesPricesDrawerComponent,
  DhChargesPricesDrawerScam,
} from '../drawer/dh-charges-prices-drawer.component';
import { toLowerSort } from '@energinet-datahub/dh/shared/util-table';

@Component({
  selector: 'dh-charges-prices-result',
  templateUrl: './dh-charges-prices-result.component.html',
  styleUrls: ['./dh-charges-prices-result.component.scss'],
})
export class DhChargesPricesResultComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(DhChargesPricesDrawerComponent)
  chargePriceDrawer!: DhChargesPricesDrawerComponent;

  @Input() result?: Array<ChargeV1Dto>;
  @Input() isLoading = false;
  @Input() isInit = false;
  @Input() hasLoadingError = false;

  private destroy$ = new Subject<void>();

  activeChargeId?: string | null;
  displayedColumns = [
    'chargeId',
    'chargeName',
    'chargeOwnerName',
    'icons',
    'chargeType',
    'resolution',
    'validFromDateTime',
    'validToDateTime',
  ];

  readonly dataSource: MatTableDataSource<ChargeV1Dto> =
    new MatTableDataSource<ChargeV1Dto>();

  constructor(
    private translocoService: TranslocoService,
    private matPaginatorIntl: MatPaginatorIntl
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = toLowerSort();
    this.setupPaginatorTranslation();
  }

  ngOnChanges() {
    if (this.result) this.dataSource.data = this.result;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
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

  rowClicked(charge: ChargeV1Dto) {
    this.activeChargeId = charge.chargeId;
    this.chargePriceDrawer.openDrawer(charge);
  }

  drawerClosed() {
    this.activeChargeId = null;
  }
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
    WattTooltipModule,
    WattSpinnerModule,
    DhSharedUiDateTimeModule,
    MatSortModule,
    DhChargesPricesDrawerScam,
  ],
})
export class DhChargesPricesResultScam {}
