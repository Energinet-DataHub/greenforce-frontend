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
  Input,
  NgModule,
  OnChanges,
  OnInit,
  SimpleChanges,
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
} from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-charges-charge-prices-tab',
  templateUrl: './dh-charges-charge-prices-tab.component.html',
  styleUrls: ['./dh-charges-charge-prices-tab.component.scss'],
  providers: [DhChargePricesDataAccessApiStore],
})
export class DhChargesChargePricesTabComponent implements OnInit, OnChanges {
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;
  @ViewChild(MatSort) matSort!: MatSort;

  @Input() charge: ChargeV1Dto | undefined;
  constructor(private chargePricesStore: DhChargePricesDataAccessApiStore) {}

  searchCriteria: ChargePricesSearchCriteriaV1Dto = {
    chargeId: '',
    fromDateTime: '',
    toDateTime: '',
  };

  result: ChargePriceV1Dto[] | undefined;
  all$ = this.chargePricesStore.all$;

  displayedColumns = ['fromDateTime', 'toDateTime', 'price'];

  readonly dataSource: MatTableDataSource<ChargePriceV1Dto> =
    new MatTableDataSource<ChargePriceV1Dto>();

  ngOnInit() {
    this.all$.subscribe((chargePrices) => {
      if (chargePrices) {
        this.dataSource.data = chargePrices;
        this.result = chargePrices;
      }

      this.dataSource.paginator = this.paginator?.instance;
      this.dataSource.sort = this.matSort;
    });
  }

  ngOnChanges() {
    console.log(this.charge);
    if (this.charge) this.searchCriteria.chargeId = this.charge.chargeId ?? '';
  }

  dateRangeChanged(dateRange: DatePickerData) {
    console.log(dateRange);
  }

  loadMessages() {
    this.chargePricesStore.searchChargePrices(this.searchCriteria);
  }
}

@NgModule({
  declarations: [DhChargesChargePricesTabComponent],
  exports: [DhChargesChargePricesTabComponent],
  imports: [
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
  ],
})
export class DhChargesChargePricesTabScam {}
