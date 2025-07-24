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
  ChangeDetectorRef,
  Component,
  inject,
  input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { translations } from '@energinet-datahub/ett/translations';

import { EttTransferAgreementsService } from './data/ett-transfer-agreements.service';
import {
  EttTransfersFormComponent,
  EttTransfersFormValues,
} from './form/ett-transfers-form.component';
import { EttAuthService } from '@energinet-datahub/ett/auth/data-access';
import { Actor } from '@energinet-datahub/ett/auth/domain';
import {
  ListedTransferAgreement,
  TransferAgreementProposalRequest,
  TransferAgreementRequest,
} from './data/ett-transfer-agreement.types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'ett-transfers-create-modal',
  imports: [EttTransfersFormComponent, WATT_MODAL, WattSpinnerComponent, TranslocoPipe],
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [title]="translations.createTransferAgreementProposal.title | transloco"
        [closeLabel]="translations.createTransferAgreementProposal.closeLabel | transloco"
        (closed)="onClosed()"
        minHeight="650px"
        size="large"
      >
        <!-- We don't use the build-in loading state for the modal, since it wont update properly -->
        @if (creatingTransferAgreementProposal()) {
          <div class="watt-modal__spinner" style="z-index: 2;">
            <watt-spinner />
          </div>
        }

        <ett-transfers-form
          [initialValues]="{ senderTin: authService.user()?.profile?.org_cvr }"
          [transferAgreements]="transferAgreements()"
          [actors]="actors()"
          [generateProposalFailed]="creatingTransferAgreementProposalFailed()"
          [proposalId]="proposalId()"
          (submitted)="createAgreement($event)"
          (canceled)="modal.close(false)"
          [mode]="'create'"
        />
      </watt-modal>
    }
  `,
})
export class EttCreateTransferAgreementModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  transferAgreements = input.required<ListedTransferAgreement[]>();
  actors = input.required<Actor[]>();
  protected authService = inject(EttAuthService);
  protected translations = translations;
  protected isFormValid = false;
  protected opened = false;
  private cd = inject(ChangeDetectorRef);
  private transferArgeementsService = inject(EttTransferAgreementsService);
  protected proposalId = this.transferArgeementsService.newlyCreatedProposalId;
  creatingTransferAgreementProposal =
    this.transferArgeementsService.creatingTransferAgreementProposal;
  creatingTransferAgreementProposalFailed =
    this.transferArgeementsService.creatingTransferAgreementProposalFailed;

  open() {
    /**
     * This is a workaround for "lazy loading" the modal content
     */
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  onClosed() {
    this.transferArgeementsService.setCreatingTransferAgreementProposal(false);
    this.transferArgeementsService.setCreatingTransferAgreementProposalFailed(false);
    this.isFormValid = false;
    this.opened = false;
  }

  createAgreement(transferAgreementFormValues: EttTransfersFormValues) {
    transferAgreementFormValues.isProposal
      ? this.createAgreementProposal(transferAgreementFormValues)
      : this.createAgreementRequest(transferAgreementFormValues);
  }

  createAgreementProposal(transferAgreementFormValues: EttTransfersFormValues) {
    const { receiverTin, period } = transferAgreementFormValues;
    const { startDate, endDate } = period;

    if (!startDate) return;

    const senderOrganization: Actor | undefined = this.actors().find(
      (actor) => actor.tin === transferAgreementFormValues.senderTin
    );
    const proposal: TransferAgreementProposalRequest = {
      senderOrganizationId: senderOrganization?.org_id as string,
      startDate,
      endDate: endDate ?? undefined,
      receiverTin: receiverTin,
      type: transferAgreementFormValues.transferAgreementType,
    };

    this.transferArgeementsService.createNewTransferAgreementProposal(
      proposal,
      transferAgreementFormValues.senderTin as string
    );
  }

  createAgreementRequest(transferAgreementFormValues: EttTransfersFormValues) {
    const receiverOrganization: Actor | undefined = this.actors().find(
      (actor) => actor.tin === transferAgreementFormValues.receiverTin
    );
    const senderOrganization: Actor | undefined = this.actors().find(
      (actor) => actor.tin === transferAgreementFormValues.senderTin
    );
    if (!receiverOrganization || !senderOrganization) return;

    const transferAgreementRequest: TransferAgreementRequest = {
      receiverOrganizationId: receiverOrganization.org_id,
      senderOrganizationId: senderOrganization.org_id,
      startDate: transferAgreementFormValues.period.startDate,
      endDate: transferAgreementFormValues.period.endDate ?? undefined,
      type: transferAgreementFormValues.transferAgreementType,
    };

    this.transferArgeementsService.createNewTransferAgreement(
      transferAgreementRequest,
      receiverOrganization.org_name
    );
  }
}
