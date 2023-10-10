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
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';

import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersEditModalComponent } from './eo-transfers-edit-modal.component';
import { EoTransfersHistoryComponent } from './eo-transfers-history.component';

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
    WattDatePipe,
    NgIf,
    EoTransfersEditModalComponent,
    EoTransfersHistoryComponent,
  ],
  standalone: true,
  styles: [
    `
      .sub-header {
        font-size: 14px;
        margin-top: var(--watt-space-m);
      }

      watt-drawer-actions {
        align-self: flex-start;
      }
    `,
  ],
  template: `
    <watt-drawer #drawer (closed)="onClose()">
      <watt-drawer-topbar>
        <watt-badge type="success" *ngIf="isActive; else notActive"> Active </watt-badge>
      </watt-drawer-topbar>

      <watt-drawer-heading>
        <h2>{{ transfer?.receiverTin }}</h2>
        <p class="sub-header">
          <span class="watt-label">Period of agreement</span>
          {{ transfer?.startDate | wattDate: 'long' }}－{{ transfer?.endDate | wattDate: 'long' }}
        </p>
      </watt-drawer-heading>

      <watt-drawer-actions>
        <watt-button variant="secondary" *ngIf="isEditable" (click)="transfersEditModal.open()"
          >Edit</watt-button
        >
      </watt-drawer-actions>

      <watt-drawer-content *ngIf="drawer.isOpen">
        <watt-tabs #tabs>
          <watt-tab label="Information">
            <watt-card variant="solid">
              <watt-description-list variant="stack">
                <watt-description-list-item
                  label="Receiver TIN/CVR"
                  [value]="transfer?.receiverTin"
                >
                </watt-description-list-item>
                <watt-description-list-item label="ID" value="{{ transfer?.id }}">
                </watt-description-list-item>
              </watt-description-list>
            </watt-card>
          </watt-tab>
          <watt-tab label="History">
            <watt-card variant="solid">
              <eo-transfers-history *ngIf="tabs.activeTabIndex === 1"></eo-transfers-history>
            </watt-card>
          </watt-tab>
        </watt-tabs>
      </watt-drawer-content>
    </watt-drawer>

    <eo-transfers-edit-modal [transfer]="transfer"></eo-transfers-edit-modal>
    <ng-template #notActive><watt-badge type="neutral">Inactive</watt-badge></ng-template>
  `,
})
export class EoTransfersDrawerComponent {
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;
  @ViewChild(EoTransfersEditModalComponent) transfersEditModal!: EoTransfersEditModalComponent;

  isActive!: boolean;
  isEditable = false;

  private _transfer?: EoListedTransfer;

  @Input() set transfer(transfer: EoListedTransfer | undefined) {
    this._transfer = transfer;

    if (!this._transfer) return;
    this.isActive = this.utils.isDateActive(this._transfer.startDate, this._transfer?.endDate);
    this.isEditable = !this._transfer.endDate || this._transfer.endDate > new Date().getTime();
  }
  get transfer() {
    return this._transfer;
  }

  @Output() closed = new EventEmitter<void>();

  constructor(public utils: SharedUtilities) {}

  open() {
    this.drawer.open();
  }

  onClose() {
    this.closed.emit();
  }
}
