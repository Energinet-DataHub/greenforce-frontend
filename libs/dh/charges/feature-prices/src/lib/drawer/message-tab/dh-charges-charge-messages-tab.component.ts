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
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@rx-angular/template';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
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
  DhFeatureFlagsService,
} from '@energinet-datahub/dh/shared/feature-flags';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';
import {
  DhDrawerDatepickerComponent,
  DhDrawerDatepickerScam,
} from '../drawer-datepicker/dh-drawer-datepicker.component';
import { zonedTimeToUtc } from 'date-fns-tz';

@Component({
  selector: 'dh-charges-charge-messages-tab',
  templateUrl: './dh-charges-charge-messages-tab.component.html',
  styleUrls: ['./dh-charges-charge-messages-tab.component.scss'],
  providers: [DhChargeMessagesDataAccessApiStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargesChargeMessagesTabComponent
  implements OnInit, OnChanges, OnDestroy
{
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(DhDrawerDatepickerComponent)
  drawerDatepickerComponent!: DhDrawerDatepickerComponent;

  @Input() charge: ChargeV1Dto | undefined;

  constructor(
    private chargeMessagesStore: DhChargeMessagesDataAccessApiStore,
    @Inject(DhFeatureFlagsService)
    private featureFlagsService: DhFeatureFlagsService
  ) {}

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

  result: ChargeMessageV1Dto[] | undefined;
  isLoading = this.chargeMessagesStore.isLoading$;
  hasLoadingError = this.chargeMessagesStore.hasGeneralError$;
  chargeMessageNotFound = this.chargeMessagesStore.chargeMessagesNotFound$;
  displayedColumns = ['messageId', 'messageDateTime', 'messageType'];

  private destroy$ = new Subject<void>();

  readonly dataSource: MatTableDataSource<ChargeMessageV1Dto> =
    new MatTableDataSource<ChargeMessageV1Dto>();

  ngOnInit() {
    this.chargeMessagesStore.all$
      .pipe(takeUntil(this.destroy$))
      .subscribe((chargeMessages) => {
        this.dataSource.data =
          chargeMessages ?? new Array<ChargeMessageV1Dto>();
        this.result = chargeMessages;
        this.dataSource.sort = this.matSort;
      });

      this.chargeMessagesStore.totalCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalCount) => {
        if (this.paginator) this.paginator.length = totalCount;
      });
  }

  ngOnChanges() {
    if (this.result) this.dataSource.data = this.result;

    this.dataSource.sort = this.matSort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dateRangeChanged(dateRange: DatePickerData) {
    this.setSearchCriteriaDateRange(dateRange);

    if (this.charge) this.loadMessages(this.charge);
  }

  rowClicked(message: string) {
    this.openMessage(message);
  }

  loadMessages(charge: ChargeV1Dto) {
    setTimeout(() => {
      this.chargeMessagesSearchCriteria.chargeId = charge.id;
      this.chargeMessagesSearchCriteria.take = this.paginator.instance.pageSize;

      const dateTimeRange =
        this.drawerDatepickerComponent.formControlDateRange.value;

      if (dateTimeRange) {
        this.setSearchCriteriaDateRange({
          startDate: dateTimeRange.start,
          endDate: dateTimeRange.end,
        });
      }
      this.chargeMessagesStore.searchChargeMessages(
        this.chargeMessagesSearchCriteria
      );
    }, 0);

    this.dataSource.sortingDataAccessor = ToLowerSort();
  }

  setSearchCriteriaDateRange(dateRange: DatePickerData) {
    this.chargeMessagesSearchCriteria.fromDateTime = zonedTimeToUtc(
      dateRange.startDate,
      this.localTimeZone
    ).toISOString();
    this.chargeMessagesSearchCriteria.toDateTime = zonedTimeToUtc(
      dateRange.endDate,
      this.localTimeZone
    ).toISOString();
  }

  openMessage(message: string) {
    console.log(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortData(event: any) {
    this.chargeMessagesSearchCriteria.chargeMessageSortColumnName =
      event.active;
    this.chargeMessagesSearchCriteria.isDescending = event.direction === 'desc';
    this.chargeMessagesStore.searchChargeMessages(
      this.chargeMessagesSearchCriteria
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlePageEvent(event: any) {
    this.chargeMessagesSearchCriteria.skip = event.pageIndex * event.pageSize;
    this.chargeMessagesSearchCriteria.take = event.pageSize;
    this.chargeMessagesStore.searchChargeMessages(
      this.chargeMessagesSearchCriteria
    );
  }
}

@NgModule({
  declarations: [DhChargesChargeMessagesTabComponent],
  exports: [DhChargesChargeMessagesTabComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    TranslocoModule,
    LetModule,
    PushModule,
    WattButtonModule,
    WattEmptyStateModule,
    WattTooltipModule,
    WattSpinnerModule,
    DhSharedUiDateTimeModule,
    DhSharedUiPaginatorComponent,
    DhSharedUiDateTimeModule,
    DhDrawerDatepickerScam,
    DhFeatureFlagDirectiveModule,
  ],
})
export class DhChargesChargeMessagesTabScam {}
