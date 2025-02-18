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
  effect,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { translations } from '@energinet-datahub/eo/translations';

import { EoListedTransfer, EoTransfersService } from './eo-transfers.service';
import {
  EoTransfersFormComponent,
  EoTransfersFormInitialValues,
} from './form/eo-transfers-form.component';
import { TransferAgreementValues } from './eo-transfers.component';
import { Actor } from '@energinet-datahub/eo/auth/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-edit-modal',
  imports: [WATT_MODAL, WattValidationMessageComponent, EoTransfersFormComponent, TranslocoPipe],
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [title]="translations.transferAgreementEdit.title | transloco"
        size="small"
        [closeLabel]="translations.transferAgreementEdit.closeLabel | transloco"
        [loading]="editTransferAgreementState().loading"
        (closed)="onClosed()"
      >
        @if (editTransferAgreementState().error) {
          <watt-validation-message
            [label]="translations.transferAgreementEdit.error.title | transloco"
            [message]="translations.transferAgreementEdit.error.message | transloco"
            icon="danger"
            type="danger"
            size="compact"
          />
        }
        <eo-transfers-form
          [submitButtonText]="translations.transferAgreementEdit.saveChanges | transloco"
          [cancelButtonText]="translations.transferAgreementEdit.cancel | transloco"
          mode="edit"
          [transferId]="transfer()?.id"
          [transferAgreements]="transferAgreements()"
          [actors]="actors()"
          [editableFields]="['endDate']"
          [initialValues]="initialValues()"
          (submitted)="onSubmit($event)"
          (canceled)="modal.close(false)"
        />
      </watt-modal>
    }
  `,
})
export class EoTransfersEditModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  transfer = input<EoListedTransfer>();
  transferAgreements = input<EoListedTransfer[]>([]);
  actors = input.required<Actor[]>();

  save = output<TransferAgreementValues>();

  protected translations = translations;
  protected opened = false;
  protected initialValues = signal<EoTransfersFormInitialValues>({});

  private transfersService = inject(EoTransfersService);
  private cd = inject(ChangeDetectorRef);

  protected editTransferAgreementState = signal<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false,
  });

  constructor() {
    effect(() => {
      const transfer = this.transfer();
      if (transfer) {
        this.initialValues.set({
          senderTin: transfer.senderTin as string,
          receiverTin: transfer.receiverTin as string,
          startDate: transfer.startDate as number,
          endDate: transfer.endDate as number,
          transferAgreementQuantityType: 'TransferAllCertificates',
        });
      }
    });
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
    if (!this.transfer() || this.transfer()?.id === undefined) return;

    this.editTransferAgreementState.set({ loading: true, error: false });

    const { endDate } = values.period;
    this.transfersService.updateAgreement(this.transfer()?.id as string, endDate).subscribe({
      next: () => {
        this.modal.close(true);
        this.editTransferAgreementState.set({ loading: false, error: false });
        this.save.emit({ ...values, id: this.transfer()?.id as string });
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
