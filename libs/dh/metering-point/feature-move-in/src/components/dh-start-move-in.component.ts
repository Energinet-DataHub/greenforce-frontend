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
  Component,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { dhCprValidator, dhCvrValidator } from '@energinet-datahub/dh/shared/ui-validators';
import { WattToastService } from '@energinet/watt/toast';

import { StartMoveInFormType } from '../types';
import { DhStartMoveInFormComponent } from './dh-start-move-in-form.component';
import { WattButtonComponent } from '@energinet/watt/button';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  BusinessReasonV1,
  InitiateMoveInDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs } from '@energinet/watt/date';

@Component({
  selector: 'dh-start-move-in-modal',
  imports: [TranslocoDirective, WATT_MODAL, DhStartMoveInFormComponent, WattButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <watt-modal
      size="large"
      [title]="t('title')"
      *transloco="let t; prefix: 'meteringPoint.moveIn'"
    >
      <dh-start-move-in-form [startMoveInForm]="startMoveInForm" />
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="startMoveIn()">{{ t('save') }} </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhStartMoveInComponent extends WattTypedModal<{ meteringPointId: string }> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly initiateMoveIn = mutation(InitiateMoveInDocument);
  private readonly toastService = inject(WattToastService);

  readonly modal = viewChild.required(WattModalComponent);

  private readonly customerTypeInitialValue = 'private';

  private privateCustomerForm = this.fb.group({
    name: this.fb.control<string>('', Validators.required),
    cpr: this.fb.control<string>('', [Validators.required, dhCprValidator()]),
  });

  startMoveInForm = this.fb.group<StartMoveInFormType>({
    cutOffDate: this.fb.control(new Date(), Validators.required),
    businessReason: this.fb.control<BusinessReasonV1>('CUSTOMER_MOVE_IN', Validators.required),
    customerType: this.fb.control(this.customerTypeInitialValue),
  });

  readonly isForeignCompanyFormControl = this.fb.control<boolean>(false);

  private customerTypeChanged = toSignal(this.startMoveInForm.controls.customerType.valueChanges, {
    initialValue: this.customerTypeInitialValue,
  });

  private isForeignCompanyChanged = toSignal<boolean>(
    this.isForeignCompanyFormControl.valueChanges
  );

  private customerTypeEffect = effect(() => {
    const customerType = this.customerTypeChanged();

    if (customerType === 'private') {
      this.startMoveInForm.addControl('privateCustomer', this.privateCustomerForm);
      this.startMoveInForm.removeControl('businessCustomer');
    } else {
      this.startMoveInForm.addControl(
        'businessCustomer',
        this.fb.group({
          companyName: this.fb.control<string>('', Validators.required),
          cvr: this.fb.control<string>('', [Validators.required, dhCvrValidator()]),
          isForeignCompany: this.isForeignCompanyFormControl,
        })
      );

      this.startMoveInForm.removeControl('privateCustomer');
      this.privateCustomerForm.reset();
    }
  });

  private isForeignCompanyEffect = effect(() => {
    const isForeignCompany = this.isForeignCompanyChanged();
    if (isForeignCompany) {
      this.startMoveInForm.controls.businessCustomer?.controls.cvr.disable();
      this.startMoveInForm.controls.businessCustomer?.controls.cvr.setValue('11111111');
    } else {
      this.startMoveInForm.controls.businessCustomer?.controls.cvr.enable();
      this.startMoveInForm.controls.businessCustomer?.controls.cvr.reset();
    }
  });

  async startMoveIn() {
    if (this.startMoveInForm.invalid) {
      return;
    }

    const isCustomerPrivate = this.startMoveInForm.controls.customerType.value === 'private';
    const customerId = isCustomerPrivate
      ? this.startMoveInForm.controls.privateCustomer?.controls.cpr.value
      : this.startMoveInForm.controls.businessCustomer?.controls.cvr.value;
    const customerName = isCustomerPrivate
      ? this.startMoveInForm.controls.privateCustomer?.controls.name.value
      : this.startMoveInForm.controls.businessCustomer?.controls.companyName.value;

    const result = await this.initiateMoveIn.mutate({
      variables: {
        input: {
          businessReason: this.startMoveInForm.controls.businessReason.value,
          startDate: dayjs().toDate(),
          customerIdentification: {
            type: isCustomerPrivate ? 'CPR' : 'CVR',
            id: customerId,
          },
          customerName: customerName ?? '',
          meteringPointId: this.modalData.meteringPointId,
        },
      },
    });

    if (result.data?.initiateMoveIn.success) {
      this.success();
    } else {
      this.error();
    }
  }

  private success() {
    const message = this.transloco.translate('meteringPoint.moveIn.moveInSuccess');

    this.toastService.open({ type: 'success', message });
    this.modal().close(true);
  }

  private error() {
    const message = this.transloco.translate('meteringPoint.moveIn.moveInFail');

    this.toastService.open({ type: 'danger', message });
    this.modal().close(false);
  }
}
