import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChargeLinkDto,
  ChargeType,
} from '@energinet-datahub/dh/shared/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattEmptyStateModule,
  WattIconModule,
  WattIconSize,
} from '@energinet-datahub/watt';
import { MatTableModule } from '@angular/material/table';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

@Component({
  selector: 'dh-charge-item',
  templateUrl: './dh-charge-item.component.html',
  styleUrls: ['./dh-charge-item.component.scss'],
})
export class DhChargeItemComponent {
  @Input() charges: Array<ChargeLinkDto> = [];
  @Input() title: string = '';
  chargeTypes = ChargeType;
  iconSize = WattIconSize;

  constructor() {}
}

@NgModule({
  imports: [
    TranslocoModule,
    CommonModule,
    WattEmptyStateModule,
    MatTableModule,
    DhSharedUiDateTimeModule,
    WattIconModule,
  ],
  declarations: [DhChargeItemComponent],
  exports: [DhChargeItemComponent],
})
export class DhChargeItemScam {}
