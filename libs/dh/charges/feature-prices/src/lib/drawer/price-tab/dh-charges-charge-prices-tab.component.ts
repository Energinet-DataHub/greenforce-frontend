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
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DhDrawerDatepickerScam } from '../drawer-datepicker/dh-drawer-datepicker.component';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';
import {
  WattIconModule,
  WattButtonModule,
  WattEmptyStateModule,
  WattTooltipModule,
  WattSpinnerModule,
} from '@energinet-datahub/watt';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

import { TranslocoModule } from '@ngneat/transloco';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { DhChargePricesDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import {
  ChargePricesSearchCriteriaV1Dto,
  ChargePriceV1Dto,
  ChargeV1Dto,
  Resolution,
} from '@energinet-datahub/dh/shared/domain';
import { Subject, takeUntil } from 'rxjs';
import { PushModule } from '@rx-angular/template';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { getHours, getMinutes } from 'date-fns';

@Component({
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
  @ViewChild(MatSort) matSort!: MatSort;

  @Input() charge: ChargeV1Dto | undefined;
  constructor(private chargePricesStore: DhChargePricesDataAccessApiStore) {}

  searchCriteria: ChargePricesSearchCriteriaV1Dto = {
    chargeId: '',
    fromDateTime: new Date().toISOString(),
    toDateTime: new Date().toISOString(),
  };

  result: ChargePriceV1Dto[] | undefined;
  isLoading = this.chargePricesStore.isLoading$;
  hasLoadingError = this.chargePricesStore.hasGeneralError$;
  chargePricesNotFound = this.chargePricesStore.chargePricesNotFound$;
  showDateTime = false;
  displayedColumns = ['fromDateTime', 'time', 'price'];

  private destroy$ = new Subject<void>();

  readonly dataSource: MatTableDataSource<ChargePriceV1Dto> =
    new MatTableDataSource<ChargePriceV1Dto>();

  ngOnInit() {
    this.chargePricesStore.all$
      .pipe(takeUntil(this.destroy$))
      .subscribe((chargePrices) => {
        this.dataSource.data = chargePrices ?? new Array<ChargePriceV1Dto>();
        this.result = chargePrices;
        this.dataSource.sort = this.matSort;
      });
  }

  ngOnChanges() {
    if (this.charge) {
      this.searchCriteria.chargeId = this.charge.id ?? '';

      this.showDateTime =
        this.charge?.resolution == Resolution.PT1H ||
        this.charge?.resolution == Resolution.PT15M;

      if (this.showDateTime)
        this.displayedColumns = ['fromDateTime', 'time', 'price'];
      else this.displayedColumns = ['fromDateTime', 'price'];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  dateRangeChanged(dateRange: DatePickerData) {
    this.searchCriteria.fromDateTime = dateRange.startDate;
    this.searchCriteria.toDateTime = dateRange.endDate;

    if (this.charge) this.loadPrices(this.charge);
  }

  loadPrices(charge: ChargeV1Dto) {
    this.searchCriteria.chargeId = charge.id;
    this.chargePricesStore.searchChargePrices(this.searchCriteria);
  }

  getHours(date: string) {
    return this.addLeadingZeros(getHours(new Date(date)), 2);
  }

  getTime(date: string) {
    if (this.charge?.resolution == Resolution.PT1H) return this.getHours(date);

    const minutes = this.addLeadingZeros(getMinutes(new Date(date)), 2);
    const hours = this.getHours(date);
    return `${hours}:${minutes}`;
  }

  addLeadingZeros(number: number, totalLength: number): string {
    return String(number).padStart(totalLength, '0');
  }

  sortData(event: any) {
    console.log(`SortColumnName: ${event.active}`);
    console.log(`IsDescending: ${event.direction === 'desc'}`);
  }

  handlePageEvent(event: any) {
    console.log(`skip: ${event.pageIndex * event.pageSize}`);
    console.log(`take: ${event.pageSize}`);
  }
}

@NgModule({
  declarations: [DhChargesChargePricesTabComponent],
  exports: [DhChargesChargePricesTabComponent],
  imports: [
    CommonModule,
    DhDrawerDatepickerScam,
    WattIconModule,
    WattButtonModule,
    WattEmptyStateModule,
    WattTooltipModule,
    WattSpinnerModule,
    TranslocoModule,
    MatTableModule,
    MatSortModule,
    DhSharedUiPaginatorComponent,
    DhSharedUiDateTimeModule,
    PushModule,
    DhFeatureFlagDirectiveModule,
  ],
})
export class DhChargesChargePricesTabScam {}
