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
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { tap } from 'rxjs';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoTransfersStore } from './eo-transfers.store';
import { EoTransfersTableComponent } from './eo-transfers-table.component';
import { EoBetaMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoTransferAgreementProposal, EoTransfersService } from './eo-transfers.service';
import { EoTransfersRespondProposalComponent } from './eo-transfers-respond-proposal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers',
  imports: [
    WattCardComponent,
    EoTransfersTableComponent,
    EoPopupMessageComponent,
    NgIf,
    RxPush,
    EoBetaMessageComponent,
    WattIconComponent,
    VaterStackComponent,
    EoTransfersRespondProposalComponent,
  ],
  standalone: true,
  template: `
    <eo-popup-message *ngIf="error$ | push" />

    <watt-card class="watt-space-stack-m">
      <eo-transfers-table
        [transfers]="transfers$ | push"
        [loading]="loading$ | push"
        [selectedTransfer]="selectedTransfer$ | push"
        (transferSelected)="store.setSelectedTransfer($event)"
      />
    </watt-card>

    <vater-stack *ngIf="showAutomationError() && (transfers$ | push).length > 0">
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

  protected store = inject(EoTransfersStore);
  protected showAutomationError = signal<boolean>(false);
  private transfersService = inject(EoTransfersService);
  private cd = inject(ChangeDetectorRef);
  private toastService = inject(WattToastService);

  error$ = this.store.error$;
  loading$ = this.store.loadingTransferAgreements$.pipe(
    tap(() => {
      this.cd.detectChanges();
    })
  );
  transfers$ = this.store.transfers$;
  selectedTransfer$ = this.store.selectedTransfer$;

  ngOnInit(): void {
    this.store.getTransfers();
    this.setShowAutomationError();

    if (this.proposalId) {
      this.respondProposal.open();
    }
  }

  onAcceptedProposal(proposal: EoTransferAgreementProposal) {
    this.store.addTransferProposal(proposal);

    this.transfersService.createTransferAgreement(proposal.id).subscribe({
      error: () => {
        this.store.removeTransfer(proposal.id);

        this.toastService.open({
          message: `Creating the transfer agreement failed. Try accepting the proposal again or request the organization that sent the invitation to generate a new link.`,
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
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
