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
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DhDrawerDatepickerComponent } from '../drawer-datepicker/dh-drawer-datepicker.component';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { DhChargePricesDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import {
  ChargePricesSearchCriteriaV1Dto,
  ChargePriceV1Dto,
  ChargeV1Dto,
  Resolution,
  ChargePriceSortColumnName,
} from '@energinet-datahub/dh/shared/domain';
import { Subject, takeUntil } from 'rxjs';
import { PushModule } from '@rx-angular/template';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { zonedTimeToUtc } from 'date-fns-tz';
import { getFromDateTime, getToDateTime } from './dh-format-charge-price-time';

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    DhDrawerDatepickerComponent,
    WattIconModule,
    WattButtonModule,
    WattEmptyStateModule,
    WattTooltipDirective,
    WattSpinnerModule,
    TranslocoModule,
    DhSharedUiPaginatorComponent,
    DhSharedUiDateTimeModule,
    PushModule,
    DhFeatureFlagDirectiveModule,
  ],
  selector: 'dh-charges-charge-prices-tab',
  templateUrl: './dh-charges-charge-prices-tab.component.html',
  styleUrls: ['./dh-charges-charge-prices-tab.component.scss'],
  providers: [DhChargePricesDataAccessApiStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargesChargePricesTabComponent
  implements OnInit, OnChanges, OnDestroy
{
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;

  @ViewChild(DhDrawerDatepickerComponent)
  drawerDatepickerComponent!: DhDrawerDatepickerComponent;

  @Input() charge: ChargeV1Dto | undefined;

  private transloco = inject(TranslocoService);
  private chargePricesStore = inject(DhChargePricesDataAccessApiStore);

  localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  searchCriteria: ChargePricesSearchCriteriaV1Dto = {
    chargeId: '',
    fromDateTimeUtc: zonedTimeToUtc(
      new Date(new Date().toDateString()),
      this.localTimeZone
    ).toISOString(),
    toDateTimeUtc: zonedTimeToUtc(
      new Date(new Date().toDateString()),
      this.localTimeZone
    ).toISOString(),
    isDescending: false,
    sortColumnName: ChargePriceSortColumnName.FromDateTime,
    skip: 0,
    take: 0,
  };

  result: ChargePriceV1Dto[] | undefined;
  totalAmount = this.chargePricesStore.totalAmount$;
  isLoading = this.chargePricesStore.isLoading$;
  hasLoadingError = this.chargePricesStore.hasGeneralError$;
  chargePricesNotFound = this.chargePricesStore.chargePricesNotFound$;
  showDateTime = false;

  displayedColumns = ['fromDateTime', 'time', 'price'];
  columns: WattTableColumnDef<ChargePriceV1Dto> = {
    fromDateTime: { accessor: 'fromDateTime', size: 'max-content' },
    time: { accessor: null },
    toDateTime: { accessor: 'toDateTime', sort: false },
    price: { accessor: 'price', align: 'right', size: 'max-content' },
  };

  private destroy$ = new Subject<void>();

  readonly dataSource: WattTableDataSource<ChargePriceV1Dto> =
    new WattTableDataSource<ChargePriceV1Dto>();

  translateHeader = (key: string) =>
    key === 'price'
      ? this.transloco.translate('charges.prices.price')
      : this.transloco.translate(`charges.prices.priceTab.${key}`);

  ngOnInit() {
    this.chargePricesStore.all$
      .pipe(takeUntil(this.destroy$))
      .subscribe((chargePrices) => {
        this.dataSource.data = chargePrices ?? new Array<ChargePriceV1Dto>();
        this.result = chargePrices;
      });

    this.chargePricesStore.totalAmount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalAmount) => {
        if (this.paginator) this.paginator.length = totalAmount;
      });
  }

  ngOnChanges() {
    if (this.charge) {
      this.searchCriteria.chargeId = this.charge.id ?? '';
      this.searchCriteria.skip = 0;

      this.showDateTime =
        this.charge?.resolution == Resolution.PT1H ||
        this.charge?.resolution == Resolution.PT15M;

      if (this.showDateTime)
        this.displayedColumns = ['fromDateTime', 'time', 'price'];
      else this.displayedColumns = ['fromDateTime', 'toDateTime', 'price'];

      if (this.paginator) {
        this.paginator.length = 0;
        this.paginator.instance.pageIndex = 0;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  dateRangeChanged(dateRange: DatePickerData) {
    this.setSearchCriteriaDateRange(dateRange);

    if (this.charge) this.loadPrices(this.charge);
  }

  getFromDateTime(price: ChargePriceV1Dto) {
    if (this.charge) return getFromDateTime(price, this.charge.resolution);
    return undefined;
  }

  getToDateTime(price: ChargePriceV1Dto) {
    if (this.charge) return getToDateTime(price, this.charge.resolution);
    return undefined;
  }

  loadPrices(charge: ChargeV1Dto) {
    setTimeout(() => {
      if (charge?.hasAnyPrices) {
        this.searchCriteria.chargeId = charge.id;
        this.searchCriteria.take = this.paginator.instance.pageSize;

        const dateTimeRange =
          this.drawerDatepickerComponent.formControlDateRange.value;

        if (dateTimeRange) {
          this.setSearchCriteriaDateRange({
            startDate: dateTimeRange.start,
            endDate: dateTimeRange.end,
          });
        }
        this.chargePricesStore.searchChargePrices(this.searchCriteria);
      }
    }, 0);
  }

  setSearchCriteriaDateRange(dateRange: DatePickerData) {
    this.searchCriteria.fromDateTimeUtc = zonedTimeToUtc(
      dateRange.startDate,
      this.localTimeZone
    ).toISOString();
    this.searchCriteria.toDateTimeUtc = zonedTimeToUtc(
      dateRange.endDate,
      this.localTimeZone
    ).toISOString();
  }

  reset() {
    this.searchCriteria = {
      chargeId: '',
      fromDateTimeUtc: new Date().toISOString(),
      toDateTimeUtc: new Date().toISOString(),
      isDescending: false,
      sortColumnName: ChargePriceSortColumnName.FromDateTime,
      skip: 0,
      take: 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortData(event: any) {
    this.searchCriteria.sortColumnName = event.active;
    this.searchCriteria.isDescending = event.direction === 'desc';
    this.chargePricesStore.searchChargePrices(this.searchCriteria);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlePageEvent(event: any) {
    this.searchCriteria.skip = event.pageIndex * event.pageSize;
    this.searchCriteria.take = event.pageSize;
    this.chargePricesStore.searchChargePrices(this.searchCriteria);
  }
}
