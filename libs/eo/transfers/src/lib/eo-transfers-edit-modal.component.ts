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
} from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { EoListedTransfer } from './eo-transfers.service';
import {
  EoTransfersFormComponent,
  EoTransfersFormInitialValues,
} from './form/eo-transfers-form.component';
import { EoExistingTransferAgreement, EoTransfersStore } from './eo-transfers.store';
import { Observable, of } from 'rxjs';

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
      [loading]="patchingTransfer$ | push"
      (closed)="onClosed()"
      *ngIf="opened"
    >
      <watt-validation-message
        *ngIf="patchingTransferError$ | push"
        label="Oops!"
        message="Something went wrong. Please try again."
        icon="danger"
        type="danger"
        size="compact"
      />

      <eo-transfers-form
        submitButtonText="Save"
        mode="edit"
        [editableFields]="['endDate']"
        [existingTransferAgreements]="existingTransferAgreements$ | push"
        [initialValues]="initialValues"
        (submitted)="saveTransferAgreement($event)"
        (canceled)="modal.close(false)"
      />
    </watt-modal>
  `,
})
export class EoTransfersEditModalComponent implements OnChanges {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  @Input() transfer?: EoListedTransfer;

  protected opened = false;
  protected initialValues!: EoTransfersFormInitialValues;
  protected existingTransferAgreements$: Observable<EoExistingTransferAgreement[]> = of([]);

  private store = inject(EoTransfersStore);
  private cd = inject(ChangeDetectorRef);

  protected patchingTransfer$ = this.store.patchingTransfer$;
  protected patchingTransferError$ = this.store.patchingTransferError$;

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

    if (!this.transfer) return;
    this.existingTransferAgreements$ = this.store.getExistingTransferAgreements$(
      this.transfer.receiverTin,
      this.transfer.id
    );
  }

  onClosed() {
    this.opened = false;
    this.store.setPatchingTransferError(null);
  }

  saveTransferAgreement(values: { period: { endDate: number | null; hasEndDate: boolean } }) {
    const { endDate } = values.period;
    this.store.patchSelectedTransfer({
      endDate,
      onSuccess: () => {
        this.modal.close(true);
      },
    });
  }
}
