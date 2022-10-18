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
  EventEmitter,
  NgModule,
  Output,
  ViewChild,
} from '@angular/core';
import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';
import { DhChargeDetailsHeaderScam } from '../details-header/dh-charge-details-header.component';
import {
  WattDrawerModule,
  WattDrawerComponent,
  WattTabsModule,
  WattButtonModule,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'dh-charges-prices-drawer',
  templateUrl: './dh-charges-prices-drawer.component.html',
  styleUrls: ['./dh-charges-prices-drawer.component.scss'],
})
export class DhChargesPricesDrawerComponent {
  @ViewChild('drawer') drawer!: WattDrawerComponent;

  @Output() closed = new EventEmitter<void>();

  charge?: ChargeV1Dto;

  openDrawer(charge: ChargeV1Dto) {
    this.charge = charge;
    this.drawer.open();
  }

  drawerClosed() {
    this.closed.emit();
  }
}

@NgModule({
  declarations: [DhChargesPricesDrawerComponent],
  exports: [DhChargesPricesDrawerComponent],
  imports: [
    WattDrawerModule,
    TranslocoModule,
    WattTabsModule,
    WattButtonModule,
    DhChargeDetailsHeaderScam,
  ],
})
export class DhChargesPricesDrawerScam {}
