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
import {
  MessageArchiveSearchResultItemDto,
  MessageArchiveSearchCriteria,
} from '@energinet-datahub/dh/shared/domain';
import { DhMessageArchiveDataAccessApiStore } from '@energinet-datahub/dh/message-archive/data-access-api';
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
import { ToLowerSort } from '@energinet-datahub/dh/shared/util-table';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { Inject } from '@angular/core';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';
import { DhDrawerDatepickerScam } from '../drawer-datepicker/dh-drawer-datepicker.component';

@Component({
  selector: 'dh-charges-charge-messages-tab',
  templateUrl: './dh-charges-charge-messages-tab.component.html',
  styleUrls: ['./dh-charges-charge-messages-tab.component.scss'],
  providers: [DhMessageArchiveDataAccessApiStore],
})
export class DhChargesChargeMessagesTabComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  @Input() result?: Array<MessageArchiveSearchResultItemDto>;
  @Input() isLoading = true;
  @Input() isInit = true;
  @Input() hasLoadingError = false;

  private destroy$ = new Subject<void>();

  searchResult$ = this.messageArchiveStore.searchResult$;

  displayedColumns = ['messageId', 'createdDate', 'messageType'];

  maxItemCount = 100;
  searchCriteria: MessageArchiveSearchCriteria = {
    maxItemCount: this.maxItemCount,
    includeRelated: false,
    includeResultsWithoutContent: false,
  };

  readonly dataSource: MatTableDataSource<MessageArchiveSearchResultItemDto> =
    new MatTableDataSource<MessageArchiveSearchResultItemDto>();

  loadMessages() {
    const chargesMessagesTabFeatureIsEnabled =
      this.featureFlagsService.isEnabled('charges_messages_tab_feature_flag');
    if (chargesMessagesTabFeatureIsEnabled) {
      this.loadMessagesFromMessageArchive();
    }

    //Insert dummy data for now
    if (this.dataSource.data.length === 0) {
      this.dataSource.data = [
        {
          messageId: 'dummy-message 1',
          messageType: 'RSM - 33 RequestChangeOfPriceList',
          blobContentUri: 'https://',
          createdDate: '2022-10-29T22:00:00',
        },
        {
          messageId: 'dummy-message 2',
          messageType: 'RSM - 33 RequestChangeOfPriceList',
          blobContentUri: 'https://',
          createdDate: '2022-11-01T22:00:00',
        },
      ];
    }

    this.isLoading = false;
    this.isInit = false;
    this.dataSource.sortingDataAccessor = ToLowerSort();
  }

  loadMessagesFromMessageArchive() {
    this.searchCriteria.dateTimeFrom =
      this.initDateFrom().toISOString().split('.')[0] + 'Z';
    this.searchCriteria.dateTimeTo =
      this.initDateTo().toISOString().split('.')[0] + 'Z';

    if (this.validateSearchParams()) {
      this.searchCriteria.continuationToken = null;

      if (!this.searchCriteria.messageId) {
        this.searchCriteria.includeRelated = false;
      }

      this.messageArchiveStore.searchLogs(this.searchCriteria);
      console.log(this.searchResult$);
    }
  }

  constructor(
    private messageArchiveStore: DhMessageArchiveDataAccessApiStore,
    private translocoService: TranslocoService,
    private matPaginatorIntl: MatPaginatorIntl,
    @Inject(DhFeatureFlagsService)
    private featureFlagsService: DhFeatureFlagsService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = ToLowerSort();
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

  validateSearchParams(): boolean {
    return (
      this.searchCriteria.dateTimeFrom != null &&
      this.searchCriteria.dateTimeTo != null &&
      this.searchCriteria.dateTimeFrom.length === 20 &&
      this.searchCriteria.dateTimeTo.length === 20
    );
  }

  dateRangeChanged(dateRange: DatePickerData) {
    console.log(dateRange);
  }

  private initDateFrom = (): Date => {
    const from = new Date();
    from.setUTCMonth(new Date().getMonth() - 1);
    from.setUTCHours(0, 0, 0);
    return from;
  };
  private initDateTo = (): Date => {
    const to = new Date();
    to.setUTCHours(23, 59, 59);
    return to;
  };

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
  declarations: [DhChargesChargeMessagesTabComponent],
  exports: [DhChargesChargeMessagesTabComponent],
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
    DhFeatureFlagDirectiveModule,
    DhDrawerDatepickerScam,
  ],
})
export class DhChargesChargeMessagesTabScam {}
