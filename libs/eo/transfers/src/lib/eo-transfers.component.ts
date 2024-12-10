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
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { translations } from '@energinet-datahub/eo/translations';
import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/components/ui-popup-message';
import { EoMeteringPointsStore } from '@energinet-datahub/eo/metering-points/data-access-api';
import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';

import { EoTransfersTableComponent } from './eo-transfers-table.component';
import {
  EoListedTransfer,
  EoTransferAgreementProposal,
  EoTransfersService,
} from './eo-transfers.service';
import { EoTransfersRespondProposalComponent } from './eo-transfers-respond-proposal.component';
import { EoTransfersCreateModalComponent } from './eo-transfers-create-modal.component';

const selector = 'eo-transfers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector,
  imports: [
    WattButtonComponent,
    EoTransfersTableComponent,
    EoPopupMessageComponent,
    EoTransfersRespondProposalComponent,
    TranslocoPipe,
    AsyncPipe,
    WATT_EXPANDABLE_CARD_COMPONENTS,
    EoTransfersCreateModalComponent,
    WattDropdownComponent,
    ReactiveFormsModule,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: `
    ${selector} {
      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--watt-space-m);
      }

      .watt-expandable-card.mat-expansion-panel .mat-expansion-panel-body {
        border-top: none;
      }
    }
  `,
  standalone: true,
  template: `
    @if (transferAgreements().error) {
      <eo-popup-message
        [title]="translations.transfers.error.title | transloco"
        [message]="translations.transfers.error.message | transloco"
      />
    }

    <div class="actions">
      <form [formGroup]="filterForm">
        <watt-dropdown
          [chipMode]="true"
          [placeholder]="translations.transfers.transferAgreementStatusFilterLabel | transloco"
          formControlName="statusFilter"
          (ngModelChange)="applyFilters()"
          [options]="[
            {
              value: 'true',
              displayValue: translations.transfers.activeTransferAgreement | transloco,
            },
            {
              value: 'false',
              displayValue: translations.transfers.inactiveTransferAgreement | transloco,
            },
          ]"
        />
      </form>
      <watt-button
        data-testid="new-agreement-button"
        icon="plus"
        variant="secondary"
        (click)="transfersModal.open()"
      >
        {{ translations.transfers.createNewTransferAgreement | transloco }}
      </watt-button>
    </div>

    <watt-expandable-card [togglePosition]="'before'">
      <watt-expandable-card-title>
        Egne overførselsaftaler
        <span class="watt-chip-label">{{transferAgreements().filteredData.length}}</span>
      </watt-expandable-card-title>
      <eo-transfers-table
        [enableCreateTransferAgreementProposal]="!!(hasProductionMeteringPoints | async)"
        [transfers]="transferAgreements().filteredData"
        [loading]="transferAgreements().loading"
        [selectedTransfer]="selectedTransfer()"
        (transferSelected)="selectedTransfer.set($event)"
        (saveTransferAgreement)="onSaveTransferAgreement($event)"
        (proposalCreated)="addTransfer($event)"
        (removeProposal)="onRemoveProposal($event)"
      />
    </watt-expandable-card>

    <watt-expandable-card [togglePosition]="'before'" [expanded]="true">
      <watt-expandable-card-title>
        Overførselsaftaler via fuldmagt
        <span class="watt-chip-label">{{transferAgreements().filteredData.length}}</span>
      </watt-expandable-card-title>
      <eo-transfers-table
        [enableCreateTransferAgreementProposal]="!!(hasProductionMeteringPoints | async)"
        [transfers]="transferAgreements().filteredData"
        [loading]="transferAgreements().loading"
        [selectedTransfer]="selectedTransfer()"
        (transferSelected)="selectedTransfer.set($event)"
        (saveTransferAgreement)="onSaveTransferAgreement($event)"
        (proposalCreated)="addTransfer($event)"
        (removeProposal)="onRemoveProposal($event)"
      />
    </watt-expandable-card>

    <!-- Respond proposal modal -->
    <eo-transfers-repsond-proposal
      [proposalId]="proposalId"
      (accepted)="onAcceptedProposal($event)"
      (declined)="onRemoveProposal($event)"
    />

    <!-- Create transfer agreement modal -->
    <eo-transfers-create-modal
      [transferAgreements]="transferAgreements().data"
      (proposalCreated)="addTransfer($event)"
    />
  `,
})
export class EoTransfersComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('respond-proposal') proposalId!: string;

  @ViewChild(EoTransfersRespondProposalComponent, { static: true })
  respondProposal!: EoTransfersRespondProposalComponent;

  @ViewChild(EoTransfersCreateModalComponent) transfersModal!: EoTransfersCreateModalComponent;

  private transloco = inject(TranslocoService);
  private transfersService = inject(EoTransfersService);
  private toastService = inject(WattToastService);
  private meteringPointStore = inject(EoMeteringPointsStore);
  private fb = inject(FormBuilder);
  protected utils = inject(SharedUtilities);

  protected filterForm = this.fb.group({ statusFilter: '' });
  protected hasProductionMeteringPoints = this.meteringPointStore.hasProductionMeteringPoints$;
  protected translations = translations;
  protected transferAgreements = signal<{
    loading: boolean;
    error: boolean;
    data: EoListedTransfer[];
    filteredData: EoListedTransfer[];
  }>({
    loading: false,
    error: false,
    data: [],
    filteredData: [],
  });
  protected selectedTransfer = signal<EoListedTransfer | undefined>(undefined);

  ngOnInit(): void {
    this.getTransfers();
    this.meteringPointStore.loadMeteringPoints();

    if (this.proposalId) {
      this.respondProposal.open();
    }
  }

  applyFilters() {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      filteredData: this.transferAgreements().data.filter((transfer) =>
        this.filterByStatus(transfer.startDate, transfer.endDate)
      ),
    });
  }

  filterByStatus(startDate: number | null, endDate: number | null): boolean {
    if (!this.filterForm.controls['statusFilter'].value || !startDate) return true;

    return (
      this.filterForm.controls['statusFilter'].value ===
      this.utils.isDateActive(startDate, endDate).toString()
    );
  }

  protected onRemoveProposal(id: string) {
    const proposal = this.transferAgreements().data.find((transfer) => transfer.id === id);
    if (proposal) {
      this.removeTransfer(id);
    }

    this.transfersService.deleteAgreementProposal(id).subscribe({
      error: () => {
        this.toastService.open({
          message: this.transloco.translate(
            this.translations.transfers.removalOfTransferAgreementProposalFailed
          ),
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });

        if (proposal) {
          this.addTransfer(proposal);
        }
      },
    });
  }

  protected onAcceptedProposal(proposal: EoTransferAgreementProposal) {
    this.addTransferProposal(proposal);

    this.transfersService.createTransferAgreement(proposal.id).subscribe({
      error: () => {
        this.removeTransfer(proposal.id);

        this.toastService.open({
          message: this.transloco.translate(
            this.translations.transfers.creationOfTransferAgreementFailed
          ),
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });
      },
    });
  }

  onSaveTransferAgreement(values: {
    id: string;
    period: { endDate: number | null; hasEndDate: boolean };
  }) {
    const { endDate } = values.period;
    const { id } = values;

    this.updateEndDateOnTransferAgreement(id, endDate);
    this.updateSelectedTransferAgreement();
  }

  private updateEndDateOnTransferAgreement(id: string, endDate: number | null) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: [
        ...this.transferAgreements().data.map((transfer) => {
          return transfer.id === id
            ? {
                ...transfer,
                endDate,
              }
            : transfer;
        }),
      ],
    });
  }

  private updateSelectedTransferAgreement() {
    this.selectedTransfer.set(
      this.transferAgreements().data.find(
        (transfer: EoListedTransfer) => transfer.id === this.selectedTransfer()?.id
      )
    );
  }

  protected addTransfer(transfer: EoListedTransfer) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: [...this.transferAgreements().data, transfer],
    });
  }

  private addTransferProposal(proposal: EoTransferAgreementProposal) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: [
        ...this.transferAgreements().data,
        {
          ...proposal,
          senderName: proposal.senderCompanyName,
          senderTin: '',
          transferAgreementStatus: 'Proposal',
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
      filteredData: []
    });
    this.transfersService.getTransfers().subscribe({
      next: (transferAgreements: EoListedTransfer[]) => {
        const agreements = transferAgreements.map((transferAgreement) => {
          return {
            ...transferAgreement,
            startDate: transferAgreement.startDate * 1000,
            endDate: transferAgreement.endDate ? transferAgreement.endDate * 1000 : null,
          };
        });

        this.transferAgreements.set({
          loading: false,
          error: false,
          data: agreements,
          filteredData: agreements.filter((transfer) => this.filterByStatus(transfer.startDate, transfer.endDate)),
        });
      },
      error: () => {
        this.transferAgreements.set({
          loading: false,
          error: true,
          data: [],
          filteredData: []
        });
      },
    });
  }
}
