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
import { PushModule } from '@rx-angular/template/push';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersFormComponent } from './eo-transfers-form.component';
import { EoTransfersStore } from './eo-transfers.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-edit-modal',
  imports: [PushModule, WATT_MODAL, WattValidationMessageComponent, NgIf, EoTransfersFormComponent],
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
      ></watt-validation-message>

      <eo-transfers-form
        submitButtonText="Save"
        [editableFields]="['hasEndDate', 'endDate', 'endDateTime']"
        [initialValues]="initialValues"
        (submitted)="saveTransferAgreement($event)"
        (canceled)="modal.close(false)"
      ></eo-transfers-form>
    </watt-modal>
  `,
})
export class EoTransfersEditModalComponent implements OnChanges {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  @Input() transfer?: EoListedTransfer;

  protected opened = false;
  protected initialValues = {};

  private store = inject(EoTransfersStore);
  private cd = inject(ChangeDetectorRef);

  transfer$ = this.store.selectedTransfer$;
  patchingTransfer$ = this.store.patchingTransfer$;
  patchingTransferError$ = this.store.patchingTransferError$;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transfer'] && this.transfer) {
      this.initialValues = {
        receiverTin: this.transfer.receiverTin,
        startDate: new Date(this.transfer.startDate),
        startDateTime: new Date(this.transfer.startDate).getHours().toString().padStart(2, '0'),
        hasEndDate: this.transfer.endDate !== null,
        endDate: this.transfer.endDate ? new Date(this.transfer.endDate) : null,
        endDateTime: this.transfer.endDate
          ? new Date(this.transfer.endDate).getHours().toString().padStart(2, '0')
          : null,
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

  onClosed() {
    this.opened = false;
  }

  saveTransferAgreement(values: { hasEndDate: boolean; endDate: string; endDateTime: string }) {
    const { hasEndDate, endDate, endDateTime } = values;
    const dateWithTime = hasEndDate ? new Date(endDate).setHours(parseInt(endDateTime), 0, 0, 0) : null;

    this.store.patchSelectedTransfer({
      endDate: dateWithTime,
      onSuccess: () => {
        this.modal.close(true);
      },
    });
  }
}
