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
import { NgIf, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DhDrawerDatepickerComponent } from '../drawer-datepicker/dh-drawer-datepicker.component';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';

import { WattDatePipe } from '@energinet-datahub/watt/date';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DhChargePricesDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import {
  ChargePricesSearchCriteriaV1Dto,
  ChargePriceV1Dto,
  ChargeV1Dto,
  ChargeResolution,
  ChargePriceSortColumnName,
} from '@energinet-datahub/dh/shared/domain';
import { RxPush } from '@rx-angular/template/push';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { zonedTimeToUtc } from 'date-fns-tz';
import { getFromDateTime, getToDateTime } from './dh-format-charge-price-time';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    NgIf,
    CurrencyPipe,
    WATT_TABLE,
    DhDrawerDatepickerComponent,
    WattIconComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    WattTooltipDirective,
    WattSpinnerComponent,
    TranslocoModule,
    WattDatePipe,
    WattPaginatorComponent,
    RxPush,
    DhFeatureFlagDirective,
  ],
  selector: 'dh-charges-charge-prices-tab',
  templateUrl: './dh-charges-charge-prices-tab.component.html',
  styleUrls: ['./dh-charges-charge-prices-tab.component.scss'],
  providers: [DhChargePricesDataAccessApiStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargesChargePricesTabComponent implements OnInit, OnChanges {
  @ViewChild(WattPaginatorComponent)
  paginator!: WattPaginatorComponent<unknown>;

  @ViewChild(DhDrawerDatepickerComponent)
  drawerDatepickerComponent!: DhDrawerDatepickerComponent;

  @Input() charge: ChargeV1Dto | undefined;

  private _destroyRef = inject(DestroyRef);
  private _transloco = inject(TranslocoService);
  private _chargePricesStore = inject(DhChargePricesDataAccessApiStore);

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
  totalAmount = this._chargePricesStore.totalAmount$;
  isLoading = this._chargePricesStore.isLoading$;
  hasLoadingError = this._chargePricesStore.hasGeneralError$;
  chargePricesNotFound = this._chargePricesStore.chargePricesNotFound$;
  showDateTime = false;

  displayedColumns = ['fromDateTime', 'time', 'price'];
  columns: WattTableColumnDef<ChargePriceV1Dto> = {
    fromDateTime: { accessor: 'fromDateTime', size: 'max-content' },
    time: { accessor: null },
    toDateTime: { accessor: 'toDateTime', sort: false },
    price: { accessor: 'price', align: 'right', size: 'max-content' },
  };

  readonly dataSource: WattTableDataSource<ChargePriceV1Dto> =
    new WattTableDataSource<ChargePriceV1Dto>();

  translateHeader = (key: string) =>
    key === 'price'
      ? this._transloco.translate('charges.prices.price')
      : this._transloco.translate(`charges.prices.priceTab.${key}`);

  ngOnInit() {
    this._chargePricesStore.all$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((chargePrices) => {
        this.dataSource.data = chargePrices ?? new Array<ChargePriceV1Dto>();
        this.result = chargePrices;
      });

    this._chargePricesStore.totalAmount$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((totalAmount) => {
        if (this.paginator) this.paginator.length = totalAmount;
      });
  }

  ngOnChanges() {
    if (this.charge) {
      this.searchCriteria.chargeId = this.charge.id ?? '';
      this.searchCriteria.skip = 0;

      this.showDateTime =
        this.charge?.resolution == ChargeResolution.PT1H ||
        this.charge?.resolution == ChargeResolution.PT15M;

      if (this.showDateTime) this.displayedColumns = ['fromDateTime', 'time', 'price'];
      else this.displayedColumns = ['fromDateTime', 'toDateTime', 'price'];

      if (this.paginator) {
        this.paginator.length = 0;
        this.paginator.instance.pageIndex = 0;
      }
    }
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

        const dateTimeRange = this.drawerDatepickerComponent.formControlDateRange.value;

        if (dateTimeRange) {
          this.setSearchCriteriaDateRange({
            startDate: dateTimeRange.start,
            endDate: dateTimeRange.end,
          });
        }
        this._chargePricesStore.searchChargePrices(this.searchCriteria);
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
    this._chargePricesStore.searchChargePrices(this.searchCriteria);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlePageEvent(event: any) {
    this.searchCriteria.skip = event.pageIndex * event.pageSize;
    this.searchCriteria.take = event.pageSize;
    this._chargePricesStore.searchChargePrices(this.searchCriteria);
  }
}
