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
  ViewChild,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';

import {
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
} from '@energinet-datahub/watt/expandable-card';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { translations } from '@energinet-datahub/ett/translations';
import { EttPopupMessageComponent } from '@energinet-datahub/ett/shared/components/ui-popup-message';
import { EttMeteringPointsStore } from '@energinet-datahub/ett/metering-points/data-access-api';

import { EttTransferAgreementsTableComponent } from './ett-transfer-agreements-table.component';
import { EttTransferAgreementsService } from './data/ett-transfer-agreements.service';
import { EttTransferAgreementRespondProposalComponent } from './ett-transfer-agreement-respond-proposal.component';
import { EttActorService } from '@energinet-datahub/ett/auth/data-access';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { FormBuilder, ReactiveFormsModule, ValueChangeEvent } from '@angular/forms';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { filter } from 'rxjs';
import { EttCreateTransferAgreementModalComponent } from './ett-create-transfer-agreement-modal.component';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { SharedUtilities } from '@energinet-datahub/ett/shared/utilities';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import {
  ListedTransferAgreement,
  TransferAgreementProposal,
} from './data/ett-transfer-agreement.types';

export interface TransferAgreementValues {
  id: string;
  period: { endDate: number | null; hasEndDate: boolean };
}

export interface EttTransferTableElement extends ListedTransferAgreement {
  period?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ett-transfers',
  imports: [
    WattBadgeComponent,
    WattExpandableCardComponent,
    WattExpandableCardTitleComponent,
    EttTransferAgreementsTableComponent,
    EttPopupMessageComponent,
    EttTransferAgreementRespondProposalComponent,
    TranslocoPipe,
    WattButtonComponent,
    ReactiveFormsModule,
    WattDropdownComponent,
    EttCreateTransferAgreementModalComponent,
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
      <ett-popup-message
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
        [disabled]="(shouldEnableCreateTransferAgreementButton | async) === false"
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
        >{{ translations.transfers.tablettwnAgreementsTitle | transloco }}
      </watt-expandable-card-title>
      <ett-transfers-table
        data-testid="own-transfer-agreements-table"
        [dataSource]="dataSourceForOwnTransferAgreements"
        [transferAgreements]="transferAgreements().data"
        [loading]="transferAgreements().loading"
        [selectedTransferAgreement]="selectedTransferAgreement()"
        (selectTransferAgreement)="setSelectedTransferAgreement($event)"
        (updateTransferAgreement)="updateTransferAgreement($event)"
        (removeTransferAgreementProposal)="removeTransferAgreementProposal($event)"
      />
    </watt-expandable-card>

    <!-- Transfer agreements from POA -->
    <watt-expandable-card
      data-testid="transfer-agreements-from-poa-card"
      class="watt-space-stack-m"
      [expanded]="true"
    >
      <watt-badge type="neutral" size="large"
        >{{ transferAgreementsFromPOA().data.length }}
      </watt-badge>
      <watt-expandable-card-title
        >{{ translations.transfers.tablePOAAgreementsTitle | transloco }}
      </watt-expandable-card-title>
      <ett-transfers-table
        data-testid="transfer-agreements-from-poa-table"
        [dataSource]="dataSourceForPOATransferAgreements"
        [transferAgreements]="transferAgreementsFromPOA().data"
        [loading]="transferAgreementsFromPOA().loading"
        [selectedTransferAgreement]="selectedTransferAgreementFromPOA()"
        (selectTransferAgreement)="setSelectedTransferAgreementFromPOA($event)"
        (updateTransferAgreement)="updateTransferAgreement($event)"
        (removeTransferAgreementProposal)="removeTransferAgreementProposal($event)"
      />
    </watt-expandable-card>

    <!-- Respond proposal modal -->
    <ett-transfers-respond-proposal
      [proposalId]="proposalId"
      (accepted)="acceptProposal($event)"
      (declined)="removeTransferAgreementProposal($event)"
    />

    <ett-transfers-create-modal
      [transferAgreements]="transferAgreements().data"
      [actors]="actors()"
    />
  `,
})
export class EttTransferAgreementsComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('respond-proposal') proposalId!: string;

  @ViewChild(EttTransferAgreementRespondProposalComponent, { static: true })
  respondProposal!: EttTransferAgreementRespondProposalComponent;

  @ViewChild(EttCreateTransferAgreementModalComponent)
  transfersModal!: EttCreateTransferAgreementModalComponent;

  protected translations = translations;
  protected dataSourceForOwnTransferAgreements = new WattTableDataSource<EttTransferTableElement>();
  protected dataSourceForPOATransferAgreements = new WattTableDataSource<EttTransferTableElement>();
  private transloco = inject(TranslocoService);
  private transferAgreementsService = inject(EttTransferAgreementsService);
  protected transferAgreements = this.transferAgreementsService.transferAgreements;
  protected transferAgreementsFromPOA = this.transferAgreementsService.transferAgreementsFromPOA;
  protected selectedTransferAgreement = this.transferAgreementsService.selectedTransferAgreement;
  protected selectedTransferAgreementFromPOA =
    this.transferAgreementsService.selectedTransferAgreementFromPOA;
  private actorService = inject(EttActorService);
  protected actors = this.actorService.actors;
  private toastService = inject(WattToastService);
  private meteringPointStore = inject(EttMeteringPointsStore);
  protected shouldEnableCreateTransferAgreementButton =
    this.meteringPointStore.hasProductionMeteringPoints$;
  private formBuilder = inject(FormBuilder);
  protected filterForm = this.formBuilder.group({ statusFilter: '' });
  private utils = inject(SharedUtilities);

  ngOnInit(): void {
    this.meteringPointStore.loadMeteringPoints();
    this.transferAgreementsService.fetchTransferAgreements();
    this.transferAgreementsService.fetchTransferAgreementsFromPOA();

    if (this.proposalId) {
      this.respondProposal.open();
    }

    this.filterForm.events
      .pipe(filter((event) => event instanceof ValueChangeEvent))
      .subscribe(() => this.applyFilters());
  }

  applyFilters() {
    this.dataSourceForOwnTransferAgreements.data = this.transferAgreements().data.filter(
      (transfer) => this.filterByStatus(transfer.startDate, transfer.endDate)
    );
    this.dataSourceForPOATransferAgreements.data = this.transferAgreementsFromPOA().data.filter(
      (transfer) => this.filterByStatus(transfer.startDate, transfer.endDate)
    );
  }

  filterByStatus(startDate: number | null, endDate: number | null): boolean {
    if (this.filterForm.controls['statusFilter'].value === null || !startDate) return true;

    return (
      this.filterForm.controls['statusFilter'].value ===
      this.utils.isDateActive(startDate, endDate).toString()
    );
  }

  updateTransferAgreement(transferAgreementValues: TransferAgreementValues) {
    this.transferAgreementsService.updateTransferAgreementEndDate(
      transferAgreementValues.id,
      transferAgreementValues.period.endDate
    );
  }

  setSelectedTransferAgreement(transferAgreement: ListedTransferAgreement | undefined) {
    this.transferAgreementsService.setSelectedTransferAgreement(transferAgreement);
  }

  setSelectedTransferAgreementFromPOA(transferAgreement: ListedTransferAgreement | undefined) {
    this.transferAgreementsService.setSelectedTransferAgreementFromPOA(transferAgreement);
  }

  acceptProposal(transferAgreementProposal: TransferAgreementProposal) {
    this.transferAgreementsService.acceptProposal(transferAgreementProposal);
  }

  removeTransferAgreementProposal(transferAgreementId: string | undefined) {
    if (transferAgreementId) {
      this.transferAgreementsService.removeTransferAgreementProposal(transferAgreementId);
    }
  }
}
