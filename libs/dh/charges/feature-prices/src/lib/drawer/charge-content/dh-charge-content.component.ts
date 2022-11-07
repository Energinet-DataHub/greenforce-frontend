import { Component, Input, NgModule, ViewChild } from '@angular/core';
import {
  DhChargesChargePricesTabComponent,
  DhChargesChargePricesTabScam,
} from '../price-tab/dh-charges-charge-prices-tab.component';
import { TranslocoModule } from '@ngneat/transloco';
import {
  DhChargesChargeMessagesTabComponent,
  DhChargesChargeMessagesTabScam,
} from '../message-tab/dh-charges-charge-messages-tab.component';
import { DhChargesChargeHistoryTabScam } from '../history-tab/dh-charges-charge-history-tab.component';
import { DhChargeDetailsHeaderScam } from '../../details-header/dh-charge-details-header.component';
import {
  WattTabsComponent,
  WattTabsModule,
} from '@energinet-datahub/watt/tabs';
import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-charge-content',
  templateUrl: './dh-charge-content.component.html',
  styleUrls: ['./dh-charge-content.component.scss'],
})
export class DhChargeContentComponent {
  @ViewChild(DhChargesChargeMessagesTabComponent)
  chargesMessageTabComponent!: DhChargesChargeMessagesTabComponent;
  @ViewChild(DhChargesChargePricesTabComponent)
  chargePricesTabComponent!: DhChargesChargePricesTabComponent;
  @ViewChild(WattTabsComponent)
  wattTabsComponents!: WattTabsComponent;

  @Input() charge?: ChargeV1Dto;

  load() {
    this.wattTabsComponents.triggerChange();
  }

  loadPrices() {
    if (this.charge) this.chargePricesTabComponent.loadPrices(this.charge);
  }

  loadMessages() {
    if (this.charge) this.chargesMessageTabComponent.loadMessages(this.charge);
  }

  loadHistory() {
    console.log('load history');
  }
}

@NgModule({
  declarations: [DhChargeContentComponent],
  exports: [DhChargeContentComponent],
  imports: [
    TranslocoModule,
    DhChargeDetailsHeaderScam,
    DhChargesChargePricesTabScam,
    DhChargesChargeMessagesTabScam,
    DhChargesChargeHistoryTabScam,
    WattTabsModule,
  ],
})
export class DhChargeContentScam {}
