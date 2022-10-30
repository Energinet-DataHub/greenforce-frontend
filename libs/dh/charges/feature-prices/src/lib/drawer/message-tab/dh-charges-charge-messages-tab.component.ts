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
  Inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { DhChargeMessagesDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import {
  ChargeMessagesSearchCriteriaV1Dto,
  ChargeMessageV1Dto,
  ChargeV1Dto,
  ChargeMessageSortColumnName,
} from '@energinet-datahub/dh/shared/domain';
import { WattTooltipModule } from '@energinet-datahub/watt/tooltip';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { ToLowerSort } from '@energinet-datahub/dh/shared/util-table';
import {
  DhFeatureFlagDirectiveModule,
  DhFeatureFlagsService
 } from '@energinet-datahub/dh/shared/feature-flags';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';
import { DhDrawerDatepickerScam } from '../drawer-datepicker/dh-drawer-datepicker.component';
import { zonedTimeToUtc } from 'date-fns-tz';

@Component({
  selector: 'dh-charges-charge-messages-tab',
  templateUrl: './dh-charges-charge-messages-tab.component.html',
  styleUrls: ['./dh-charges-charge-messages-tab.component.scss'],
  providers: [DhChargeMessagesDataAccessApiStore],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargesChargeMessagesTabComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @Input() isInit = true;

  private destroy$ = new Subject<void>();

  result: ChargeMessageV1Dto[] | undefined;
  isLoading = this.chargeMessagesStore.isLoading$;
  hasLoadingError = this.chargeMessagesStore.hasGeneralError$;
  chargeMessageNotFound = this.chargeMessagesStore.chargeMessagesNotFound$;
  displayedColumns = ['messageId', 'messageDateTime', 'messageType'];

  maxItemCount = 100;

  localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  chargeMessagesSearchCriteria: ChargeMessagesSearchCriteriaV1Dto = {
    chargeId: '',
    fromDateTime: zonedTimeToUtc(
      new Date(new Date().toDateString()),
      this.localTimeZone
    ).toISOString(),
    toDateTime: zonedTimeToUtc(
      new Date(new Date().toDateString()),
      this.localTimeZone
    ).toISOString(),
    isDescending: false,
    chargeMessageSortColumnName: ChargeMessageSortColumnName.MessageDateTime,
    skip: 0,
    take: 0,
  };

  readonly dataSource: MatTableDataSource<ChargeMessageV1Dto> =
    new MatTableDataSource<ChargeMessageV1Dto>();

  loadMessages(charge: ChargeV1Dto) {
    const chargesMessagesTabFeatureIsEnabled =
      this.featureFlagsService.isEnabled('charges_messages_tab_feature_flag');
    if (chargesMessagesTabFeatureIsEnabled) {
      this.doLoadMessages(charge);
    }

    this.dataSource.sortingDataAccessor = ToLowerSort();
  }

  doLoadMessages(charge: ChargeV1Dto) {
    setTimeout(() => {
      this.chargeMessagesSearchCriteria.chargeId = charge.id;
      //this.chargeMessagesSearchCriteria.take = this.paginator.instance.pageSize;

      /* const dateTimeRange =
        this.drawerDatepickerComponent.formControlDateRange.value;

      if (dateTimeRange) {
        this.setSearchCriteriaDateRange({
          startDate: dateTimeRange.start,
          endDate: dateTimeRange.end,
        });
      } */
      this.chargeMessagesStore.searchChargeMessages(this.chargeMessagesSearchCriteria);
    }, 0);
  }

  constructor(
    private chargeMessagesStore: DhChargeMessagesDataAccessApiStore,
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
      this.chargeMessagesSearchCriteria.fromDateTime != null &&
      this.chargeMessagesSearchCriteria.chargeId != null &&
      this.chargeMessagesSearchCriteria.toDateTime != null
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
