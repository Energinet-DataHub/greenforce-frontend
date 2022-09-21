import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';

import {
  WattIcon,
  WattIconModule,
  WattIconSize,
} from '@energinet-datahub/watt';

@Component({
  selector: 'dh-charges-prices-result',
  templateUrl: './dh-charges-prices-result.component.html',
  styleUrls: ['./dh-charges-prices-result.component.scss']
})
export class DhChargesPricesResultComponent implements OnInit {
  iconSizes = WattIconSize;
  searchResult: Array<any> = [
    {
      id: 1,
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

  constructor() { }

  ngOnInit(): void {
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
  ],
})
export class DhChargesPricesResultScam {}
