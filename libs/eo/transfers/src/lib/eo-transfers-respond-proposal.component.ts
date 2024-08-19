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
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { translations } from '@energinet-datahub/eo/translations';

import { EoTransferAgreementProposal, EoTransfersService } from './eo-transfers.service';

@Component({
  selector: 'eo-transfers-repsond-proposal',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    WATT_MODAL,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattEmptyStateComponent,
    VaterStackComponent,
    WattIconComponent,
    WattDatePipe,
    TranslocoPipe,
  ],
  styles: [
    `
      .transfer-agreement-proposal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--watt-space-m);

        p {
          text-align: center;
        }
      }

      .timeframe {
        display: flex;
        padding: var(--watt-space-s) var(--watt-space-m);
        align-items: center;
        gap: var(--watt-space-s);
        border-radius: 5px;
        background: var(--watt-color-neutral-grey-50);

        watt-icon {
          display: inline-flex;
        }
      }
    `,
  ],
  template: `
    @if (isOpen()) {
      <watt-modal
        #modal
        [title]="translations.respondTransferAgreementProposal.title | transloco"
        [loading]="isLoading()"
        [loadingMessage]="translations.respondTransferAgreementProposal.loadingMessage | transloco"
        [closeLabel]="translations.respondTransferAgreementProposal.closeLabel | transloco"
        (closed)="onClosed()"
      >
        <div class="transfer-agreement-proposal">
          @if (!hasError()) {
            <watt-icon
              name="markEmailUnread"
              size="xxl"
              style="color: var(--watt-color-primary);"
            />
            <h3 class="watt-headline-2">
              {{ translations.respondTransferAgreementProposal.success.title | transloco }}
            </h3>
            <p>
              {{
                translations.respondTransferAgreementProposal.success.message
                  | transloco: { senderName: proposal()?.senderCompanyName }
              }}
            </p>

            <div class="timeframe">
              <strong class="watt-headline-4">{{
                proposal()?.startDate | wattDate: 'long'
              }}</strong>
              <watt-icon name="arrowRightAlt" />
              <strong class="watt-headline-4">{{
                (proposal()?.endDate | wattDate: 'long') ??
                  translations.respondTransferAgreementProposal.noEndDate | transloco
              }}</strong>
            </div>
          } @else {
            <watt-icon name="feedback" size="xxl" state="danger" />
            <h3 class="watt-headline-2">
              {{ translations.respondTransferAgreementProposal.error.title | transloco }}
            </h3>
            <p
              [innerHTML]="translations.respondTransferAgreementProposal.error.message | transloco"
            ></p>
          }
        </div>

        <watt-modal-actions>
          @if (!hasError()) {
            <watt-button variant="secondary" (click)="onDecline()">{{
              translations.respondTransferAgreementProposal.success.declineButton | transloco
            }}</watt-button>
            <watt-button variant="primary" (click)="onAccept()">{{
              translations.respondTransferAgreementProposal.success.acceptButton | transloco
            }}</watt-button>
          } @else {
            <watt-button variant="primary" (click)="modal.close(true)">{{
              translations.respondTransferAgreementProposal.error.declineButton | transloco
            }}</watt-button>
          }
        </watt-modal-actions>
      </watt-modal>
    }
  `,
})
export class EoTransfersRespondProposalComponent implements OnChanges {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @Input() proposalId!: string;
  @Output() accepted = new EventEmitter<EoTransferAgreementProposal>();
  @Output() declined = new EventEmitter<string>();

  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private transfersService = inject(EoTransfersService);

  protected translations = translations;
  protected isOpen = signal<boolean>(false);
  protected isLoading = signal<boolean>(false);
  protected hasError = signal<boolean>(false);
  protected proposal = signal<EoTransferAgreementProposal | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proposalId'] && changes['proposalId'].currentValue) {
      this.isLoading.set(true);
      this.hasError.set(false);

      this.transfersService.getAgreementProposal(changes['proposalId'].currentValue).subscribe({
        next: (proposal) => {
          this.isLoading.set(false);
          this.proposal.set(proposal);
        },
        error: () => {
          this.isLoading.set(false);
          this.hasError.set(true);
        },
      });
    }
  }

  open() {
    this.isOpen.set(true);
    this.cd.detectChanges();
    this.modal.open();
  }

  onClosed() {
    this.isOpen.set(false);
    this.router.navigate([], {
      queryParams: { respondInvite: undefined },
      replaceUrl: true,
    });
  }

  onAccept() {
    this.modal.close(true);
    if (!this.proposal()) return;

    this.accepted.emit(this.proposal() as EoTransferAgreementProposal);
  }

  onDecline() {
    this.declined.emit(this.proposalId);
    this.modal.close(false);
  }
}
