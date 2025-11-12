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
import { Component, effect, inject, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import {
  dhCprValidator,
  dhCvrValidator,
} from '@energinet-datahub/dh/shared/ui-validators';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  MoveInType,
  StartMoveInDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattToastService } from '@energinet/watt/toast';

import {
  InstallationAddress,
  MoveInCustomerDetailsFormType,
} from '../types';
import { DhCustomerDetailsComponent } from './customer-details.component';
import { WattButtonComponent } from '@energinet/watt/button';

@Component({
  selector: 'dh-move-in-customer',
  imports: [TranslocoDirective, WATT_MODAL, DhCustomerDetailsComponent, WattButtonComponent],
  template: `
    <watt-modal size="large" [title]="t('title')" *transloco="let t; prefix: 'meteringPoint.moveIn'">
      <dh-customer-details [customerDetailsForm]="customerDetailsForm" />
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal().close(false)">{{
            t('save')
          }}</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhMoveInCustomerModalComponent extends WattTypedModal<{
  installationAddress: InstallationAddress;
}> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly startMoveInMutation = mutation(StartMoveInDocument);
  private readonly toastService = inject(WattToastService);

  readonly modal = viewChild.required(WattModalComponent);

  private readonly customerTypeInitialValue = 'private';

  private privateCustomerForm = this.fb.group({
    name1: this.fb.control<string>('', Validators.required),
    cpr1: this.fb.control<string>('', [Validators.required, dhCprValidator()]),
    name2: this.fb.control<string>(''),
    cpr2: this.fb.control<string>({ value: '', disabled: true }, [
      Validators.required,
      dhCprValidator(),
    ]),
  });

  customerDetailsForm = this.fb.group<MoveInCustomerDetailsFormType>({
    cutOffDate: this.fb.control(new Date(), Validators.required),
    moveInType: this.fb.control<MoveInType | null>(null, Validators.required),
    customerType: this.fb.control(this.customerTypeInitialValue),
    isProtectedAddress: this.fb.control<boolean>(false),
  });

  readonly isForeignCompanyFormControl = this.fb.control<boolean>(false);

  private customerTypeChanged = toSignal(
    this.customerDetailsForm.controls.customerType.valueChanges,
    { initialValue: this.customerTypeInitialValue }
  );

  private isForeignCompanyChanged = toSignal<boolean>(
    this.isForeignCompanyFormControl.valueChanges
  );

  private name1Changed = toSignal(this.privateCustomerForm.controls.name1.valueChanges);
  private name2Changed = toSignal(this.privateCustomerForm.controls.name2.valueChanges);

  private customerTypeEffect = effect(() => {
    const customerType = this.customerTypeChanged();

    if (customerType === 'private') {
      this.customerDetailsForm.addControl('privateCustomer', this.privateCustomerForm);
      this.customerDetailsForm.removeControl('businessCustomer');
    } else {
      this.customerDetailsForm.addControl(
        'businessCustomer',
        this.fb.group({
          companyName: this.fb.control<string>('', Validators.required),
          cvr: this.fb.control<string>('', [Validators.required, dhCvrValidator()]),
          isForeignCompany: this.isForeignCompanyFormControl,
        })
      );

      this.customerDetailsForm.removeControl('privateCustomer');
      this.privateCustomerForm.reset();
    }
  });

  private isForeignCompanyEffect = effect(() => {
    const isForeignCompany = this.isForeignCompanyChanged();
    if (isForeignCompany) {
      this.customerDetailsForm.controls.businessCustomer?.controls.cvr.disable();
      this.customerDetailsForm.controls.businessCustomer?.controls.cvr.setValue('11111111');
    } else {
      this.customerDetailsForm.controls.businessCustomer?.controls.cvr.enable();
      this.customerDetailsForm.controls.businessCustomer?.controls.cvr.reset();
    }
  });

  private name2Effect = effect(() => {
    const name2 = this.name2Changed();
    const cpr2Control = this.privateCustomerForm.controls.cpr2;

    if (name2) {
      cpr2Control.enable();
    } else {
      cpr2Control.disable();
      cpr2Control.reset();
    }
  });

  private success() {
    const message = this.transloco.translate('meteringPoint.moveIn.success');

    this.toastService.open({ type: 'success', message });
    this.modal().close(true);
  }
}
