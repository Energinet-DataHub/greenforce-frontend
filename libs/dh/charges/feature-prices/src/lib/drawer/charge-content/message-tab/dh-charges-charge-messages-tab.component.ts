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
  OnInit,
  OnChanges,
  ViewChild,
  inject,
  DestroyRef,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { DhChargeMessagesDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import {
  ChargeMessagesSearchCriteriaV1Dto,
  ChargeMessageV1Dto,
  ChargeV1Dto,
  ChargeMessageSortColumnName,
} from '@energinet-datahub/dh/shared/domain';
import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { ToLowerSort } from '@energinet-datahub/dh/shared/util-table';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';
import { DhDrawerDatepickerComponent } from '../drawer-datepicker/dh-drawer-datepicker.component';
import { zonedTimeToUtc } from 'date-fns-tz';
import { DhChargesPricesDrawerService } from '../../dh-charges-prices-drawer.service';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    NgIf,
    WATT_TABLE,
    TranslocoModule,
    RxLet,
    RxPush,
    WattButtonComponent,
    WattEmptyStateComponent,
    WattTooltipDirective,
    WattSpinnerComponent,
    WattDatePipe,
    WattPaginatorComponent,
    DhDrawerDatepickerComponent,
  ],
  selector: 'dh-charges-charge-messages-tab',
  templateUrl: './dh-charges-charge-messages-tab.component.html',
  styleUrls: ['./dh-charges-charge-messages-tab.component.scss'],
  providers: [DhChargeMessagesDataAccessApiStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargesChargeMessagesTabComponent implements OnInit, OnChanges {
  @ViewChild(WattPaginatorComponent)
  paginator!: WattPaginatorComponent<unknown>;

  @ViewChild(DhDrawerDatepickerComponent)
  drawerDatepickerComponent!: DhDrawerDatepickerComponent;

  @Input() charge: ChargeV1Dto | undefined;

  private _transloco = inject(TranslocoService);
  private _destroyRef = inject(DestroyRef);
  private _chargeMessagesStore = inject(DhChargeMessagesDataAccessApiStore);
  private _dhChargesPricesDrawerService = inject(DhChargesPricesDrawerService);

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
  isLoading = this._chargeMessagesStore.isLoading$;
  hasLoadingError = this._chargeMessagesStore.hasGeneralError$;
  chargeMessagesNotFound = this._chargeMessagesStore.chargeMessagesNotFound$;
  totalCount = this._chargeMessagesStore.totalCount$;

  columns: WattTableColumnDef<ChargeMessageV1Dto> = {
    messageId: { accessor: 'messageId' },
    date: { accessor: 'messageDateTime', size: 'max-content' },
    messageType: { accessor: 'messageType', size: 'max-content' },
  };

  readonly dataSource: WattTableDataSource<ChargeMessageV1Dto> =
    new WattTableDataSource<ChargeMessageV1Dto>();

  translateHeader = (key: string) => this._transloco.translate(`charges.prices.drawer.${key}`);

  ngOnInit() {
    this._chargeMessagesStore.all$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((chargeMessages) => {
        this.dataSource.data = chargeMessages ?? new Array<ChargeMessageV1Dto>();
        this.result = chargeMessages;
      });

    this._chargeMessagesStore.totalCount$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((totalCount) => {
        if (this.paginator) this.paginator.length = totalCount;
      });
  }

  ngOnChanges() {
    if (this.result) this.dataSource.data = this.result;
  }

  dateRangeChanged(dateRange: DatePickerData) {
    this.setSearchCriteriaDateRange(dateRange);

    if (this.charge) this.loadMessages(this.charge);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowClicked(message: ChargeMessageV1Dto) {
    this.openMessage(message);
  }

  loadMessages(charge: ChargeV1Dto) {
    this.chargeMessagesSearchCriteria.chargeId = charge.id;
    this.chargeMessagesSearchCriteria.take = this.paginator.instance.pageSize;

    const dateTimeRange = this.drawerDatepickerComponent.formControlDateRange.value;

    if (dateTimeRange) {
      this.setSearchCriteriaDateRange({
        startDate: dateTimeRange.start,
        endDate: dateTimeRange.end,
      });
    }
    this._chargeMessagesStore.searchChargeMessages(this.chargeMessagesSearchCriteria);

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

  openMessage(message: ChargeMessageV1Dto) {
    if (message.messageId == undefined) return;

    this._dhChargesPricesDrawerService.setMessage(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortData(event: any) {
    this.chargeMessagesSearchCriteria.chargeMessageSortColumnName = event.active;
    this.chargeMessagesSearchCriteria.isDescending = event.direction === 'desc';
    this._chargeMessagesStore.searchChargeMessages(this.chargeMessagesSearchCriteria);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlePageEvent(event: any) {
    this.chargeMessagesSearchCriteria.skip = event.pageIndex * event.pageSize;
    this.chargeMessagesSearchCriteria.take = event.pageSize;
    this._chargeMessagesStore.searchChargeMessages(this.chargeMessagesSearchCriteria);
  }
}
