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
  NgModule,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { MessageArchiveSearchResultItemDto } from '@energinet-datahub/dh/shared/domain';
import {
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
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

@Component({
  selector: 'dh-charges-message-tab',
  templateUrl: './dh-charges-message-tab.component.html',
  styleUrls: ['./dh-charges-message-tab.component.scss']
})

export class DhChargesMessageTabComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  @Input() result?: Array<MessageArchiveSearchResultItemDto>;
  @Input() isLoading = false;
  @Input() isInit = false;
  @Input() hasLoadingError = false;

  private destroy$ = new Subject<void>();

  displayedColumns = [
    'messageId',
    'createdDate',
    'messageType',
  ];

  readonly dataSource: MatTableDataSource<MessageArchiveSearchResultItemDto> =
    new MatTableDataSource<MessageArchiveSearchResultItemDto>();

  constructor(
    private translocoService: TranslocoService,
    private matPaginatorIntl: MatPaginatorIntl
  ) {}

  ngAfterViewInit() {
    this.result = [
      { messageId: 'id', messageType: 'RSM - 33 RequestChangeOfPriceList', blobContentUri: 'https://', createdDate: '2022-10-29T22:00:00'},
    ];
    this.dataSource.data = this.result;

    this.dataSource.paginator = this.paginator;
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

  rowClicked(message: string) {
    this.openMessage(message);
  }

  openMessage(message: string) {
    console.log(message);
  }
}

@NgModule({
  declarations: [DhChargesMessageTabComponent],
  exports: [DhChargesMessageTabComponent],
  imports: [
    CommonModule,
    MatTableModule,
    TranslocoModule,
    LetModule,
    MatPaginatorModule,
    WattButtonModule,
    WattEmptyStateModule,
    WattTooltipModule,
    WattSpinnerModule,
    DhSharedUiDateTimeModule,
    MatSortModule,
  ],
})
export class DhChargesMessageTabScam {}
