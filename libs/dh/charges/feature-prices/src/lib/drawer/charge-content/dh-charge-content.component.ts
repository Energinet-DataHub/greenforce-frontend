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
import { Component, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DhChargesChargePricesTabComponent } from '../charge-content/price-tab/dh-charges-charge-prices-tab.component';
import { TranslocoModule } from '@ngneat/transloco';
import { DhChargesChargeMessagesTabComponent } from '../charge-content/message-tab/dh-charges-charge-messages-tab.component';
import { DhChargesChargeHistoryTabComponent } from '../charge-content/history-tab/dh-charges-charge-history-tab.component';
import { DhChargeDetailsHeaderComponent } from '../charge-content/details-header/dh-charge-details-header.component';
import { WattTabsComponent, WattTabsModule } from '@energinet-datahub/watt/tabs';
import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';
import { DrawerDatepickerService } from './drawer-datepicker/drawer-datepicker.service';

@Component({
  standalone: true,
  imports: [
    TranslocoModule,
    DhChargeDetailsHeaderComponent,
    DhChargesChargePricesTabComponent,
    DhChargesChargeMessagesTabComponent,
    DhChargesChargeHistoryTabComponent,
    WattTabsModule,
  ],
  selector: 'dh-charge-content',
  templateUrl: './dh-charge-content.component.html',
  styleUrls: ['./dh-charge-content.component.scss'],
  providers: [DrawerDatepickerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
