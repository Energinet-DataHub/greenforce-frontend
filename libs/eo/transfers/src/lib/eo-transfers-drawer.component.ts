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
import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { EoListedTransfer } from './eo-transfers.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-drawer',
  imports: [
    WATT_DRAWER,
    WattButtonComponent,
    WattBadgeComponent,
    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattTabsComponent,
    WattTabComponent,
    DatePipe,
    NgIf,
  ],
  standalone: true,
  styles: [``],
  template: `
    <watt-drawer #drawer (closed)="onClose()">
      <watt-drawer-topbar>
        <watt-badge
          type="success"
          *ngIf="transfer && utils.isDateActive(transfer.endDate); else notActive"
        >
          Active
        </watt-badge>
      </watt-drawer-topbar>

      <watt-drawer-heading>
        <h2>{{ transfer?.receiverTin }}</h2>
      </watt-drawer-heading>

      <watt-drawer-actions>
        <watt-button variant="secondary" [disabled]="true">Edit</watt-button>
      </watt-drawer-actions>

      <watt-drawer-content *ngIf="drawer.isOpen">
        <watt-tabs>
          <watt-tab label="Information">
            <watt-card variant="solid"
              ><watt-description-list variant="stack">
                <watt-description-list-item
                  label="Period"
                  value="{{ transfer?.startDate | date : 'dd/MM/yyyy' }} - {{
                    transfer?.endDate | date : 'dd/MM/yyyy'
                  }}"
                >
                </watt-description-list-item>
                <watt-description-list-item
                  label="Receiver TIN/CVR"
                  value="{{ transfer?.receiverTin }}"
                >
                </watt-description-list-item>
                <watt-description-list-item label="ID" value="{{ transfer?.id }}">
                </watt-description-list-item>
              </watt-description-list>
            </watt-card>
          </watt-tab>
        </watt-tabs>
      </watt-drawer-content>
    </watt-drawer>

    <ng-template #notActive><watt-badge type="neutral">Inactive</watt-badge></ng-template>
  `,
})
export class EoTransfersDrawerComponent {
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  transfer: EoListedTransfer | undefined;

  constructor(public utils: SharedUtilities) {}

  open(transfer: EoListedTransfer): void {
    this.transfer = transfer;
    this.drawer.open();
  }

  onClose() {
    this.drawer.close();
  }
}
