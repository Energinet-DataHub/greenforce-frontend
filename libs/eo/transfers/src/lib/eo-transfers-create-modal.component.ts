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
} from '@angular/core';
import { getUnixTime } from 'date-fns';
import { PushModule } from '@rx-angular/template/push';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { EoTransfersService } from './eo-transfers.service';
import { EoTransfersStore } from './eo-transfers.store';
import { EoTransfersFormComponent } from './eo-transfers-form.component';
import { EoAuthStore } from '@energinet-datahub/eo/shared/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-create-modal',
  imports: [WATT_MODAL, WattValidationMessageComponent, NgIf, EoTransfersFormComponent, PushModule],
  standalone: true,
  template: `
    <watt-modal
      #modal
      title="New transfer agreement"
      [size]="'small'"
      closeLabel="Close modal"
      [loading]="creatingTransferAgreement"
      (closed)="onClosed()"
      *ngIf="opened"
    >
      <watt-validation-message
        *ngIf="creatingTransferAgreementFailed"
        label="Oops!"
        message="Something went wrong. Please try again."
        icon="danger"
        type="danger"
        size="compact"
      ></watt-validation-message>

      <eo-transfers-form
        [senderTin]="authStore.getTin$ | push"
        (submitted)="createAgreement($event)"
        (canceled)="modal.close(false)"
      ></eo-transfers-form>
    </watt-modal>
  `,
})
export class EoTransfersCreateModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected creatingTransferAgreement = false;
  protected creatingTransferAgreementFailed = false;
  protected isFormValid = false;
  protected opened = false;

  constructor(
    private service: EoTransfersService,
    private store: EoTransfersStore,
    private cd: ChangeDetectorRef,
    protected authStore: EoAuthStore
  ) {}

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createAgreement(transferAgreement: any) {
    const { receiverTin, startDate, startDateTime, endDate, endDateTime } = transferAgreement;
    if (!receiverTin || !startDate || !startDateTime) return;

    const transfer = {
      startDate: getUnixTime(new Date(startDate).setHours(parseInt(startDateTime), 0, 0, 0)),
      endDate:
        endDate && endDateTime
          ? getUnixTime(new Date(endDate).setHours(parseInt(endDateTime), 0, 0, 0))
          : null,
      receiverTin,
    };

    this.creatingTransferAgreement = true;
    this.service.createAgreement(transfer).subscribe({
      next: (transfer) => {
        this.store.addTransfer(transfer);
        this.creatingTransferAgreement = false;
        this.creatingTransferAgreementFailed = false;
        this.cd.detectChanges();
        this.modal.close(true);
      },
      error: () => {
        this.creatingTransferAgreement = false;
        this.creatingTransferAgreementFailed = true;
        this.cd.detectChanges();
      },
    });
  }
}
