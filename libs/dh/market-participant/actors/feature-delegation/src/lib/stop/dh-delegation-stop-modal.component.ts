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
import { Component, ViewChild, inject } from '@angular/core';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { TranslocoDirective } from '@ngneat/transloco';
import { DhDelegation } from '../dh-delegations';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDatepickerV2Component } from '@energinet-datahub/watt/datepicker';

@Component({
  standalone: true,
  selector: 'dh-delegation-stop-modal',
  styles: `
    :host {
      display: block;
    }
  `,
  imports: [
    WATT_MODAL,
    TranslocoDirective,
    WattButtonComponent,
    ReactiveFormsModule,
    VaterStackComponent,
    WattDatepickerV2Component,
  ],
  template: `<watt-modal
    [title]="t('stopModalTitle')"
    *transloco="let t; read: 'marketParticipant.delegation'"
  >
    <form
      id="stop-delegation-form"
      [formGroup]="stopDelegationForm"
      (ngSubmit)="stopSelectedDelegations()"
    >
      <vater-stack align="flex-start">
        <watt-datepicker-v2
          [label]="t('stopDate')"
          [formControl]="stopDelegationForm.controls.stopDate"
        />
      </vater-stack>
      <watt-modal-actions>
        <watt-button (click)="closeModal(false)" variant="secondary">
          {{ t('cancel') }}
        </watt-button>
        <watt-button formId="stop-delegation-form" type="submit" variant="primary">
          {{ t('shared.stopDelegation') }}
        </watt-button>
      </watt-modal-actions>
    </form>
  </watt-modal>`,
})
export class DhDelegationStopModalComponent extends WattTypedModal<DhDelegation[]> {
  private _fb = inject(NonNullableFormBuilder);

  @ViewChild(WattModalComponent)
  modal: WattModalComponent | undefined;

  stopDelegationForm = this._fb.group({
    stopDate: [null, Validators.required],
  });

  closeModal(result: boolean) {
    this.modal?.close(result);
  }

  stopSelectedDelegations() {
    if (this.stopDelegationForm.invalid) return;

    const { stopDate } = this.stopDelegationForm.getRawValue();

    if (!stopDate) return;

    console.log('Stopping delegations', this.modalData);

    this.closeModal(true);
  }
}
