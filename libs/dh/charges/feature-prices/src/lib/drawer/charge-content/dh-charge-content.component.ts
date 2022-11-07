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
 * distributed under the License is distrib./details-header/dh-charge-details-header.component
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, Input, NgModule, ViewChild } from '@angular/core';
import {
  DhChargesChargePricesTabComponent,
  DhChargesChargePricesTabScam,
} from '../charge-content/price-tab/dh-charges-charge-prices-tab.component';
import { TranslocoModule } from '@ngneat/transloco';
import {
  DhChargesChargeMessagesTabComponent,
  DhChargesChargeMessagesTabScam,
} from '../charge-content/message-tab/dh-charges-charge-messages-tab.component';
import { DhChargesChargeHistoryTabScam } from '../charge-content/history-tab/dh-charges-charge-history-tab.component';
import { DhChargeDetailsHeaderScam } from '../charge-content/details-header/dh-charge-details-header.component';
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
    setTimeout(() => {
      this.wattTabsComponents.triggerChange();
    }, 0);
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
