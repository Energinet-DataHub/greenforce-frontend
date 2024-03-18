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
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { translations } from '@energinet-datahub/eo/translations';

import { EoListedTransfer, EoTransfersService } from './eo-transfers.service';
import { EoTransfersFormComponent } from './form/eo-transfers-form.component';
import { EoAuthStore } from '@energinet-datahub/eo/shared/services';

// TODO: MOVE THIS TO DOMAIN
export interface EoTransferAgreementsWithRecipient {
  startDate: number;
  endDate: number | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-create-modal',
  imports: [
    EoTransfersFormComponent,
    WATT_MODAL,
    WattSpinnerComponent,
    WattValidationMessageComponent,
    TranslocoPipe,
  ],
  standalone: true,
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [title]="translations.createTransferAgreementProposal.title | transloco"
        [closeLabel]="translations.createTransferAgreementProposal.closeLabel | transloco"
        (closed)="onClosed()"
        minHeight="634px"
      >
        <!-- We don't use the build-in loading state for the modal, since it wont update properly -->
        @if (creatingTransferAgreementProposal) {
          <div class="watt-modal__spinner" style="z-index: 2;">
            <watt-spinner />
          </div>
        }

        <eo-transfers-form
          [senderTin]="ownTin()"
          [transferAgreements]="transferAgreements"
          [generateProposalFailed]="creatingTransferAgreementProposalFailed"
          [proposalId]="proposalId"
          (submitted)="createAgreementProposal($event)"
          (canceled)="modal.close(false)"
        />
      </watt-modal>
    }
  `,
})
export class EoTransfersCreateModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  @Input() transferAgreements: EoListedTransfer[] = [];

  protected translations = translations;
  protected recipientTins: string[] = [];
  protected ownTin = signal<string | undefined>(undefined);

  protected creatingTransferAgreementProposal = false;
  protected creatingTransferAgreementProposalFailed = false;
  protected isFormValid = false;
  protected opened = false;
  protected proposalId: null | string = null;

  protected authStore = inject(EoAuthStore);
  private service = inject(EoTransfersService);
  private cd = inject(ChangeDetectorRef);

  open() {
    /**
     * This is a workaround for "lazy loading" the modal content
     */
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();

    this.authStore.getTin$.subscribe((tin) => {
      this.ownTin.set(tin);
    });
  }

  onClosed() {
    this.creatingTransferAgreementProposal = false;
    this.creatingTransferAgreementProposalFailed = false;
    this.isFormValid = false;
    this.opened = false;
  }

  createAgreementProposal(transferAgreement: {
    receiverTin: string;
    period: { startDate: number; endDate: number | null; hasEndDate: boolean };
  }) {
    const { period, receiverTin } = transferAgreement;
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
