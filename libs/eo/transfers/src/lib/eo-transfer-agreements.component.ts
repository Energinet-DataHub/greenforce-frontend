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

import { EoTransferAgreementsTableComponent } from './eo-transfer-agreements-table.component';
import { EoTransferAgreementsService } from './eo-transfer-agreements.service';
import {
  EoTransferAgreementRespondProposalComponent,
} from './eo-transfer-agreement-respond-proposal.component';
import { EoActorService } from '@energinet-datahub/eo/auth/data-access';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { FormBuilder, ReactiveFormsModule, ValueChangeEvent } from '@angular/forms';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { filter } from 'rxjs';
import {
  EoCreateTransferAgreementModalComponent,
} from './eo-create-transfer-agreement-modal.component';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { ListedTransferAgreement, TransferAgreementProposal } from './transfer-agreement.types';

export interface TransferAgreementValues {
  id: string;
  period: { endDate: number | null; hasEndDate: boolean };
}

export interface EoTransferTableElement extends ListedTransferAgreement {
  period?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers',
  imports: [
    WattBadgeComponent,
    WattExpandableCardComponent,
    WattExpandableCardTitleComponent,
    EoTransferAgreementsTableComponent,
    EoPopupMessageComponent,
    EoTransferAgreementRespondProposalComponent,
    TranslocoPipe,
    WattButtonComponent,
    ReactiveFormsModule,
    WattDropdownComponent,
    EoCreateTransferAgreementModalComponent,
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
        [transferAgreements]="transferAgreements().data"
        [loading]="transferAgreements().loading"
        [selectedTransferAgreement]="selectedTransfer()"
        (selectTransferAgreement)="selectedTransfer.set($event)"
        (saveTransferAgreement)="onSaveTransferAgreement($event)"
        (removeTransferAgreementProposal)="onRemoveProposal($event)"
      />
    </watt-expandable-card>

    <!-- Transfer agreements from POA -->
    <watt-expandable-card
      data-testid="transfer-agreements-from-poa-card"
      class="watt-space-stack-m"
    >
      <watt-badge type="neutral" size="large"
        >{{ transferAgreementsFromPOA().data.length }}
      </watt-badge>
      <watt-expandable-card-title
        >{{ translations.transfers.tablePOAAgreementsTitle | transloco }}
      </watt-expandable-card-title>
      <eo-transfers-table
        data-testid="transfer-agreements-from-poa-table"
        [dataSource]="dataSourceForPOATransfers"
        [transferAgreements]="transferAgreementsFromPOA().data"
        [loading]="transferAgreementsFromPOA().loading"
        [selectedTransferAgreement]="selectedTransferFromPOA()"
        (selectTransferAgreement)="selectedTransferFromPOA.set($event)"
        (saveTransferAgreement)="onSaveTransferAgreement($event)"
        (removeTransferAgreementProposal)="onRemoveProposal($event)"
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
      (createTransferAgreement)="addTransferAgreementToList($event)"
    />
  `,
})
export class EoTransferAgreementsComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('respond-proposal') proposalId!: string;

  @ViewChild(EoTransferAgreementRespondProposalComponent, { static: true })
  respondProposal!: EoTransferAgreementRespondProposalComponent;

  @ViewChild(EoCreateTransferAgreementModalComponent)
  transfersModal!: EoCreateTransferAgreementModalComponent;
  protected translations = translations;
  protected transferAgreements = signal<{
    loading: boolean;
    error: boolean;
    data: ListedTransferAgreement[];
  }>({
    loading: false,
    error: false,
    data: [],
  });
  protected transferAgreementsFromPOA = signal<{
    loading: boolean;
    error: boolean;
    data: ListedTransferAgreement[];
  }>({
    loading: false,
    error: false,
    data: [],
  });
  protected selectedTransfer = signal<ListedTransferAgreement | undefined>(undefined);
  protected selectedTransferFromPOA = signal<ListedTransferAgreement | undefined>(undefined);
  protected dataSourceForOwnTransfers = new WattTableDataSource<EoTransferTableElement>();
  protected dataSourceForPOATransfers = new WattTableDataSource<EoTransferTableElement>();
  private transloco = inject(TranslocoService);
  private transfersService = inject(EoTransferAgreementsService);
  private actorService = inject(EoActorService);
  protected actors = this.actorService.actors;
  private toastService = inject(WattToastService);
  private meteringPointStore = inject(EoMeteringPointsStore);
  protected shouldEnableCreateTransferAgreementProposal =
    this.meteringPointStore.hasProductionMeteringPoints$;
  private formBuilder = inject(FormBuilder);
  protected filterForm = this.formBuilder.group({ statusFilter: '' });
  private utils = inject(SharedUtilities);

  ngOnInit(): void {
    this.getTransferAgreements();
    this.getTransferAgreementsFromPOA();
    this.meteringPointStore.loadMeteringPoints();

    if (this.proposalId) {
      this.respondProposal.open();
    }

    this.filterForm.events
      .pipe(filter((event) => event instanceof ValueChangeEvent))
      .subscribe(() => this.applyFilters());
  }

  onSaveTransferAgreement(values: TransferAgreementValues) {
    const { endDate } = values.period;
    const { id } = values;

    this.updateEndDateOnTransferAgreement(id, endDate);
    this.updateSelectedTransferAgreement();
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

  protected onRemoveProposal(id: string | undefined) {
    if (!id) {
      return;
    }
    const proposal = this.transferAgreements().data.find((transfer) => transfer.id === id);
    if (proposal) {
      this.removeTransfer(id);
    }

    this.transfersService.deleteTransferAgreementProposal(id).subscribe({
      error: () => {
        this.toastService.open({
          message: this.transloco.translate(
            this.translations.transfers.removalOfTransferAgreementProposalFailed
          ),
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });

        if (proposal) {
          this.addTransferAgreementToList(proposal);
        }
      },
    });
  }

  protected onAcceptedProposal(proposal: TransferAgreementProposal) {
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

  protected addTransferAgreementToList(transfer: ListedTransferAgreement) {
    const isTransferAgreementFromOrToSelf =
      this.actorService.self.tin === transfer.senderTin ||
      this.actorService.self.tin === transfer.receiverTin;
    const isTransferAgreementFromOrToActorFromPOA = !!this.actorService
      .actors()
      .find((actor) => actor.tin === transfer.senderTin || actor.tin === transfer.receiverTin);

    if (isTransferAgreementFromOrToSelf) {
      this.transferAgreements.set({
        ...this.transferAgreements(),
        data: [...this.transferAgreements().data, transfer],
      });
    }

    if (isTransferAgreementFromOrToActorFromPOA) {
      this.transferAgreementsFromPOA.set({
        ...this.transferAgreementsFromPOA(),
        data: [...this.transferAgreementsFromPOA().data, transfer],
      });
    }
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
        (transfer: ListedTransferAgreement) => transfer.id === this.selectedTransfer()?.id
      )
    );
  }

  private addTransferProposal(proposal: TransferAgreementProposal) {
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

  private getTransferAgreements() {
    this.transferAgreements.set({
      loading: true,
      error: false,
      data: [],
    });
    this.transfersService.getTransferAgreements().subscribe({
      next: (transferAgreements: ListedTransferAgreement[]) => {
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

  private getTransferAgreementsFromPOA() {
    this.transferAgreementsFromPOA.set({
      loading: true,
      error: false,
      data: [],
    });
    this.transfersService.getTransferAgreementsFromPOA().subscribe({
      next: (transferAgreements: ListedTransferAgreement[]) => {
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
}
