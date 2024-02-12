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
import {
  JsonPipe,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common';
import { Router } from '@angular/router';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';

import { EoTransferAgreementProposal, EoTransfersService } from './eo-transfers.service';

@Component({
  selector: 'eo-transfers-repsond-proposal',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgIf,
    WATT_MODAL,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattEmptyStateComponent,
    VaterStackComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgTemplateOutlet,
    WattIconComponent,
    WattDatePipe,
    JsonPipe,
  ],
  styles: [
    `
      .transfer-agreement-proposal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--watt-space-m);
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
    <watt-modal
      #modal
      title=""
      [loading]="isLoading()"
      loadingMessage="Please wait while we load the transfer agreement proposal"
      closeLabel="Close modal"
      (closed)="onClosed()"
      *ngIf="isOpen()"
    >
      <div class="transfer-agreement-proposal">
        <ng-container *ngIf="!hasError(); else invalidProposal">
          <watt-icon name="markEmailUnread" size="xxl" style="color: var(--watt-color-primary);" />
          <h3 class="watt-headline-2">Transfer agreement proposal</h3>
          <p>{{ proposal()?.senderCompanyName }} wants to make a transfer agreement with you.</p>

          <div class="timeframe">
            <strong class="watt-headline-4">{{ proposal()?.startDate | wattDate: 'long' }}</strong>
            <watt-icon name="arrowRightAlt" />
            <strong class="watt-headline-4">{{
              (proposal()?.endDate | wattDate: 'long') ?? 'No end date'
            }}</strong>
          </div>
        </ng-container>

        <ng-template #invalidProposal>
          <watt-icon name="feedback" size="xxl" state="danger" />
          <h3 class="watt-headline-2">Invalid transfer agreement proposal</h3>
          <p>The transfer agreement proposal you just clicked is not valid</p>
          <p>If this is not what you expected, please contact the sender of the link.</p>
        </ng-template>
      </div>

      <watt-modal-actions>
        <ng-container *ngIf="!hasError(); else invalidActions">
          <watt-button variant="secondary" (click)="onDecline()"> Decline </watt-button>
          <watt-button variant="primary" (click)="onAccept()">Accept</watt-button>
        </ng-container>

        <ng-template #invalidActions>
          <watt-button variant="primary" (click)="onDecline()">Ok</watt-button>
        </ng-template>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoTransfersRespondProposalComponent implements OnChanges {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @Input() proposalId!: string;
  @Output() accepted = new EventEmitter<EoTransferAgreementProposal>();

  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private transfersService = inject(EoTransfersService);

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
    this.modal.close(false);
  }
}
