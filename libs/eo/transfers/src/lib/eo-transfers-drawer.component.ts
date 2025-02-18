//#region License
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
//#endregion
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  ViewChild,
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
import { translations } from '@energinet-datahub/eo/translations';

import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersEditModalComponent } from './eo-transfers-edit-modal.component';
import { EoTransfersHistoryComponent } from './eo-transfers-history.component';
import { EoActorService, EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { EoTransferInvitationLinkComponent } from './form/eo-invitation-link';
import { TransferAgreementValues } from './eo-transfers.component';

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
    EoTransferInvitationLinkComponent,
    TranslocoPipe,
  ],
  styles: [
    `
      .sub-header {
        font-size: 14px;
        margin-top: var(--watt-space-m);
      }

      watt-drawer-actions {
        align-self: flex-start;
      }

      eo-transfers-invitation-link {
        margin-top: var(--watt-space-l);
      }

      .remove-button {
        --watt-color-primary: var(--watt-color-state-danger);
        --watt-color-primary-dark: var(--watt-color-state-danger);
      }
    `,
  ],
  template: `
    <watt-drawer #drawer (closed)="onClose()">
      <watt-drawer-topbar>
        @if (transfer()?.transferAgreementStatus === 'Active') {
          <watt-badge type="success"
            >{{ translations.transfers.activeTransferAgreement | transloco }}
          </watt-badge>
        } @else if (transfer()?.transferAgreementStatus === 'Proposal') {
          <watt-badge type="warning"
            >{{ translations.transfers.pendingTransferAgreement | transloco }}
          </watt-badge>
        } @else if (transfer()?.transferAgreementStatus === 'ProposalExpired') {
          <watt-badge type="neutral"
            >{{ translations.transfers.expiredTransferAgreementProposals | transloco }}
          </watt-badge>
        } @else {
          <watt-badge type="neutral"
            >{{ translations.transfers.inactiveTransferAgreement | transloco }}
          </watt-badge>
        }
      </watt-drawer-topbar>

      <watt-drawer-heading>
        <h2>
          {{
            transfer()?.receiverName || (translations.transferAgreement.unknownReceiver | transloco)
          }}
          @if (transfer()?.receiverTin) {
            ({{ transfer()?.receiverTin }})
          }
        </h2>
        <p class="sub-header">
          <span class="watt-label">{{
            translations.transferAgreement.periodOfAgreementLabel | transloco
          }}</span>
          {{ transfer()?.startDate | wattDate: 'long' }}
          －{{ transfer()?.endDate | wattDate: 'long' }}
        </p>
      </watt-drawer-heading>

      <watt-drawer-actions>
        @if (
          isEditable() &&
          ownTin() === transfer()?.senderTin &&
          transfer()?.transferAgreementStatus !== 'Proposal'
        ) {
          <watt-button variant="secondary" (click)="transfersEditModal.open()"
            >{{ translations.transferAgreement.editTransferAgreement | transloco }}
          </watt-button>
        }

        @if (transfer() && transfer()?.transferAgreementStatus === 'Proposal') {
          <watt-button
            class="remove-button"
            icon="remove"
            (click)="removeProposal.emit(transfer()?.id); drawer.close()"
            >{{ translations.transferAgreement.remove | transloco }}
          </watt-button>
        }
      </watt-drawer-actions>

      @if (drawer.isOpen()) {
        <watt-drawer-content>
          <watt-tabs #tabs>
            <watt-tab [label]="translations.transferAgreement.informationTab | transloco">
              <watt-card variant="solid">
                <watt-description-list variant="stack">
                  @if (transfer()?.receiverTin) {
                    <watt-description-list-item
                      [label]="translations.transferAgreement.receiverLabel | transloco"
                      [value]="
                        (transfer()?.receiverName ||
                          (translations.transferAgreement.unknownReceiver | transloco)) +
                        ' (' +
                        transfer()?.receiverTin +
                        ')'
                      "
                    />
                  } @else {
                    <watt-description-list-item
                      [label]="translations.transferAgreement.receiverLabel | transloco"
                      [value]="translations.transferAgreement.unknownReceiver | transloco"
                    />
                  }
                  <watt-description-list-item
                    [label]="translations.transferAgreement.idLabel | transloco"
                    value="{{ transfer()?.id }}"
                  />
                </watt-description-list>
              </watt-card>

              @if (transfer() && transfer()?.transferAgreementStatus === 'Proposal') {
                <eo-transfers-invitation-link
                  [proposalId]="transfer()?.id?.toString()"
                  [isNewlyCreated]="false"
                />
              }
            </watt-tab>
            <watt-tab [label]="translations.transferAgreement.historyTab | transloco">
              @if (tabs.activeTabIndex === 1) {
                <eo-transfers-history #history [transfer]="transfer()" />
              }
            </watt-tab>
          </watt-tabs>
        </watt-drawer-content>
      }
    </watt-drawer>

    <eo-transfers-edit-modal
      [transfer]="transfer()"
      [transferAgreements]="transferAgreements()"
      [actors]="actors()"
      (save)="onEdit($event)"
    />
  `,
})
export class EoTransfersDrawerComponent {
  private authService: EoAuthService = inject(EoAuthService);
  private actorService = inject(EoActorService);
  protected translations = translations;
  protected ownTin = signal<string | undefined>(undefined);

  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;
  @ViewChild(EoTransfersEditModalComponent) transfersEditModal!: EoTransfersEditModalComponent;
  @ViewChild(EoTransfersHistoryComponent) history!: EoTransfersHistoryComponent;

  transferAgreements = input<EoListedTransfer[]>([]);
  transfer = input<EoListedTransfer>();
  isEditable = signal<boolean>(false);
  protected actors = this.actorService.actors;

  constructor() {
    effect(() => {
      const transfer = this.transfer();
      this.isEditable.set(!transfer?.endDate || transfer?.endDate > new Date().getTime());
    });
  }

  closed = output<void>();
  removeProposal = output<string | undefined>();
  saveTransferAgreement = output<TransferAgreementValues>();

  onEdit(event: TransferAgreementValues) {
    this.saveTransferAgreement.emit(event);
    if (this.history && this.history.refresh) {
      this.history.refresh();
    }
  }

  open() {
    this.drawer.open();
    this.ownTin.set(this.authService.user()?.profile.org_cvr);
  }

  onClose() {
    this.closed.emit();
  }
}
