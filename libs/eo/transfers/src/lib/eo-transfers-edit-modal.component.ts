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
  ViewChild,
  ChangeDetectorRef,
  inject,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { EoListedTransfer, EoTransfersService } from './eo-transfers.service';
import {
  EoTransfersFormComponent,
  EoTransfersFormInitialValues,
} from './form/eo-transfers-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-edit-modal',
  imports: [RxPush, WATT_MODAL, WattValidationMessageComponent, NgIf, EoTransfersFormComponent],
  standalone: true,
  template: `
    <watt-modal
      #modal
      title="Edit transfer agreement"
      size="small"
      closeLabel="Close modal"
      [loading]="editTransferAgreementState().loading"
      (closed)="onClosed()"
      *ngIf="opened"
    >
      <watt-validation-message
        *ngIf="editTransferAgreementState().error"
        label="Oops!"
        message="Something went wrong. Please try again."
        icon="danger"
        type="danger"
        size="compact"
      />

      <eo-transfers-form
        submitButtonText="Save"
        mode="edit"
        [transferId]="transfer?.id"
        [transferAgreements]="transferAgreements"
        [editableFields]="['endDate']"
        [initialValues]="initialValues"
        (submitted)="onSubmit($event)"
        (canceled)="modal.close(false)"
      />
    </watt-modal>
  `,
})
export class EoTransfersEditModalComponent implements OnChanges {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  @Input() transfer?: EoListedTransfer;
  @Input() transferAgreements: EoListedTransfer[] = [];

  @Output() save = new EventEmitter();

  protected opened = false;
  protected initialValues!: EoTransfersFormInitialValues;

  private transfersService = inject(EoTransfersService);
  private cd = inject(ChangeDetectorRef);

  protected editTransferAgreementState = signal<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false,
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transfer'] && this.transfer) {
      this.initialValues = {
        receiverTin: this.transfer.receiverTin,
        base64EncodedWalletDepositEndpoint: '***********************************',
        startDate: this.transfer.startDate,
        endDate: this.transfer.endDate,
      };
    }
  }

  open() {
    /**
     * This is a workaround for "lazy loading" the modal content
     */
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  onSubmit(values: { period: { endDate: number | null; hasEndDate: boolean } }) {
    if (!this.transfer) return;

    this.editTransferAgreementState.set({ loading: true, error: false });

    const { endDate } = values.period;
    this.transfersService.updateAgreement(this.transfer.id, endDate).subscribe({
      next: () => {
        this.modal.close(true);
        this.editTransferAgreementState.set({ loading: false, error: false });
        this.save.emit({ ...values, id: this.transfer?.id });
      },
      error: () => {
        this.editTransferAgreementState.set({ loading: false, error: true });
      },
    });
  }

  onClosed() {
    this.opened = false;
  }
}
