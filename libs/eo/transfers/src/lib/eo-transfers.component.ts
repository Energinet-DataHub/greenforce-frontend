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
 * Unless required by(hasProductionMeteringPoints | async) === false=== false=== falseg, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { AsyncPipe } from '@angular/common';

import {
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
} from '@energinet-datahub/watt/expandable-card';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { translations } from '@energinet-datahub/eo/translations';
import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/components/ui-popup-message';
import { EoMeteringPointsStore } from '@energinet-datahub/eo/metering-points/data-access-api';

import { EoTransfersTableComponent } from './eo-transfers-table.component';
import {
  EoListedTransfer,
  EoTransferAgreementProposal,
  EoTransfersService,
} from './eo-transfers.service';
import { EoTransfersRespondProposalComponent } from './eo-transfers-respond-proposal.component';
import { EoActorService } from '@energinet-datahub/eo/auth/data-access';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { FormBuilder, ReactiveFormsModule, ValueChangeEvent } from '@angular/forms';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { filter } from 'rxjs';
import { EoTransfersCreateModalComponent } from './eo-transfers-create-modal.component';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

export interface TransferAgreementValues {
  id: string;
  period: { endDate: number | null; hasEndDate: boolean };
}

export interface EoTransferTableElement extends EoListedTransfer {
  period?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers',
  imports: [
    WattBadgeComponent,
    WattExpandableCardComponent,
    WattExpandableCardTitleComponent,
    EoTransfersTableComponent,
    EoPopupMessageComponent,
    EoTransfersRespondProposalComponent,
    TranslocoPipe,
    WattButtonComponent,
    ReactiveFormsModule,
    WattDropdownComponent,
    EoTransfersCreateModalComponent,
    AsyncPipe,
  ],
  styles: [
    `
      .transfer-actions {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;

        form {
          align-content: center;
        }
      }
    `,
  ],
  template: `
    @if (transferAgreements().error) {
      <eo-popup-message
        [title]="translations.transfers.error.title | transloco"
        [message]="translations.transfers.error.message | transloco"
      />
    }
    <div class="transfer-actions">
      <!-- Status filter -->
      <form [formGroup]="filterForm">
        <watt-dropdown
          [chipMode]="true"
          [placeholder]="translations.transfers.transferAgreementStatusFilterLabel | transloco"
          formControlName="statusFilter"
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
      <!-- Create transfer agreement button -->
      <watt-button
        data-testid="new-agreement-button"
        icon="plus"
        variant="secondary"
        [disabled]="(shouldEnableCreateTransferAgreementProposal | async) === false"
        (click)="transfersModal.open()"
      >
        {{ translations.transfers.createNewTransferAgreement | transloco }}
      </watt-button>
    </div>

    <!-- Own transfer agreements -->
    <watt-expandable-card
      data-testid="own-transfer-agreements-card"
      class="watt-space-stack-m"
      [expanded]="true"
    >
      <watt-badge type="neutral" size="large">{{ transferAgreements().data.length }}</watt-badge>
      <watt-expandable-card-title
        >{{ translations.transfers.tableOwnAgreementsTitle | transloco }}
      </watt-expandable-card-title>
      <eo-transfers-table
        data-testid="own-transfer-agreements-table"
        [dataSource]="dataSourceForOwnTransfers"
        [transfers]="transferAgreements().data"
        [loading]="transferAgreements().loading"
        [selectedTransfer]="selectedTransfer()"
        (transferSelected)="selectedTransfer.set($event)"
        (saveTransferAgreement)="onSaveTransferAgreement($event)"
        (removeProposal)="onRemoveProposal($event)"
      />
    </watt-expandable-card>

    <!-- Transfer agreements from POA -->
    <watt-expandable-card
      data-testid="transfer-agreements-from-poa-card"
      class="watt-space-stack-m"
    >
      <watt-badge type="neutral" size="large">{{
        transferAgreementsFromPOA().data.length
      }}</watt-badge>
      <watt-expandable-card-title
        >{{ translations.transfers.tablePOAAgreementsTitle | transloco }}
      </watt-expandable-card-title>
      <eo-transfers-table
        data-testid="transfer-agreements-from-poa-table"
        [dataSource]="dataSourceForPOATransfers"
        [transfers]="transferAgreementsFromPOA().data"
        [loading]="transferAgreementsFromPOA().loading"
        [selectedTransfer]="selectedTransferFromPOA()"
        (transferSelected)="selectedTransferFromPOA.set($event)"
        (saveTransferAgreement)="onSaveTransferAgreement($event)"
        (removeProposal)="onRemoveProposal($event)"
      />
    </watt-expandable-card>

    <!-- Respond proposal modal -->
    <eo-transfers-repsond-proposal
      [proposalId]="proposalId"
      (accepted)="onAcceptedProposal($event)"
      (declined)="onRemoveProposal($event)"
    />

    <eo-transfers-create-modal
      [transferAgreements]="transferAgreements().data"
      [actors]="actors()"
      (transferAgreementCreated)="addTransfer($event)"
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
  private actorService = inject(EoActorService);
  private toastService = inject(WattToastService);
  private meteringPointStore = inject(EoMeteringPointsStore);
  private formBuilder = inject(FormBuilder);
  private utils = inject(SharedUtilities);

  protected actors = this.actorService.actors;
  protected shouldEnableCreateTransferAgreementProposal =
    this.meteringPointStore.hasProductionMeteringPoints$;
  protected translations = translations;
  protected transferAgreements = signal<{
    loading: boolean;
    error: boolean;
    data: EoListedTransfer[];
  }>({
    loading: false,
    error: false,
    data: [],
  });
  protected transferAgreementsFromPOA = signal<{
    loading: boolean;
    error: boolean;
    data: EoListedTransfer[];
  }>({
    loading: false,
    error: false,
    data: [],
  });
  protected selectedTransfer = signal<EoListedTransfer | undefined>(undefined);
  protected selectedTransferFromPOA = signal<EoListedTransfer | undefined>(undefined);
  protected filterForm = this.formBuilder.group({ statusFilter: '' });
  protected dataSourceForOwnTransfers = new WattTableDataSource<EoTransferTableElement>();
  protected dataSourceForPOATransfers = new WattTableDataSource<EoTransferTableElement>();

  ngOnInit(): void {
    this.getTransfers();
    this.getTransfersFromPOA();
    this.meteringPointStore.loadMeteringPoints();

    if (this.proposalId) {
      this.respondProposal.open();
    }

    this.filterForm.events
      .pipe(filter((event) => event instanceof ValueChangeEvent))
      .subscribe(() => this.applyFilters());
  }

  protected onRemoveProposal(id: string | undefined) {
    if (!id) {
      return;
    }
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

    this.transfersService.createTransferAgreementFromProposal(proposal.id).subscribe({
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

  onSaveTransferAgreement(values: TransferAgreementValues) {
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

  private getTransfersFromPOA() {
    this.transferAgreementsFromPOA.set({
      loading: true,
      error: false,
      data: [],
    });
    this.transfersService.getTransfersFromPOA().subscribe({
      next: (transferAgreements: EoListedTransfer[]) => {
        this.transferAgreementsFromPOA.set({
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
        this.transferAgreementsFromPOA.set({
          loading: false,
          error: true,
          data: [],
        });
      },
    });
  }

  applyFilters() {
    this.dataSourceForOwnTransfers.data = this.transferAgreements().data.filter((transfer) =>
      this.filterByStatus(transfer.startDate, transfer.endDate)
    );
    this.dataSourceForPOATransfers.data = this.transferAgreementsFromPOA().data.filter((transfer) =>
      this.filterByStatus(transfer.startDate, transfer.endDate)
    );
  }

  filterByStatus(startDate: number | null, endDate: number | null): boolean {
    if (this.filterForm.controls['statusFilter'].value === null || !startDate) return true;

    return (
      this.filterForm.controls['statusFilter'].value ===
      this.utils.isDateActive(startDate, endDate).toString()
    );
  }
}
