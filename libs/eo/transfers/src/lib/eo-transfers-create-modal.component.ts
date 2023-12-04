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
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { Observable, of } from 'rxjs';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { EoTransfersService } from './eo-transfers.service';
import { EoExistingTransferAgreement, EoTransfersStore } from './eo-transfers.store';
import { EoTransfersFormComponent } from './form/eo-transfers-form.component';
import { EoAuthStore } from '@energinet-datahub/eo/shared/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-create-modal',
  imports: [
    WATT_MODAL,
    WattValidationMessageComponent,
    NgIf,
    EoTransfersFormComponent,
    RxPush,
    WattSpinnerComponent,
  ],
  standalone: true,
  template: `
    <watt-modal
      #modal
      title="New transfer agreement"
      closeLabel="Close modal"
      (closed)="onClosed()"
      *ngIf="opened"
    >
      <!-- We don't use the build-in loading state for the modal, since it wont update properly -->
      <div
        class="watt-modal__spinner"
        style="z-index: 1;"
        *ngIf="creatingTransferAgreementProposal"
      >
        <watt-spinner />
      </div>

      <eo-transfers-form
        [senderTin]="authStore.getTin$ | push"
        [existingTransferAgreements]="existingTransferAgreements$ | push"
        [generateProposalFailed]="creatingTransferAgreementProposalFailed"
        [proposalId]="proposalId"
        (receiverTinChanged)="onReceiverTinChange($event)"
        (submitted)="createAgreementProposal($event)"
        (canceled)="modal.close(false)"
      />
    </watt-modal>
  `,
})
export class EoTransfersCreateModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected creatingTransferAgreementProposal = false;
  protected creatingTransferAgreementProposalFailed = false;
  protected isFormValid = false;
  protected opened = false;
  protected existingTransferAgreements$: Observable<EoExistingTransferAgreement[]> = of([]);
  protected proposalId: null | string = null;

  protected authStore = inject(EoAuthStore);
  private service = inject(EoTransfersService);
  private store = inject(EoTransfersStore);
  private cd = inject(ChangeDetectorRef);

  open() {
    /**
     * This is a workaround for "lazy loading" the modal content
     */
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  onClosed() {
    this.creatingTransferAgreementProposal = false;
    this.creatingTransferAgreementProposalFailed = false;
    this.isFormValid = false;
    this.opened = false;
    this.existingTransferAgreements$ = of([]);
  }

  onReceiverTinChange(receiverTin: string | null) {
    this.existingTransferAgreements$ = this.store.getExistingTransferAgreements$(receiverTin);
  }

  createAgreementProposal(transferAgreement: {
    receiver: { tin: string; base64EncodedWalletDepositEndpoint: string };
    period: { startDate: number; endDate: number | null; hasEndDate: boolean };
  }) {
    const { receiver, period } = transferAgreement;
    const { tin: receiverTin } = receiver;
    const { startDate, endDate } = period;

    if (!startDate) return;

    this.creatingTransferAgreementProposal = true;
    this.proposalId = null;
    this.service.createAgreementProposal({ receiverTin, startDate, endDate }).subscribe({
      next: (proposalId) => {
        this.proposalId = proposalId;
        this.creatingTransferAgreementProposal = false;
        this.creatingTransferAgreementProposalFailed = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.proposalId = null;
        this.creatingTransferAgreementProposal = false;
        this.creatingTransferAgreementProposalFailed = true;
        this.cd.detectChanges();
      },
    });
  }
}
