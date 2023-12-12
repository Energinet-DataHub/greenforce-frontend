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
  Input,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoTransfersTableComponent } from './eo-transfers-table.component';
import { EoBetaMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import {
  EoListedTransfer,
  EoTransferAgreementProposal,
  EoTransfersService,
} from './eo-transfers.service';
import { EoTransfersRespondProposalComponent } from './eo-transfers-respond-proposal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers',
  imports: [
    WattCardComponent,
    EoTransfersTableComponent,
    EoPopupMessageComponent,
    NgIf,
    EoBetaMessageComponent,
    WattIconComponent,
    VaterStackComponent,
    EoTransfersRespondProposalComponent,
  ],
  standalone: true,
  template: `
    <eo-popup-message *ngIf="transferAgreements().error" />

    <watt-card class="watt-space-stack-m">
      <eo-transfers-table
        [transfers]="transferAgreements().data"
        [loading]="transferAgreements().loading"
        [selectedTransfer]="selectedTransfer()"
        (transferSelected)="selectedTransfer.set($event)"
      />
    </watt-card>

    <vater-stack *ngIf="showAutomationError() && transferAgreements().data.length > 0">
      <p style="display: flex; gap: var(--watt-space-xs);">
        <watt-icon name="warning" fill />We are currently experiencing an issue handling
        certificates<br />
      </p>
      <small>Once we resolve the issue, the outstanding transfers will update automatically.</small>
    </vater-stack>

    <!-- Respond proposal modal -->
    <eo-transfers-repsond-proposal
      [proposalId]="proposalId"
      (accepted)="onAcceptedProposal($event)"
    />
  `,
})
export class EoTransfersComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('respond-proposal') proposalId!: string;

  @ViewChild(EoTransfersRespondProposalComponent, { static: true })
  respondProposal!: EoTransfersRespondProposalComponent;

  private transfersService = inject(EoTransfersService);
  private toastService = inject(WattToastService);

  protected transferAgreements = signal<{
    loading: boolean;
    error: boolean;
    data: EoListedTransfer[];
  }>({
    loading: false,
    error: false,
    data: [],
  });
  protected selectedTransfer = signal<EoListedTransfer | undefined>(undefined);
  protected showAutomationError = signal(false);

  ngOnInit(): void {
    this.getTransfers();
    this.setShowAutomationError();

    if (this.proposalId) {
      this.respondProposal.open();
    }
  }

  protected onAcceptedProposal(proposal: EoTransferAgreementProposal) {
    this.addTransferProposal(proposal);

    this.transfersService.createTransferAgreement(proposal.id).subscribe({
      error: () => {
        this.removeTransfer(proposal.id);

        this.toastService.open({
          message: `Creating the transfer agreement failed. Try accepting the proposal again or request the organization that sent the invitation to generate a new link.`,
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });
      },
    });
  }

  private addTransferProposal(proposal: EoTransferAgreementProposal) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: [
        ...this.transferAgreements().data,
        {
          id: proposal.id,
          startDate: proposal.startDate / 1000,
          endDate: proposal.endDate ? proposal.endDate / 1000 : null,
          senderName: proposal.senderCompanyName,
          senderTin: '',
          receiverTin: proposal.receiverTin,
        },
      ],
    });
  }

  private removeTransfer(id: string) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: this.transferAgreements().data.filter((transfer) => transfer.id !== id),
    });
  }

  private getTransfers() {
    this.transferAgreements.set({
      loading: true,
      error: false,
      data: [],
    });
    this.transfersService.getTransfers().subscribe({
      next: (transferAgreements: EoListedTransfer[]) => {
        this.transferAgreements.set({
          loading: false,
          error: false,
          data: transferAgreements.map((transferAgreement) => {
            return {
              ...transferAgreement,
              startDate: transferAgreement.startDate * 1000,
              endDate: transferAgreement.endDate ? transferAgreement.endDate * 1000 : null,
            };
          }),
        });
      },
      error: () => {
        this.transferAgreements.set({
          loading: false,
          error: true,
          data: [],
        });
      },
    });
  }

  private setShowAutomationError() {
    this.transfersService.transferAutomationHasError().subscribe({
      next: (x) => {
        x ? this.showAutomationError.set(true) : this.showAutomationError.set(false);
      },
      error: () => this.showAutomationError.set(true),
    });
  }
}
