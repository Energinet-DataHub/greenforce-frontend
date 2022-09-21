import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild
} from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';

import {
  WattIconModule,
  WattIconSize,
  WattButtonModule,
  WattEmptyStateModule
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
  styleUrls: ['./dh-charges-prices-result.component.scss']
})
export class DhChargesPricesResultComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();

  iconSizes = WattIconSize;
  searchResult: Array<any> = [
    {
      id: 2,
      name: "test name",
      owner: "test owner",
      isTax: true,
      isTransparentInvoicing: true,
      chargeType: 0,
      resolution: 0,
      validFromDate: "01-01-2000",
      validToDate: "02-01-2000"
    }
  ];
  displayedColumns  = [
    'priceId',
    'priceName',
    'owner',
    'icons',
    'chargeType',
    'resolution',
    'validFromDate',
    'validToDate'
  ];

  readonly dataSource: MatTableDataSource<any> =
    new MatTableDataSource<any>(this.searchResult);

  constructor(
    private translocoService: TranslocoService,
    private matPaginatorIntl: MatPaginatorIntl
  ) {}

  ngOnInit() {
    // this.dataSource.data = this.searchResult;
    this.dataSource.paginator = this.paginator;
    this.setupPaginatiorTranslation();
  }

  ngOnChanges() {
    this.dataSource.data = this.searchResult;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private readonly setupPaginatiorTranslation = () => {
    const temp = this.matPaginatorIntl.getRangeLabel;
    this.matPaginatorIntl.getRangeLabel = (page, pageSize, length) =>
      temp(page, pageSize, length).replace(
        'of',
        this.translocoService.translate(
          'charges.prices.result.paginator.of'
        )
      );

    this.translocoService
      .selectTranslateObject('charges.prices.result.paginator')
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.matPaginatorIntl.itemsPerPageLabel = value.itemsPerPageLabel;
        this.matPaginatorIntl.nextPageLabel = value.next;
        this.matPaginatorIntl.previousPageLabel = value.previous;
        this.matPaginatorIntl.firstPageLabel = value.first;
        this.matPaginatorIntl.lastPageLabel = value.last;
        this.dataSource.paginator = this.paginator;
      });
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
    WattEmptyStateModule
  ],
})
export class DhChargesPricesResultScam {}
