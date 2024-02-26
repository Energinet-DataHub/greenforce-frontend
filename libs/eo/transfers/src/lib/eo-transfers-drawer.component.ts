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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

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
import { translations } from '@energinet-datahub/eo/translations';

import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersEditModalComponent } from './eo-transfers-edit-modal.component';
import { EoTransfersHistoryComponent } from './eo-transfers-history.component';
import { EoAuthStore } from '@energinet-datahub/eo/shared/services';

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
    EoTransfersEditModalComponent,
    EoTransfersHistoryComponent,
    TranslocoPipe,
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
        @if (isActive) {
          <watt-badge type="success">{{ translations.transferAgreement.active | transloco }}</watt-badge>
        } @else {
          <watt-badge type="neutral">{{ translations.transferAgreement.inactive | transloco }}</watt-badge>
        }
      </watt-drawer-topbar>

      <watt-drawer-heading>
        <h2>{{ transfer?.receiverTin }} - {{ transfer?.receiverName || translations.transferAgreement.unknownReceiver | transloco }}</h2>
        <p class="sub-header">
          <span class="watt-label">{{ translations.transferAgreement.periodOfAgreementLabel | transloco }}</span>
          {{ transfer?.startDate | wattDate: 'long' }}－{{ transfer?.endDate | wattDate: 'long' }}
        </p>
      </watt-drawer-heading>

      <watt-drawer-actions>
        @if (isEditable && ownTin() === transfer?.senderTin) {
          <watt-button variant="secondary" (click)="transfersEditModal.open()">{{ translations.transferAgreement.editTransferAgreement | transloco }}</watt-button>
        }
      </watt-drawer-actions>

      @if (drawer.isOpen) {
        <watt-drawer-content>
          <watt-tabs #tabs>
            <watt-tab [label]="translations.transferAgreement.informationTab | transloco">
              <watt-card variant="solid">
                <watt-description-list variant="stack">
                  <watt-description-list-item
                    [label]="translations.transferAgreement.receiverLabel | transloco"
                    [value]="
                      transfer?.receiverTin + ' - ' + (transfer?.receiverName || translations.transferAgreement.unknownReceiver | transloco)
                    "
                  />
                  <watt-description-list-item [label]="translations.transferAgreement.idLabel | transloco" value="{{ transfer?.id }}" />
                </watt-description-list>
              </watt-card>
            </watt-tab>
            <watt-tab [label]="translations.transferAgreement.historyTab | transloco">
              <watt-card variant="solid">
                @if(tabs.activeTabIndex === 1) {
                  <eo-transfers-history [transfer]="transfer" />
                }
              </watt-card>
            </watt-tab>
          </watt-tabs>
        </watt-drawer-content>
      }
    </watt-drawer>

    <eo-transfers-edit-modal
      [transfer]="transfer"
      [transferAgreements]="transferAgreements"
      (save)="saveTransferAgreement.emit($event)"
    />
  `,
})
export class EoTransfersDrawerComponent {
  private utils = inject(SharedUtilities);
  protected authStore = inject(EoAuthStore);
  protected translations = translations;

  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;
  @ViewChild(EoTransfersEditModalComponent) transfersEditModal!: EoTransfersEditModalComponent;

  isActive!: boolean;
  isEditable = false;

  @Input() transferAgreements: EoListedTransfer[] = [];
  @Output() saveTransferAgreement = new EventEmitter();

  private _transfer?: EoListedTransfer;

  @Input()
  set transfer(transfer: EoListedTransfer | undefined) {
    this._transfer = transfer;

    if (!this._transfer) return;
    this.isActive = this.utils.isDateActive(this._transfer.startDate, this._transfer?.endDate);
    this.isEditable = !this._transfer.endDate || this._transfer.endDate > new Date().getTime();
  }
  get transfer() {
    return this._transfer;
  }

  protected ownTin = signal<string | undefined>(undefined);

  @Output()
  closed = new EventEmitter<void>();

  open() {
    this.drawer.open();

    this.authStore.getTin$.subscribe((tin) => {
      this.ownTin.set(tin);
    });
  }

  onClose() {
    this.closed.emit();
  }
}
